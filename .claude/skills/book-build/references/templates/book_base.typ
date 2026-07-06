// ── 범용 북 템플릿 (Typst) ──
// 이 파일은 스킬(pub-typst-design) 소유. 프로젝트에서 심볼릭 링크로 참조.
// 프로젝트의 book.typ에서 정의한 변수(book-title 등)를 사용합니다.
//
// 필수 변수 (book.typ에서 정의):
//   #let book-title = "책 제목"
//   #let book-subtitle = "부제"
//   #let book-description = [설명]
//   #let book-header-title = "헤더 표시 제목"

// ── 챕터 추적 (헤더용) ──
#let chapter-title = state("chapter-title", none)

// ── 페이지 설정 ──
// 46배판 (188x257mm) — 국내 IT 서적 표준 판형
#set page(
  width: 188mm,
  height: 257mm,
  margin: (top: 20mm, bottom: 28mm, left: 20mm, right: 20mm),
  numbering: "1",
  number-align: center,
  header: context {
    let page-num = counter(page).get().first()
    if page-num > 2 {
      set text(8pt, fill: rgb("#999999"))
      grid(
        columns: (1fr, 1fr),
        align(left)[#book-header-title],
        align(right)[#chapter-title.get()],
      )
      v(2pt)
      line(length: 100%, stroke: 0.3pt + rgb("#dddddd"))
    }
  },
  footer: context {
    let page-num = counter(page).get().first()
    if page-num > 2 {
      align(center, text(9pt, fill: rgb("#888888"))[#counter(page).display()])
    }
  },
)

// ── 폰트 설정 ──
// Windows 이식(2026-07 dry-run): 원본 macOS 폰트(RIDIBatang, Apple SD Gothic Neo)를
// KoPubWorld바탕체(저장소 references/fonts/, KOPUS 라이선스 — 무료 재배포 가능)로 교체.
// "Malgun Gothic"은 파일을 재배포하지 않고 Windows 시스템에 이미 설치된 폰트를
// 폴백으로만 참조(패밀리명 매칭). --font-path로 재배포용 폰트 디렉토리를 추가로 지정한다.
#set text(
  font: ("KoPubWorldBatang_Pro", "Malgun Gothic"),
  size: 10pt,
  lang: "ko",
  fill: rgb("#1a1a1a"),
)

#set par(
  leading: 1.0em,
  first-line-indent: 0pt,
  justify: true,
)

// ── 제목 스타일 ──
#show heading.where(level: 1): it => {
  chapter-title.update(it.body)
  pagebreak(weak: true)
  v(60pt)  // 챕터 오프닝: 상단 1/3 여백 (출판 표준)
  block(
    width: 100%,
    below: 16pt,
    sticky: true,
    {
      text(26pt, weight: "bold", fill: rgb("#1a1a1a"))[#it.body]
      v(8pt)
      line(length: 100%, stroke: 3pt + rgb("#2563eb"))
    }
  )
  v(14pt)
}

#show heading.where(level: 2): it => {
  v(24pt)
  block(
    width: 100%,
    below: 8pt,
    sticky: true,
    inset: (left: 12pt),
    stroke: (left: 4pt + rgb("#2563eb")),
    text(16pt, weight: "bold", fill: rgb("#1e40af"))[#it.body]
  )
  v(6pt)
}

#show heading.where(level: 3): it => {
  v(16pt)
  block(
    below: 6pt,
    sticky: true,
    text(13pt, weight: "semibold", fill: rgb("#1e3a5f"))[#it.body]
  )
  v(4pt)
}

#show heading.where(level: 4): it => {
  v(12pt)
  block(
    below: 4pt,
    sticky: true,
    text(11pt, weight: "semibold", fill: rgb("#374151"))[#it.body]
  )
  v(2pt)
}

// ── 코드 블록 (페이지 넘김 허용) ──
#show raw.where(block: true): it => {
  set text(size: 8pt, weight: "bold", font: ("D2Coding", "KoPubWorldBatang_Pro"))
  block(
    width: 100%,
    fill: white,
    inset: (x: 16pt, y: 14pt),
    radius: 8pt,
    stroke: 1pt + rgb("#d1d5db"),
    breakable: true,
    above: 8pt,
    below: 8pt,
    text(fill: rgb("#1a1a1a"))[#it]
  )
}

// ── 인라인 코드 ──
#show raw.where(block: false): it => {
  box(
    fill: rgb("#f3f4f6"),
    inset: (x: 4pt, y: 2pt),
    radius: 3pt,
    text(size: 8.5pt, fill: rgb("#1e40af"), font: ("D2Coding", "KoPubWorldBatang_Pro"))[#it]
  )
}

// ── 인용 블록 (blockquote) ──
#show quote.where(block: true): it => {
  block(
    width: 100%,
    above: 10pt,
    below: 10pt,
    inset: (left: 14pt, right: 14pt, top: 10pt, bottom: 10pt),
    stroke: (left: 3pt + rgb("#93b4e8")),
    fill: rgb("#f5f8ff"),
    radius: (right: 4pt),
    {
      set par(justify: true, leading: 0.9em)
      text(size: 9pt, fill: rgb("#4b5563"))[#it.body]
    }
  )
}

// ── 표 스타일 ──
#set table(
  stroke: (bottom: 0.5pt + rgb("#e5e7eb")),
  inset: (x: 10pt, y: 8pt),
  fill: (_, y) => if y == 0 { rgb("#1e40af") } else if calc.odd(y) { rgb("#f8fafc") } else { white },
)

