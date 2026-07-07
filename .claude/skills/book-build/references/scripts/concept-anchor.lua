-- Div(class="concept-anchor") → typst #concept-anchor[ <직렬화된 내용> ] 로 감싼다.
-- codex 조건1: 내부 Markdown을 문자열로 끼워 넣지 말고, div의 AST content를
-- pandoc.write로 typst content로 직렬화한 뒤 단일 RawBlock으로 감싼다.
-- 다른 div는 손대지 않는다.
function Div(el)
  if el.classes and el.classes:includes("concept-anchor") then
    local inner = pandoc.write(pandoc.Pandoc(el.content), "typst")
    return pandoc.RawBlock("typst", "#concept-anchor[\n" .. inner .. "\n]")
  end
end
