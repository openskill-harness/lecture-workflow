# Typst 북 빌드 엔진 Windows 드라이런 (Task 13)

날짜: 2026-07-05 (실행일 2026-07-06) · 대상: `.claude/skills/book-build/references/scripts/typst_builder.py`

## 요약

Task 14(book-build 스킬)의 전제인 "Windows에서 typst_builder.py가 md→pdf를 실제로
만들 수 있는 상태"를 확인하기 위해 드라이런을 수행했다. **한글 본문 + 코드 블록 +
이미지 1장을 포함한 PDF가 정상 생성되었고(폰트 렌더링·문단 정렬·이미지 삽입 모두
확인), 과정에서 발견한 Windows 관련 이슈 2건을 typst_builder.py 자체에서 수정했다.**

## 확보한 폰트

| 용도 | 폰트 | 출처 | 라이선스 | 비고 |
|---|---|---|---|---|
| 본문(한글) | KoPubWorld바탕체 Medium/Bold | `github.com/adrinerDP/font-kopubworld`(KOPUS 공식 배포본 미러) | KoPub/KoPubWorld 서체 라이선스 — 무료 사용·복제·재배포 허용(상업적 "판매" 등 유상 행위만 사전 동의 요구) | RIDIBatang 원본은 다운로드 페이지가 Cloudflare 챌린지(403)로 자동화 접근 차단되어 확보 불가 → 브리프가 제시한 대체안 중 KoPubWorld바탕 채택 |
| 코드 | D2Coding v1.3.2 (Regular/Bold) | `github.com/naver/d2codingfont` 공식 릴리스 | SIL Open Font License 1.1 | 원본 브리프 계획대로 확보 성공 |

typst가 인식하는 실제 패밀리명(`typst fonts --font-path references/fonts --variants`로 확인):
- `D2Coding` (Weight 400/700 — Regular/Bold 자동 매핑)
- `KoPubWorldBatang_Pro` (Weight 500/700 — Medium/Bold)

**폰트 커밋 여부 결정**: D2Coding(OFL)과 KoPubWorld바탕(KOPUS 라이선스)은 둘 다 무료
재배포가 명시적으로 허용되므로 `references/fonts/`에 실 파일로 커밋한다(총 ~24MB).
반면 Windows 시스템 폰트(맑은 고딕 `malgun.ttf`, 바탕 `batang.ttc`, Consolas)는
Microsoft 라이선스상 재배포 대상이 아니므로 저장소에 넣지 않았다 — `book_base.typ`의
폰트 폴백 목록에 **패밀리명으로만**(`"Malgun Gothic"`) 참조해 Windows에 이미 설치된
시스템 폰트를 typst가 자동 탐지하도록 했고, 파일 자체는 복사하지 않았다.

## Windows 조정 내역

### 1. `book_base.typ` — 폰트 패밀리명 교체

- 본문: `("RIDIBatang", "Apple SD Gothic Neo")` → `("KoPubWorldBatang_Pro", "Malgun Gothic")`
- 코드 블록 / 인라인 코드: `("D2Coding", "RIDIBatang")` → `("D2Coding", "KoPubWorldBatang_Pro")`
- macOS 전용 경로(`~/Library/Fonts`) 참조는 이 파일에 원래 없었음(폰트 경로는 항상
  `typst compile --font-path`로 호출 측이 주입하는 구조).

### 2. `typst_builder.py` — Mermaid 전처리 옵션화