#show table.cell.where(y: 0): set text(fill: white, weight: "medium")

#show table: it => {
  set text(size: 8.5pt)
  block(breakable: true)[#it]
}

// ── 볼드/이탤릭 ──
#show strong: set text(fill: rgb("#1e3a5f"))
#show emph: set text(fill: rgb("#6b7280"))

// ── 수평선은 후처리에서 #v + block으로 변환됨 ──

// ── figure 스타일 ──
#show figure: it => {
  v(8pt)
  align(center, it.body)
  if it.caption != none {
    v(2pt)
    align(center, text(8pt, fill: rgb("#6b7280"))[#it.caption.body])
  }
  v(4pt)
}

// ── 링크 스타일 ──
#show link: it => {
  text(fill: rgb("#2563eb"))[#it]
}

// ── 임베드 안전 여백 정책 (공통 규약) ──
// 근거: docs/proposals/2026-07-06_asset-embed-safe-margin.md §2-C,
//       docs/reviews/2026-07-06_asset-embed-margin-codex-review.md 승인 조건 3·4
// 정책값 1곳(공통 EMBED_SAFE_MARGIN_RATIO=0.05)의 Typst 구현 상수. 값을 바꿀 땐 여기만 수정.
#let embed-margin-ratio = 0.05

// 페이지 본문(콘텐츠 영역) 높이 — 위 #set page 값(257mm, margin top 20mm/bottom 28mm)에서 파생.
// #set page의 height/margin을 바꾸면 이 값도 함께 갱신해야 한다(이미지 max-height 계산의 기준).
#let page-content-height = 257mm - 20mm - 28mm  // 209mm

// ── 자동 크기 조절 이미지 ──
// 남은 페이지 공간(space-scale)과 페이지 본문 높이 상한(page-cap-scale)을 함께 고려해 이미지 크기를 조절합니다.
// max-width: 이미지 최대 너비 비율 (0.0~1.0)
// max-height-ratio: 이미지 최대 높이 비율 — page-content-height 기준 (0.7~0.85 권장, 70%는 과보수이므로 기본값 0.8)
// style: 이미지 테두리 프리셋
//   "plain"          — 효과 없음 (기본값)
//   "bordered"       — 프라이머리 컬러(#2563eb) 테두리
//   "shadow"         — 오른쪽/아래 그림자 효과
//   "bordered-shadow" — 프라이머리 테두리 + 그림자
//   "minimal"        — 얇은 회색 테두리
// max-height-ratio 상한은 새 페이지로 넘어가도 항상 적용되어(수학적으로) 페이지를 넘치지 않는다.
// width·height 둘 다 명시적으로 상한을 둔 뒤 fit: "contain"으로 종횡비를 보존한 채 박스 안에 넣는다(캡션 높이 별도 확보).
#let auto-image(path, alt: none, max-width: 0.7, max-height-ratio: 0.8, style: "plain") = layout(size => context {
  // 안전 여백(embed-margin-ratio)만큼 박스 자체를 줄여 자산이 텍스트 폭 경계에 닿지 않게 한다
  let target-width = size.width * max-width * (1 - embed-margin-ratio)
  let img = image(path, width: target-width)
  let img-size = measure(img)
  let caption-h = if alt != none { 28pt } else { 0pt }

  // 페이지 본문 높이 기준 최대 허용 높이(안전 여백 반영) — 어느 페이지에 놓이든 이 한도를 넘지 않는다
  let max-img-height = page-content-height * max-height-ratio * (1 - embed-margin-ratio)

  // 1) 남은 공간(size.height) 기준 축소 비율 (기존 로직)
  let space-scale = if size.height > 120pt {
    let available = size.height - caption-h - 24pt
    if img-size.height > available {
      available / img-size.height
    } else {
      1.0
    }
  } else {
    1.0
  }

  // 2) 페이지 본문 높이 상한 기준 축소 비율 (신규 — 새 페이지에서도 항상 적용, floor 없이 항상 강제)
  let page-cap-scale = if img-size.height > max-img-height {
    max-img-height / img-size.height
  } else {
    1.0
  }

  // 두 제약 중 더 타이트한 쪽을 적용 — max-height clamp가 항상 우선 보장되도록(오버플로 0 보장)
  let final-scale = calc.min(space-scale, page-cap-scale)
  let final-width = target-width * final-scale
  let final-height = img-size.height * final-scale

  // ⚠️ 경고 표시 조건: final-scale < 0.5 면 원본 대비 절반 미만으로 축소된 것 —
  // 초세로형(종횡비가 낮은) D2/이미지일 가능성이 높다. 자동 축소는 오버플로 방지를 위해 그대로 유지하되,
  // 이 경우 D2 재배치(가로 분할·2단 구성) 또는 전면 그림(별도 페이지 배치)을 검토할 것.
  let show-scale-warning = final-scale < 0.5

  // 스타일별 이미지 래핑 (width·height 둘 다 지정 + fit: "contain"으로 왜곡 없이 박스 안에 맞춤)
  let styled-img = if style == "bordered" {
    block(
      stroke: 2pt + rgb("#2563eb"),
      radius: 4pt,
      clip: true,
      image(path, width: final-width, height: final-height, fit: "contain")
    )
  } else if style == "shadow" {
    block(
      stroke: (
        left: 0.5pt + rgb("#e0e0e0"),
        top: 0.5pt + rgb("#e0e0e0"),
        right: 2pt + rgb("#c0c0c0"),
        bottom: 2pt + rgb("#c0c0c0"),
      ),
      radius: 4pt,
      clip: true,
      image(path, width: final-width, height: final-height, fit: "contain")
    )
  } else if style == "bordered-shadow" {
    block(
      stroke: (
        left: 2pt + rgb("#2563eb"),
        top: 2pt + rgb("#2563eb"),
        right: 3pt + rgb("#1d4ed8"),
        bottom: 3pt + rgb("#1d4ed8"),
      ),
      radius: 4pt,
      clip: true,
      image(path, width: final-width, height: final-height, fit: "contain")
    )
  } else if style == "minimal" {
    block(
      stroke: 0.5pt + rgb("#e5e7eb"),
      radius: 2pt,
      clip: true,
      image(path, width: final-width, height: final-height, fit: "contain")
    )
  } else {
    image(path, width: final-width, height: final-height, fit: "contain")
  }

  let body = if alt != none {
    figure(styled-img, caption: [#alt])
  } else {
    align(center, styled-img)
  }

  if show-scale-warning {
    body + v(2pt) + align(center, text(7.5pt, fill: rgb("#b45309"), style: "italic")[⚠ 세로 비율이 커 축소됨 — D2 재배치/전면 그림 배치 검토 권장])
  } else {
    body
  }
})

// ── 사이드 이미지 (2열 레이아웃) ──
// 작은 이미지를 텍스트 옆에 나란히 배치합니다.
// img-width: 이미지 열 너비 비율 (0.0~1.0), 나머지가 텍스트 열
#let side-image(path, body, img-width: 0.35, gap: 16pt) = {
  v(8pt)
  grid(
    columns: (img-width * 100% - gap / 2, 1fr),
    column-gutter: gap,
    align: (center + horizon, left + top),
    image(path, width: 100%),
    body,
  )
  v(8pt)
}

