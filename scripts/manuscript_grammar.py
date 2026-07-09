"""원고(manuscript-schema 문법) 공유 정규식 — 세 빌더(manifest/annotate/pptx)가 함께 쓴다.

라벨/문법 변경은 반드시 이 파일 한 곳에서만 수정한다(3중 복붙 드리프트 방지).
"""
import re

# 슬라이드 구간 헤더: `## Slide N. 제목`
SLIDE_RE = re.compile(r"^## Slide (\d+)\.\s*(.+)$")
# 필드 라벨: `**Screen**` 등
FIELD_RE = re.compile(
    r"^\*\*(Screen|Easy analogy|Practical case|Visual asset|Source|Narration|Practice|Assessment)\*\*"
)
# 영문 이미지 프롬프트 라인(백틱 안 우선). `GPT image prompt:`/`시각자료 프롬프트(영문):`/
# 만화 2컷 `Comic panel prompt:`(manuscript-schema.md:85) 모두 인식한다.
# `User image prompt:`(사용자가 준 프롬프트)도 `image prompt` 부분 문자열로 여기 매치된다 —
# 프롬프트 추출은 동일하고, 출처 구분만 USER_PROMPT_RE가 담당한다.
IMG_PROMPT_RE = re.compile(
    r"(?:image prompt|comic panel prompt|시각자료 프롬프트\(영문\))\s*[:：]\s*`?(.+)",
    re.IGNORECASE,
)
# 자산 출처(origin) 마커 — 하네스가 덮어써도 되는지를 가른다(visual-assets §origin).
# `User image prompt:` = 사용자가 준 프롬프트(재생성만 허용, 문구 임의 수정 금지)
USER_PROMPT_RE = re.compile(r"user\s+image\s+prompt\s*[:：]", re.IGNORECASE)
# `User image: <경로>` = 사용자가 준 파일(덮어쓰기 금지, stale 비교 제외)
USER_IMG_FILE_RE = re.compile(
    r"user\s+image\s*[:：]\s*`?([^\s`]+\.(?:png|jpg|jpeg|webp))",
    re.IGNORECASE,
)
# 이미지 자산 경로(렌더된 png/jpg만 — .d2 소스는 제외).
# outputs/ 규약(outputs/03_시각자산/…)과 루트 평면 배치(assets/…) 둘 다 인식한다(course_layout 참조).
IMG_PATH_RE = re.compile(
    r"((?:outputs[/\\]03_시각자산|assets)[/\\][^\s)`\"']+\.(?:png|jpg|jpeg|webp))",
    re.IGNORECASE,
)
# D2 opt-in 마커: "주 시각자료: D2" / "Primary asset: D2"
D2_PRIMARY_RE = re.compile(r"(?:주\s*시각자료|primary\s*asset)\s*[:：]\s*d2", re.IGNORECASE)
# 이미지 보류(defer) 마커
IMG_DEFER_RE = re.compile(r"이미지\s*보류|image\s*deferred", re.IGNORECASE)
