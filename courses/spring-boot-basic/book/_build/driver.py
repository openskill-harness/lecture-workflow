import sys
from pathlib import Path

SKILL_SCRIPTS = Path(r"C:\Users\ssarm\Documents\course-haness\.claude\skills\book-build\references\scripts").resolve()
sys.path.insert(0, str(SKILL_SCRIPTS))
import typst_builder

course_dir = Path(r"C:\Users\ssarm\Documents\course-haness\courses\spring-boot-basic")
book_dir = course_dir / "book"

config = {
    "title": "스프링 부트 기초 1강",
    "base": course_dir,
    "assets_dir": course_dir / "assets",
    "mermaid_out": book_dir / "_mermaid_images",
    "template": book_dir / "book.typ",
    "font_path": SKILL_SCRIPTS.parent / "fonts",
    "front": [],
    "chapters": [book_dir / "ch01_원고.md"],
    "back": [],
    "output_md": book_dir / "_build" / "ch01.md",
    "output_typ": book_dir / "_build" / "ch01.typ",
    "output_pdf": book_dir / "ch01.pdf",
}
typst_builder.build(config)