// ══════════════════════════════════════
// 표지 — 이미지 또는 텍스트
// ══════════════════════════════════════
#if book-cover-image != "" [
  #page(numbering: none, header: none, footer: none, margin: (top: 20pt, bottom: 20pt, left: 16pt, right: 16pt))[
    #image(book-cover-image, width: 100%, height: 100%, fit: "contain")
  ]
] else [
  #page(numbering: none, header: none, footer: none)[
    #v(1fr)
    #align(center)[
      #line(length: 40%, stroke: 2pt + color-primary)
      #v(24pt)
      #text(42pt, weight: "bold", fill: color-primary-dark, tracking: 2pt)[#book-title]
      #v(16pt)
      #line(length: 60%, stroke: 0.5pt + color-primary-light)
      #v(16pt)
      #text(15pt, fill: rgb("#374151"), weight: "medium")[#book-subtitle]
      #v(48pt)
      #block(
        width: 70%,
        inset: (x: 20pt, y: 16pt),
        radius: 4pt,
        fill: rgb("#f8fafc"),
        stroke: 0.5pt + rgb("#e2e8f0"),
        text(10.5pt, fill: rgb("#64748b"))[#book-description]
      )
    ]
    #v(1fr)
    #align(center)[
      #text(11pt, fill: rgb("#4b5563"), weight: "medium")[#book-authors 지음]
      #v(14pt)
      #text(9pt, fill: rgb("#94a3b8"))[#book-header-title]
    ]
    #v(24pt)
  ]
]

// ══════════════════════════════════════
// 목차 (자동 생성)
// ══════════════════════════════════════
#page(numbering: none, header: none, footer: none)[
  #v(30pt)
  #block(width: 100%, below: 12pt, {
    text(24pt, weight: "bold", fill: rgb("#1a1a1a"))[목차]
    v(6pt)
    line(length: 100%, stroke: 3pt + rgb("#2563eb"))
  })
  #v(12pt)

  #show outline.entry.where(level: 1): set text(weight: "bold", size: 11pt)
  #show outline.entry.where(level: 1): it => {
    v(6pt)
    it
  }
  #show outline.entry.where(level: 3): set text(size: 8.5pt, fill: rgb("#6b7280"))

  #outline(
    title: none,
    indent: 1.5em,
    depth: 2,
  )
]

// ══════════════════════════════════════
// 본문 시작 — 이 아래에 Pandoc 변환 내용이 들어갑니다
// ══════════════════════════════════════
