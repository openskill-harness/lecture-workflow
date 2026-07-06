"""build_pptx 파서/빌더 테스트 (pytest)."""
import textwrap
from pptx import Presentation
from build_pptx import parse_manuscript, build_pptx, build_pptx_from_images

SAMPLE = textwrap.dedent("""\
    # 1차시 원고: 테스트

    ## 차시 정보
    - 과정명: 테스트 과정

    ## Slide 1. 표지
    **Screen**
    - 제목: 테스트 강의
    - 부제: 부제목입니다
    **Narration**
    - 안녕하세요. 첫 번째 나레이션입니다.

    ## Slide 2. 본문
    **Screen**
    - 제목: 본문 슬라이드
    - 짧은 문구:
      - 첫 번째 포인트
      - 두 번째 포인트
    **Visual asset**
    - GPT image prompt: `a test image`
    **Narration**
    - 두 번째 나레이션입니다.
    """)

def test_parse_slide_count_and_titles():
    slides = parse_manuscript(SAMPLE)
    assert len(slides) == 2
    # 표시 제목은 슬라이드 헤더 단어가 아니라 Screen의 `- 제목:` 값을 쓴다.
    assert slides[0]["title"] == "테스트 강의"
    assert slides[1]["title"] == "본문 슬라이드"

def test_parse_narration_and_screen():
    slides = parse_manuscript(SAMPLE)
    assert slides[0]["narration"].startswith("안녕하세요.")
    assert "첫 번째 포인트" in slides[1]["screen_lines"]

def test_build_writes_notes(tmp_path):
    out = tmp_path / "out.pptx"
    build_pptx(SAMPLE, str(out), assets_root=str(tmp_path))
    prs = Presentation(str(out))
    assert len(prs.slides) == 2
    assert prs.slides[0].notes_slide.notes_text_frame.text.startswith("안녕하세요.")


MULTI_CODE_SAMPLE = textwrap.dedent("""\
    # 1차시 원고: 테스트

    ## Slide 1. 요청과 응답

    **Screen**
    - 제목: 요청과 응답 슬라이드

    **Visual asset**
    - Code block for slide:

    ```http
    GET /hello HTTP/1.1
    Host: localhost:8080
    ```

    ```http
    HTTP/1.1 200 OK
    Content-Type: text/plain

    Hello Spring Boot
    ```

    **Narration**
    - 나레이션입니다.
    """)

D2_ONLY_SAMPLE = textwrap.dedent("""\
    # 1차시 원고: 테스트

    ## Slide 1. HTTP 흐름

    **Screen**
    - 제목: HTTP 요청과 응답

    **Visual asset**
    - D2 diagram: `assets/diagrams/ch01_http-request-response.d2`

    ```d2
    browser: "브라우저"
    server: "서버"
    browser -> server: "요청 전달"
    ```

    **Narration**
    - 나레이션입니다.
    """)

FENCE_FALSE_POSITIVE_SAMPLE = textwrap.dedent("""\
    # 1차시 원고: 테스트

    ## Slide 1. 첫 슬라이드
    **Screen**
    - 제목: 첫 슬라이드

    **Visual asset**
    - Code block for slide:

    ```text
    ## Slide 99. 가짜 슬라이드처럼 보이는 코드 줄
    **Narration**
    이건 코드 안의 텍스트일 뿐입니다.
    ```

    **Narration**
    - 진짜 나레이션입니다.

    ## Slide 2. 두 번째 슬라이드
    **Screen**
    - 제목: 두 번째 슬라이드
    **Narration**
    - 두 번째 나레이션입니다.
    """)


def test_multiple_code_fences_are_preserved():
    slides = parse_manuscript(MULTI_CODE_SAMPLE)
    assert len(slides) == 1
    code = slides[0]["code"]
    assert "GET /hello HTTP/1.1" in code
    assert "HTTP/1.1 200 OK" in code
    assert "Hello Spring Boot" in code


def test_d2_fence_is_not_treated_as_display_code():
    slides = parse_manuscript(D2_ONLY_SAMPLE)
    assert len(slides) == 1
    assert slides[0]["code"] == ""


def test_slide_and_field_markers_inside_code_fence_are_ignored():
    slides = parse_manuscript(FENCE_FALSE_POSITIVE_SAMPLE)
    assert len(slides) == 2
    assert slides[0]["title"] == "첫 슬라이드"
    assert slides[1]["title"] == "두 번째 슬라이드"
    assert "## Slide 99." in slides[0]["code"]
    assert slides[0]["narration"] == "진짜 나레이션입니다."
    assert slides[1]["narration"] == "두 번째 나레이션입니다."


