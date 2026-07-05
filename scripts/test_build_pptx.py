"""build_pptx 파서/빌더 테스트 (pytest)."""
import textwrap
from pptx import Presentation
from build_pptx import parse_manuscript, build_pptx

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
    assert slides[0]["title"] == "표지"
    assert slides[1]["title"] == "본문"

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
