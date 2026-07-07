import os
import shutil
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
SCRIPTS = REPO / ".claude/skills/book-build/references/scripts"
TEMPLATES = REPO / ".claude/skills/book-build/references/templates"
LUA = SCRIPTS / "concept-anchor.lua"
BASE = TEMPLATES / "book_base.typ"

pandoc = pytest.mark.skipif(shutil.which("pandoc") is None, reason="pandoc 미설치")
typst = pytest.mark.skipif(shutil.which("typst") is None, reason="typst 미설치")

_MD = (
    "::: concept-anchor\n"
    "**HTTP · HyperText Transfer Protocol**\n\n"
    "![](x.png)\n\n"
    "웹에서 클라이언트와 서버가 요청·응답 메시지를 주고받는 통신 규칙.\n"
    ":::\n\n"
    "그날 민준은 API가 안 된다고 했다.\n"
)


@pandoc
def test_div_becomes_concept_anchor_call(tmp_path):
    md = tmp_path / "in.md"
    md.write_text(_MD, encoding="utf-8")
    out = tmp_path / "out.typ"
    cmd = ["pandoc", str(md), "-f", "markdown+fenced_divs", "-t", "typst", "-o", str(out),
           "--wrap=none", "--lua-filter", str(LUA)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    typ = out.read_text(encoding="utf-8")
    assert "#concept-anchor[" in typ          # 앵커 호출로 감쌈
    assert "HTTP" in typ                        # 기술명 보존
    assert "통신 규칙" in typ                    # 정의 보존
    # 앵커 밖 프로즈는 감싸지 않음
    assert "그날 민준은" in typ


@pandoc
def test_non_anchor_div_untouched(tmp_path):
    md = tmp_path / "in.md"
    md.write_text("::: other\n일반 내용.\n:::\n", encoding="utf-8")
    out = tmp_path / "out.typ"
    cmd = ["pandoc", str(md), "-f", "markdown+fenced_divs", "-t", "typst", "-o", str(out),
           "--wrap=none", "--lua-filter", str(LUA)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    assert "#concept-anchor[" not in out.read_text(encoding="utf-8")


def test_book_base_defines_concept_anchor():
    assert "#let concept-anchor(" in BASE.read_text(encoding="utf-8")


@typst
def test_concept_anchor_typst_compiles(tmp_path):
    # book_base.typ의 concept-anchor 함수를 import해 최소 문서로 컴파일
    # 주의(Windows): typst의 import 경로 문법은 드라이브 문자("C:")를 포함한
    # OS 절대경로를 허용하지 않는다 — 항상 root-relative("/"로 시작, --root 기준)
    # 또는 현재 파일 기준 상대경로만 허용한다. tmp_path(임시 디렉터리)와 BASE(레포)의
    # 공통 조상 디렉터리를 --root로 주고, 그 root 기준 상대경로로 import한다.
    root = Path(os.path.commonpath([str(tmp_path.resolve()), str(BASE.resolve())]))
    rel = BASE.resolve().relative_to(root).as_posix()
    doc = tmp_path / "doc.typ"
    doc.write_text(
        f'#import "/{rel}": concept-anchor\n'
        '#concept-anchor[*HTTP* \\ 웹 통신 규칙.]\n',
        encoding="utf-8")
    pdf = tmp_path / "o.pdf"
    r = subprocess.run(["typst", "compile", "--root", str(root), str(doc), str(pdf)],
                       capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    assert pdf.exists() and pdf.stat().st_size > 0
