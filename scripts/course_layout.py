"""과정 디렉터리 배치 해석 — 산출물 경로의 단일 결정 지점.

현행 규약(spec §4): 산출물은 `courses/{id}/outputs/NN_이름/` 아래에 파이프라인
순서대로 모인다. 다만 과정 산출물은 규약 변경 시 이관하지 않으므로, `outputs/`가
없고 루트에 `manuscripts/`가 있는 과정은 루트 평면 배치로 해석한다(둘 다 유효).
스크립트가 산출물 경로를 하드코딩하지 않고 이 모듈을 거치면 두 배치 모두에서 동작한다.

경로 문자열(rel_*)은 과정 루트 기준 '/' 구분 — manifest.json·status.md 인덱스에
기록되는 형식과 동일하다.
"""
from pathlib import Path

_OUTPUTS = {
    "outline": "outputs/01_과정개요서.md",
    "manuscripts": "outputs/02_원고",
    "assets": "outputs/03_시각자산",
    "code": "outputs/04_코드",
    "storyboards": "outputs/05_스토리보드",
    "ppt_previews": "outputs/06_PPT프리뷰",
    "panseo": "outputs/07_판서",
    "simulators": "outputs/08_시뮬",
    "pptx": "outputs/09_PPTX",
    "book": "outputs/10_책",
    "verification": "outputs/11_검증",
}
_FLAT = {
    "outline": "1.과정개요서.md",
    "manuscripts": "manuscripts",
    "assets": "assets",
    "code": "code",
    "storyboards": "storyboards",
    "ppt_previews": "ppt_previews",
    "panseo": "panseo",
    "simulators": "simulators",
    "pptx": "pptx",
    "book": "book",
    "verification": "verification",
}


def _table(course_dir):
    c = Path(course_dir)
    if not (c / "outputs").is_dir() and (c / "manuscripts").is_dir():
        return _FLAT
    return _OUTPUTS


def rel(course_dir, key):
    """과정 루트 기준 상대 경로 문자열 (예: rel(c, "assets") → "outputs/03_시각자산")."""
    return _table(course_dir)[key]


def path(course_dir, key):
    """절대/실경로 Path (예: path(c, "manuscripts") / "ch01.md")."""
    return Path(course_dir) / rel(course_dir, key)


def asset_manifest_path(course_dir, ch):
    """차시별 시각자산 manifest 경로 (예: outputs/03_시각자산/manifest_ch01.json).

    manifest는 차시마다 별도 파일이다 — 한 파일을 공유하면 뒤에 빌드한 차시가 앞 차시를
    덮어쓰고, 이전 해시를 다른 차시 슬라이드와 비교해 stale을 오탐한다.
    manifest 경로를 만드는 곳은 이 함수 하나뿐이다(빌더·annotate 공용).
    """
    return path(course_dir, "assets") / f"manifest_{ch}.json"