이 하네스는 Mermaid를 쓰지 않는다(D2 다이어그램을 PNG 파일로 이미 보유). 기존 코드는
`npx`/`mermaid-cli` 실패 시에도 예외를 잡아 텍스트 placeholder로 안전하게 대체하고
있었지만(크래시는 아니었음), 다음을 추가로 개선했다:
- `check_mermaid_available()` 추가 — `shutil.which('npx')`로 사전 확인.
- `render_mermaid_diagrams()`가 ` ```mermaid ` 블록이 텍스트에 아예 없으면 즉시
  반환하고, npx가 없으면 외부 프로세스 호출 자체를 시도하지 않고 바로 placeholder로
  치환하도록 가드 추가.
- `check_dependencies()`의 설치 안내 메시지를 OS별로 분기(`sys.platform == 'win32'`
  이면 `winget install --id Typst.Typst -e` / `winget install --id JohnMacFarlane.Pandoc -e`,
  그 외는 기존 `brew install`).

### 3. `typst_builder.py` — `--root` 드라이브 앵커 버그 (실제 발견/수정)

`typst_compile()`/`typst_compile_svg()`가 `--root /`를 하드코딩하고 있었다. 이미지
경로(`_typst_img_path`)는 드라이브 문자를 벗겨 `/work/a/b.png` 형태로 인코딩하므로
POSIX에서는 `--root /`와 정확히 대응하지만, Windows 경로는 항상 드라이브 문자를
anchor로 갖는다(`C:\`).

**실측 결과**:
- Python `subprocess.run(['typst', 'compile', ..., '--root', '/'])`로 직접 호출하면
  (typst_builder.py의 실제 프로덕션 경로) Windows에서도 typst가 bare `/`를 "현재
  드라이브의 루트"로 알아서 해석해 실제로는 문제없이 동작했다(1차 드라이런에서
  확인 — 텍스트+코드만 있는 PDF는 이 경로로 정상 생성됨).
- 하지만 Git Bash(MSYS)에서 `typst compile x.typ x.pdf --root /`를 **직접** 실행하면
  MSYS 셸이 bare `/` 인자를 다른 경로로 치환해버려
  `error: source file must be contained in project root`가 발생한다(디버깅·드라이런
  시 에이전트가 typst를 직접 호출하는 경우 흔히 마주치는 상황).

두 경우 모두를 안전하게 만들기 위해 `_typst_root_for(typ_path)` 헬퍼를 추가해 root를
항상 **.typ 파일이 실제로 위치한 드라이브의 anchor**(Windows: `C:/`, POSIX: `/`)로
명시적으로 지정하도록 고쳤다. `typst_compile()` / `typst_compile_svg()` 양쪽 모두 이
헬퍼를 사용하도록 수정. (POSIX에서는 anchor가 그대로 `/`이므로 하위 호환.)

절대경로 이미지가 포함된 md → PDF 빌드로 이 수정을 별도 검증했다(아래 드라이런
"이미지 포함 확장 테스트" 참조).

### 4. 경로 구분자 / 셸 호출

`typst_builder.py`에 macOS 전용 셸 호출(`os.system`, `open`, `pbcopy` 등)이나 POSIX
전용 경로 구분자 하드코딩은 없었다. `subprocess.run()`이 전부 리스트 인자 방식이라
Windows에서도 그대로 동작함을 확인(별도 수정 불필요).

## typst_builder.py 실제 CLI 시그니처

브리프는 `python typst_builder.py input.md output.pdf` 형태의 CLI를 가정했으나,
**실제로는 CLI 엔트리포인트가 없다.** 파일 최상단 docstring 및 원본 `pub-build/SKILL.md`
확인 결과:

> 프로젝트의 `build_pdf_typst.py`가 스킬의 `typst_builder.py`를 import하여 `build(config)` 호출.

즉 `typst_builder.py`는 라이브러리이며, 호출 측(프로젝트별 `build_pdf_typst.py`, 또는
Task 14의 book-build 스킬)이 `import typst_builder; typst_builder.build(config)`를
호출하는 구조다. `build(config)`의 필수/선택 키는 `build()` 함수 docstring
(scripts/typst_builder.py 참조)에 명시되어 있다:

```python
config = {
    "title": str, "base": Path, "assets_dir": Path, "mermaid_out": Path,
    "template": Path,       # 프로젝트 book.typ (book-title 등 변수 정의 + book_base.typ와 같은 디렉토리)
    "font_path": Path|None, # references/fonts/ 절대경로
    "front": list[Path], "chapters": list[Path], "back": list[Path],
    "output_md": Path, "output_typ": Path, "output_pdf": Path,
    # 선택: image_border_preset, design, design_state, cover_data, pre_toc, layout_checker
}
typst_builder.build(config)
```

드라이런에서는 이 실제 시그니처에 맞춰 `scripts/book_dryrun/driver.py`(임시, 커밋
제외)를 작성해 호출했다.

## 드라이런 절차 및 결과

디렉터리 구성(임시, 커밋 제외):
```
scripts/book_dryrun/
  book.typ       # 프로젝트 템플릿 최소본 — book-title/color-primary 등 book_base.typ가 참조하는 변수 정의
  book_base.typ  # references/templates/book_base.typ의 사본(프로젝트가 같은 디렉토리에 두는 실제 구조 재현)
  ch_test.md     # 한글 본문 + 코드 블록(+ 확장 테스트에서 이미지 1장 추가)
  assets/sample.png
  driver.py      # import typst_builder; typst_builder.build(config)
