from pathlib import Path
from image_gen import scan_placeholders, parse_thread_id, find_generated_image, replace_placeholder
from image_gen import process_file

SAMPLE = '''본문.

<!-- [GEMINI PROMPT: 03_rag-flow]
path: assets/CH03/03_rag-flow.png
A minimalist diagram of RAG pipeline.
Style: architecture-infographic
-->
![RAG 파이프라인](../assets/CH03/03_rag-flow.png)
*그림 3-2: RAG 파이프라인의 전체 흐름*

다음 본문.'''

def test_scan_finds_one():
    phs = scan_placeholders(SAMPLE)
    assert len(phs) == 1

def test_scan_fields():
    ph = scan_placeholders(SAMPLE)[0]
    assert ph.id == '03_rag-flow'
    assert ph.path == 'assets/CH03/03_rag-flow.png'
    assert 'RAG pipeline' in ph.prompt
    assert ph.caption == '*그림 3-2: RAG 파이프라인의 전체 흐름*'

def test_image_prompt_alias():
    text = SAMPLE.replace('GEMINI PROMPT', 'IMAGE PROMPT')
    assert len(scan_placeholders(text)) == 1

def test_parse_thread_id():
    out = '\n'.join([
        '{"type":"thread.started","thread_id":"019ef6f7-3ff9-7a41-97cf-c80126da856d"}',
        '{"type":"turn.started"}',
        '{"type":"turn.completed"}',
    ])
    assert parse_thread_id(out) == '019ef6f7-3ff9-7a41-97cf-c80126da856d'

def test_parse_thread_id_none():
    assert parse_thread_id('비-JSON 출력\n{"type":"turn.started"}') is None

def test_find_generated_image(tmp_path):
    tid = 'abc-123'
    d = tmp_path / 'generated_images' / tid
    d.mkdir(parents=True)
    png = d / 'ig_deadbeef.png'
    png.write_bytes(b'\x89PNG')
    assert find_generated_image(tid, codex_home=tmp_path) == png

def test_find_generated_image_missing(tmp_path):
    assert find_generated_image('nope', codex_home=tmp_path) is None

def test_replace_emits_img_tag():
    ph = scan_placeholders(SAMPLE)[0]
    out = replace_placeholder(SAMPLE, ph)
    assert '<!--' not in out
    assert '<img src="../assets/CH03/03_rag-flow.png" width="720"' in out
    assert '*그림 3-2: RAG 파이프라인의 전체 흐름*' in out

def test_process_file_moves_and_replaces(tmp_path):
    # 프로젝트 구조
    proj = tmp_path
    (proj / 'chapters').mkdir()
    md = proj / 'chapters' / '03.md'
    md.write_text(SAMPLE, encoding='utf-8')
    # 가짜 codex: 생성된 png를 만들어 그 절대경로를 반환
    fake_png = tmp_path / 'gen' / 'ig_x.png'
    fake_png.parent.mkdir()
    fake_png.write_bytes(b'\x89PNG fake')
    def fake_generate(prompt):
        return str(fake_png)
    n = process_file(md, proj, generate=fake_generate)
    assert n == 1
    # 타깃 위치로 이동됨
    assert (proj / 'assets' / 'CH03' / '03_rag-flow.png').exists()
    # 본문 교체됨
    text = md.read_text(encoding='utf-8')
    assert '<img src=' in text and '<!--' not in text


# --- 참고 이미지(ref) — 손그림 스케치를 image-to-image 참조로 넘긴다 ---

_REF_MD = """<!-- [IMAGE PROMPT: ch02-slide07]
A clean educational illustration of a factory method, no text, 16:9
ref: inbox/slide07-sketch.png
path: outputs/03_시각자산/images/ch02/slide07.png
-->
![ch02-slide07](placeholder.png)
"""


def test_ref_parsed_and_excluded_from_prompt():
    ph = scan_placeholders(_REF_MD)[0]
    assert ph.ref == 'inbox/slide07-sketch.png'
    assert ph.path == 'outputs/03_시각자산/images/ch02/slide07.png'
    assert 'ref:' not in ph.prompt and 'path:' not in ph.prompt
    assert ph.prompt.startswith('A clean educational illustration')


def test_ref_absent_defaults_none():
    md = _REF_MD.replace('ref: inbox/slide07-sketch.png\n', '')
    assert scan_placeholders(md)[0].ref is None


def test_process_file_passes_ref_to_generate(tmp_path):
    from image_gen import process_file
    proj = tmp_path / 'proj'; (proj / 'inbox').mkdir(parents=True)
    md = proj / 'ch.md'; md.write_text(_REF_MD, encoding='utf-8')
    src = tmp_path / 'gen.png'; src.write_bytes(b'PNG')
    seen = {}

    def fake_generate(prompt, ref=None):
        seen['prompt'], seen['ref'] = prompt, ref
        return str(src)

    assert process_file(md, proj, generate=fake_generate) == 1
    assert seen['ref'] == 'inbox/slide07-sketch.png'
    assert (proj / 'outputs/03_시각자산/images/ch02/slide07.png').exists()


def test_process_file_one_arg_generate_still_works(tmp_path):
    """ref 없는 블록은 1-인자 스텁으로 호출된다(하위호환)."""
    from image_gen import process_file
    proj = tmp_path / 'proj'; proj.mkdir()
    md = proj / 'ch.md'
    md.write_text(_REF_MD.replace('ref: inbox/slide07-sketch.png\n', ''), encoding='utf-8')
    src = tmp_path / 'gen.png'; src.write_bytes(b'PNG')
    assert process_file(md, proj, generate=lambda prompt: str(src)) == 1