# --- Screen 필드 매핑 회귀 테스트 (2026-07-06): 제목=제목라벨, 본문=내용항목만 ---
FIELD_MAPPING_SAMPLE = textwrap.dedent("""\
    # 1차시 원고: 테스트

    ## Slide 1. 표지
    **Screen**
    - 관련 학습목표: 표지
    - 제목: 서버 프로그램과 웹 애플리케이션 실행 환경 이해
    - 부제: 처음부터 보기
    - 핵심 정의: 웹 애플리케이션은 요청을 처리한다.
    - 화면: 템플릿 표지 레이아웃 사용
    **Narration**
    - 나레이션.

    ## Slide 2. 본문
    **Screen**
    - 학습목표: 서버의 역할을 설명한다.
    - 제목: 서버 프로그램의 기본 역할
    - 짧은 문구:
      - 요청을 받는다
      - 필요한 처리를 한다
      - 응답을 돌려준다
    - 핵심 정의: 서버 프로그램은 요청을 처리한다.
    - 화면: 손님 주방 흐름 일러스트
    **Narration**
    - 나레이션.

    ## Slide 3. 목표
    **Screen**
    - 제목: 오늘의 학습목표
    - 학습목표:
      1. 첫째 목표
      2. 둘째 목표
    - 학습내용:
      1. 첫째 내용
    - 핵심 정의: 정의 문장.
    **Narration**
    - 나레이션.
    """)


def test_title_comes_from_jemok_not_header():
    slides = parse_manuscript(FIELD_MAPPING_SAMPLE)
    assert slides[0]["title"] == "서버 프로그램과 웹 애플리케이션 실행 환경 이해"
    assert slides[1]["title"] == "서버 프로그램의 기본 역할"


def test_body_lines_exclude_metadata_labels():
    slides = parse_manuscript(FIELD_MAPPING_SAMPLE)
    body = slides[0]["body_lines"]
    joined = " ".join(body)
    assert "관련 학습목표" not in joined
    assert "핵심 정의" not in joined
    assert "화면" not in joined
    assert "제목" not in joined
    # 내용 리스트가 없는 표지는 부제로 폴백한다.
    assert any("처음부터 보기" in b for b in body)


def test_body_lines_use_short_phrase_items():
    slides = parse_manuscript(FIELD_MAPPING_SAMPLE)
    assert slides[1]["body_lines"] == ["요청을 받는다", "필요한 처리를 한다", "응답을 돌려준다"]


def test_body_lines_prefer_objective_list_over_content_list():
    slides = parse_manuscript(FIELD_MAPPING_SAMPLE)
    assert slides[2]["body_lines"] == ["첫째 목표", "둘째 목표"]


def test_build_body_excludes_metadata(tmp_path):
    out = tmp_path / "out.pptx"
    build_pptx(FIELD_MAPPING_SAMPLE, str(out), assets_root=str(tmp_path))
    prs = Presentation(str(out))
    # 슬라이드1 제목 placeholder = 제목 값
    assert prs.slides[0].shapes.title.text == "서버 프로그램과 웹 애플리케이션 실행 환경 이해"
    # 어떤 텍스트 상자에도 메타 라벨이 새어 나오지 않는다
    for slide in prs.slides:
        for sh in slide.shapes:
            if sh.has_text_frame and sh is not slide.shapes.title:
                txt = sh.text_frame.text
                assert "관련 학습목표" not in txt
                assert "핵심 정의" not in txt
                assert "화면:" not in txt


# --- 이미지 모드 회귀 테스트 (2026-07-06): preview 렌더 PNG를 전체 배경으로 ---
IMG_MODE_SAMPLE = textwrap.dedent("""\
    # 1차시 원고: 테스트

    ## Slide 1. 표지
    **Screen**
    - 제목: 첫 장
    **Narration**
    - 첫 번째 나레이션.

    ## Slide 2. 본문
    **Screen**
    - 제목: 둘째 장
    **Narration**
    - 두 번째 나레이션.
    """)


def test_image_mode_full_bleed_and_notes(tmp_path):
    from PIL import Image
    img_dir = tmp_path / "render"
    img_dir.mkdir()
    for n in (1, 2):
        Image.new("RGB", (1280, 720), "white").save(img_dir / f"slide{n:02d}.png")
    out = tmp_path / "out.pptx"
    n = build_pptx_from_images(IMG_MODE_SAMPLE, str(img_dir), str(out))
    assert n == 2
    from pptx.enum.shapes import MSO_SHAPE_TYPE
    prs = Presentation(str(out))
    sw, sh = prs.slide_width, prs.slide_height
    assert len(prs.slides) == 2
    for slide in prs.slides:
        pics = [s for s in slide.shapes if s.shape_type == MSO_SHAPE_TYPE.PICTURE]
        assert len(pics) == 1
        p = pics[0]
        # 전체 배경(풀블리드): 좌상단 0,0 + 슬라이드 전체 크기
        assert (p.left, p.top, p.width, p.height) == (0, 0, sw, sh)
    # 나레이션이 노트에 들어간다
    assert prs.slides[0].notes_slide.notes_text_frame.text == "첫 번째 나레이션."
    assert prs.slides[1].notes_slide.notes_text_frame.text == "두 번째 나레이션."