```

실행:
```
$ python scripts/book_dryrun/driver.py
드라이런 테스트북 통합 PDF 생성 (Typst)
==================================================
   typst: typst 0.15.0 (3ae52774)
   pandoc: pandoc 3.10

[1/6] 마크다운 통합 + 전처리...
   처리 중: ch_test.md
   통합 마크다운: out.md

[2/6] 이미지 공백 자동 제거...

[3/6] Pandoc 변환 (MD → Typst)...
   Pandoc 변환 완료: out.raw.typ

[4/6] 후처리 + 템플릿 병합...
   최종 Typst: out.typ

[5/6] Typst 컴파일 (TYP → PDF)...
   Typst 컴파일 완료: out.pdf

   PDF 생성 완료: out.pdf (0.0 MB)

[6/6] 레이아웃 분석...
   [참고] pdf_layout_checker 없음 → 레이아웃 분석 건너뜀
==================================================
완료: ...\scripts\book_dryrun\out.pdf
```

**PDF 생성 증거**:
- `out.pdf` 실제 생성 확인 (텍스트만: 50,022 bytes / 3페이지, 이미지 포함 확장판: 약 0.1MB / 4페이지)
- PyMuPDF(`fitz`)로 텍스트 추출 → 한글이 정상적으로 추출됨(표지/목차/본문 모두 정상):
  ```
  드라이런 테스트북
  1장. 드라이런
  안녕하세요. 한글 조판과 줄바꿈이 정상인지 확인합니다. 김치찌개를 주문하면 주방이 응답을 돌려줍니다.
  실행 결과
  public class Hello { public static void main(String[] a){ System.out.println("안녕"); } }
  여러 줄에 걸친 한글 문단도 확인합니다. 이 문장은 충분히 길게 작성되어 자동 줄바꿈과 문단 정렬(justify)이...
  ```
- PyMuPDF로 150dpi 렌더링해 육안 확인: 표지(제목/부제/설명 박스/저자), 목차, 챕터
  헤딩(파란 언더라인), 본문 justify 정렬, 코드 블록(D2Coding, 문자열 리터럴 색상
  강조 포함 — 코드 내 한글 `"안녕"`도 정상 렌더링), 인용/표 스타일 등 모두 의도한
  디자인대로 렌더링됨.
- **주의(참고사항, 발견된 사소한 이슈, 이번 태스크 범위 밖)**: 마지막 파일 뒤에 항상
  붙는 구분자(`build_integrated_md`가 각 파일 뒤에 `\n\n---\n\n`을 추가) 때문에
  이미지가 페이지 하단 근처에 오면 빈 페이지가 한 장 더 생기는 경우가 있었다
  (이미지 확장 테스트에서 4페이지째가 헤더만 있는 빈 페이지). 이는 `book_base.typ`/
  `auto-image`의 기존 페이지네이션 휴리스틱 동작이며 Windows 이식과 무관한 기존
  동작이라 이번 태스크에서는 손대지 않았다(Task 14에서 실제 원고로 빌드할 때
  재확인 권장).

### 실패 항목 및 해결

| 발견 | 원인 | 해결 |
|---|---|---|
| Git Bash로 `typst compile ... --root /` 직접 실행 시 `source file must be contained in project root` | MSYS가 bare `/` 인자를 다른 경로로 치환 | `_typst_root_for()`로 root를 .typ 파일의 실제 드라이브 anchor로 명시 (§Windows 조정 3) |
| RIDIBatang 자동 다운로드 불가 (Cloudflare 403 챌린지) | 로그인/챌린지 페이지 | KoPubWorld바탕(KOPUS, 무료 재배포 허용)으로 대체, 라이선스 확인 후 커밋 |
| pdftotext(mingw64 poppler)로 추출 시 한글이 공백으로 깨져 보임 | poppler pdftotext의 CJK 처리 한계로 추정(오탐) | PyMuPDF(`fitz`)로 재검증 → 한글 정상 추출 확인. **실제 PDF는 정상**이며 pdftotext 쪽 이슈. 향후 Task 14 검증 시 pdftotext 대신 PyMuPDF/육안 확인 권장 |

## 결론

Windows에서 `typst_builder.py` + `book_base.typ` + 확보한 폰트로 한글 본문·코드
블록·이미지가 포함된 PDF를 정상 생성할 수 있음을 확인했다. Task 14는 이 엔진을
그대로 `import`하여 `build(config)`를 호출하는 방식으로 진행하면 된다(CLI 래퍼가
필요하면 Task 14에서 프로젝트별 `build_pdf_typst.py` 역할의 스크립트를 새로 작성).