def test_image_mode_count_mismatch_hard_fails(tmp_path):
    """렌더 이미지 수 != 원고 슬라이드 수면 기본적으로 빌드 실패(계약 강제)."""
    import pytest
    from PIL import Image
    img_dir = tmp_path / "render"
    img_dir.mkdir()
    # 원고는 2슬라이드인데 이미지는 1장 → 불일치
    Image.new("RGB", (1280, 720), "white").save(img_dir / "slide01.png")
    out = tmp_path / "out.pptx"
    with pytest.raises(SystemExit):
        build_pptx_from_images(IMG_MODE_SAMPLE, str(img_dir), str(out))
    assert not out.exists()
    # 명시 완화 시엔 진행
    n = build_pptx_from_images(IMG_MODE_SAMPLE, str(img_dir), str(out), allow_count_mismatch=True)
    assert n == 1
    assert out.exists()


# --- 안전 여백(fit-in-box) 회귀 테스트 (2026-07-06) ---
def _make_img(tmp_path, name, w, h):
    from PIL import Image
    p = tmp_path / name
    Image.new("RGB", (w, h), "white").save(p)
    return p


def _manuscript_with_image(rel_path):
    import textwrap
    return textwrap.dedent(f"""\
        # 테스트

        ## Slide 1. 이미지
        **Screen**
        - 제목: 이미지 슬라이드
        **Visual asset**
        - GPT image prompt: `x`
        - → 생성됨: {rel_path}
        **Narration**
        - 노트.
        """)


def _picture_bounds(pptx_path):
    from pptx import Presentation
    from pptx.enum.shapes import MSO_SHAPE_TYPE
    prs = Presentation(str(pptx_path))
    sw, sh = prs.slide_width, prs.slide_height
    pics = []
    for s in prs.slides:
        for sh_ in s.shapes:
            if sh_.shape_type == MSO_SHAPE_TYPE.PICTURE:
                pics.append((sh_.left, sh_.top, sh_.width, sh_.height))
    return sw, sh, pics


def test_ultra_tall_image_stays_in_slide(tmp_path):
    """초세로 이미지(100x2000)가 슬라이드 경계를 넘지 않는다."""
    (tmp_path / "assets" / "images" / "ch01").mkdir(parents=True)
    _make_img(tmp_path, "assets/images/ch01/slide01.png", 100, 2000)
    out = tmp_path / "out.pptx"
    build_pptx(_manuscript_with_image("assets/images/ch01/slide01.png"), str(out), assets_root=str(tmp_path))
    sw, sh, pics = _picture_bounds(out)
    assert len(pics) == 1
    left, top, w, h = pics[0]
    assert top + h <= sh, f"세로 오버플로: bottom={top+h} > slide={sh}"
    assert left + w <= sw, f"가로 오버플로: right={left+w} > slide={sw}"


def test_ultra_wide_image_stays_in_slide(tmp_path):
    """초광폭 이미지(2000x100)가 슬라이드 경계를 넘지 않는다."""
    (tmp_path / "assets" / "images" / "ch01").mkdir(parents=True)
    _make_img(tmp_path, "assets/images/ch01/slide01.png", 2000, 100)
    out = tmp_path / "out.pptx"
    build_pptx(_manuscript_with_image("assets/images/ch01/slide01.png"), str(out), assets_root=str(tmp_path))
    sw, sh, pics = _picture_bounds(out)
    left, top, w, h = pics[0]
    assert top + h <= sh and left + w <= sw


def test_image_leaves_margin_from_slide_edges(tmp_path):
    """이미지가 슬라이드 가장자리에 닿지 않고 여백을 남긴다."""
    (tmp_path / "assets" / "images" / "ch01").mkdir(parents=True)
    _make_img(tmp_path, "assets/images/ch01/slide01.png", 800, 600)
    out = tmp_path / "out.pptx"
    build_pptx(_manuscript_with_image("assets/images/ch01/slide01.png"), str(out), assets_root=str(tmp_path))
    sw, sh, pics = _picture_bounds(out)
    left, top, w, h = pics[0]
    # 우측·하단 가장자리에서 최소 여백(0.2in = 182880 EMU)
    assert sw - (left + w) >= 182880, "우측 여백 부족"
    assert sh - (top + h) >= 182880, "하단 여백 부족"
