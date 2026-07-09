import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

function resolvePathInput(value, fallback) {
  return path.resolve(root, value || fallback);
}

function firstExisting(candidates) {
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || "";
}

function firstDirectory(parentDir) {
  try {
    const entries = fs.readdirSync(parentDir, { withFileTypes: true });
    const directory = entries.find((entry) => entry.isDirectory());
    return directory ? path.join(parentDir, directory.name) : "";
  } catch {
    return "";
  }
}

function findFirstFile(dir, predicate, maxFiles = 2000) {
  let visited = 0;
  const ignored = new Set([".gradle", ".git", "build", "out", "node_modules"]);

  function walk(currentDir) {
    if (!currentDir || visited > maxFiles) return "";
    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return "";
    }

    for (const entry of entries) {
      if (visited > maxFiles) return "";
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (ignored.has(entry.name)) continue;
        const found = walk(fullPath);
        if (found) return found;
      } else {
        visited += 1;
        if (predicate(fullPath, entry.name)) return fullPath;
      }
    }
    return "";
  }

  return walk(dir);
}

const args = parseArgs(process.argv.slice(2));
if (typeof args.chapterDir !== "string" || !args.chapterDir) {
  console.error("Error: --chapterDir is required.");
  console.error("Example: node .claude/skills/lecture-storyboard-preview/scripts/generate_ppt_preview.mjs --chapterDir outputs/springboot/03_ch01");
  process.exit(1);
}
const chapterDir = path.resolve(root, args.chapterDir);
const statePath = resolvePathInput(args.state, path.join(chapterDir, "07_storyboard-state.json"));
const outputPath = resolvePathInput(args.out, path.join(chapterDir, "09_ppt-preview.html"));
const storyboardOutputPath = resolvePathInput(args.storyboardOut, path.join(chapterDir, "07_storyboard.html"));
const practiceDir = resolvePathInput(args.practiceDir, path.join(chapterDir, "02_practice-code"));
const projectRoot = path.join(practiceDir, "project");
const projectDirDefault = firstDirectory(projectRoot);
if (typeof args.projectDir !== "string" && !projectDirDefault) {
  console.error(`Error: no project directory found under ${projectRoot}. Pass --projectDir explicitly.`);
  process.exit(1);
}
const projectDir = resolvePathInput(args.projectDir, projectDirDefault);
const providedAssetsDir = resolvePathInput(args.generatedAssetsDir, path.join(chapterDir, "08_visual-assets", "provided"));

const sourcePaths = {
  controller: resolvePathInput(
    args.controller,
    findFirstFile(projectDir, (_fullPath, fileName) => /Controller\.java$/i.test(fileName)) ||
      path.join(projectDir, "src", "main", "java", "com", "example", "ch01", "HelloController.java"),
  ),
  properties: resolvePathInput(
    args.properties,
    firstExisting([
      path.join(projectDir, "src", "main", "resources", "application.properties"),
      path.join(projectDir, "src", "main", "resources", "application.yml"),
      path.join(projectDir, "src", "main", "resources", "application.yaml"),
    ]),
  ),
  bootRun: resolvePathInput(
    args.bootRun,
    firstExisting([
      path.join(practiceDir, "03_run-captures", "bootrun-output.txt"),
      path.join(practiceDir, "03_run-captures", "run-output.txt"),
      path.join(practiceDir, "03_run-captures", "check-output.txt"),
    ]),
  ),
  response: resolvePathInput(
    args.response,
    firstExisting([
      path.join(practiceDir, "03_run-captures", "hello-response.txt"),
      path.join(practiceDir, "03_run-captures", "response.txt"),
      path.join(practiceDir, "03_run-captures", "run-output.txt"),
    ]),
  ),
};
const projectName = path.basename(projectDir);

function readText(filePath, fallback = "") {
  try {
    return fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  } catch {
    return fallback;
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineCode(value = "") {
  const escaped = escapeHtml(value);
  return escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
}

function className(value = "") {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "");
}

function slideAssetName(slide, element, extension = "png") {
  return `slide-${String(slide.number).padStart(2, "0")}_${element.id}.${extension}`;
}

function providedImageFor(slide, element) {
  const fileName = slideAssetName(slide, element);
  const filePath = path.join(providedAssetsDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  return `08_visual-assets/provided/${fileName}`;
}

function linesForText(text = "") {
  return String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function textDensity(text = "") {
  const lines = linesForText(text);
  if (text.length > 420 || lines.length > 12) return "very-dense";
  if (text.length > 220 || lines.length >= 7) return "dense";
  return "normal";
}

function formatTextBlock(text = "") {
  const lines = linesForText(text);
  const html = lines
    .map((line, index) => {
      const isLead = index === 0 && lines.length > 1;
      const isShortHeader = isLead && line.length <= 18 && !line.includes("`");
      const tag = isShortHeader ? "strong" : "span";
      return `<${tag}>${inlineCode(line)}</${tag}>`;
    })
    .join("");
  return `<div class="formatted">${html}</div>`;
}

function styleForElement(element) {
  const styles = [
    `left:${element.x}%`,
    `top:${element.y}%`,
    `width:${element.w}%`,
    `height:${element.h}%`,
  ];
  if (Number.isFinite(Number(element.zIndex))) styles.push(`z-index:${Number(element.zIndex)}`);
  const fit = element.assetFit || element.fit || "";
  if (fit) styles.push(`--asset-fit:${fit}`);
  if (Number.isFinite(Number(element.assetPositionX))) styles.push(`--asset-position-x:${Number(element.assetPositionX)}%`);
  if (Number.isFinite(Number(element.assetPositionY))) styles.push(`--asset-position-y:${Number(element.assetPositionY)}%`);
  if (Number.isFinite(Number(element.assetScale))) styles.push(`--asset-scale:${Number(element.assetScale)}`);
  return styles.join(";");
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function isVisualElement(element) {
  return element.type !== "text";
}

function hasUserOverride(slide) {
  return Boolean(
    slide.userOverride ||
      slide.elements?.some((element) => element.userOverride || element.prompt?.userEdited),
  );
}

function layoutFitForText(element, box) {
  const lines = linesForText(element.text);
  const length = String(element.text ?? "").length;
  const densityScore = lines.length * 1.8 + length / 38;
  const areaScore = Number(box.w ?? element.w ?? 1) * Number(box.h ?? element.h ?? 1);
  if (element.role === "title") return length > 30 ? "balanced" : "normal";
  if (densityScore > 14 || areaScore < 720) return "tight";
  if (densityScore > 10 || lines.length >= 6) return "compact";
  if (densityScore > 7 || lines.length >= 4) return "balanced";
  return "normal";
}

const bodyTextRoles = new Set(["screen-text", "custom-text"]);
const layoutFitRank = new Map([
  ["normal", 0],
  ["balanced", 1],
  ["compact", 2],
  ["tight", 3],
]);

function normalizeBodyTextFits(elements) {
  const bodyTextElements = elements.filter((element) => element.type === "text" && bodyTextRoles.has(element.role));
  if (bodyTextElements.length < 2) return elements;

  const sharedFit = bodyTextElements.reduce((current, element) => {
    const fit = element.layoutFit ?? "normal";
    return (layoutFitRank.get(fit) ?? 0) > (layoutFitRank.get(current) ?? 0) ? fit : current;
  }, "normal");

  return elements.map((element) => {
    if (element.type !== "text" || !bodyTextRoles.has(element.role)) return element;
    return { ...element, layoutFit: sharedFit };
  });
}

function normalizeVisualDefaults(element) {
  if (!isVisualElement(element)) return element;
  const next = { ...element };
  if (!next.assetFit && !next.fit) next.assetFit = "contain";
  if (!Number.isFinite(Number(next.assetPositionX))) next.assetPositionX = 50;
  if (!Number.isFinite(Number(next.assetPositionY))) next.assetPositionY = 50;
  if (!Number.isFinite(Number(next.assetScale))) next.assetScale = 1;
  return next;
}

function withLayout(element, box) {
  const next = { ...element, ...box };
  if (element.type === "text") next.layoutFit = layoutFitForText(element, box);
  return next;
}

function compareBox(before, after) {
  return ["x", "y", "w", "h"].some((key) => Math.abs(Number(before[key] ?? 0) - Number(after[key] ?? 0)) > 0.05);
}

function reflowSlide(slide) {
  const title = slide.elements.find((element) => element.type === "text" && element.role === "title");
  const textElements = slide.elements.filter((element) => element.type === "text" && element.role !== "title");
  const visualElements = slide.elements.filter(isVisualElement);
  const userTouched = hasUserOverride(slide);
  const hasAddedText = textElements.some((element) => element.role === "custom-text");
  const isSectionDivider = slide.layoutType === "section-divider-flow";
  const hasCrampedText = textElements.some((element) => linesForText(element.text).length >= 3 && Number(element.h ?? 0) < 20);
  const isPracticeLike = String(slide.layoutType ?? "").startsWith("practice-");
  const needsReflow =
    Boolean(title) &&
    (isSectionDivider || (visualElements.length > 0 && (userTouched || visualElements.length > 1 || hasAddedText || (isPracticeLike && hasCrampedText))));

  if (!needsReflow) {
    return {
      slide,
      decision: {
        slide: slide.number,
        title: slide.title,
        applied: false,
        reason: "kept-storyboard-layout",
        moved: [],
      },
    };
  }

  const orderedTexts = [...textElements].sort((a, b) => Number(a.x ?? 0) - Number(b.x ?? 0));
  const orderedVisuals = [...visualElements].sort((a, b) => Number(a.x ?? 0) - Number(b.x ?? 0));
  const nextElements = [];

  const place = (element, box) => {
    const next = withLayout(element, box);
    nextElements.push(next);
    return next;
  };

  if (title) place(title, { x: 6, y: 6.2, w: 88, h: 11.2 });

  if (isSectionDivider) {
    if (title) {
      nextElements.length = 0;
      place(title, { x: 10, y: 23, w: 80, h: 17 });
    }
    orderedTexts.forEach((element) => place(element, { x: 14, y: 51, w: 72, h: 31 }));
  } else if (isPracticeLike && orderedTexts.length >= 1 && orderedVisuals.length === 1) {
    place(orderedVisuals[0], { x: 6, y: 22.5, w: 88, h: 35.5 });
    place(orderedTexts[0], { x: 6, y: 61.5, w: 88, h: 29 });
    orderedTexts.slice(1).forEach((element) => place(element, { x: 6, y: 88, w: 88, h: 5 }));
  } else if (orderedTexts.length >= 2 && orderedVisuals.length >= 2) {
    const textSlots = [
      { x: 6, y: 18.5, w: 41.5, h: 28 },
      { x: 51, y: 18.5, w: 43, h: 25 },
    ];
    const visualSlots = [
      { x: 6, y: 50, w: 42.2, h: 39.8 },
      { x: 51, y: 50, w: 43, h: 39.8 },
    ];
    orderedTexts.forEach((element, index) => place(element, textSlots[Math.min(index, textSlots.length - 1)]));
    orderedVisuals.forEach((element, index) => place(element, visualSlots[Math.min(index, visualSlots.length - 1)]));
  } else if (orderedTexts.length >= 1 && orderedVisuals.length >= 2) {
    place(orderedTexts[0], { x: 6, y: 23.5, w: 26.8, h: 59 });
    orderedTexts.slice(1).forEach((element) => place(element, { x: 6, y: 83.5, w: 26.8, h: 7 }));
    const visualSlots = [
      { x: 35, y: 24, w: 28.5, h: 57.5 },
      { x: 66.3, y: 24, w: 28.5, h: 57.5 },
    ];
    orderedVisuals.forEach((element, index) => place(element, visualSlots[Math.min(index, visualSlots.length - 1)]));
  } else if (orderedTexts.length >= 1 && orderedVisuals.length === 1) {
    place(orderedTexts[0], { x: 6, y: 24, w: 34, h: 58 });
    orderedTexts.slice(1).forEach((element) => place(element, { x: 6, y: 83, w: 34, h: 8 }));
    place(orderedVisuals[0], { x: 43, y: 23, w: 51, h: 60 });
  } else if (orderedVisuals.length === 1) {
    place(orderedVisuals[0], { x: 6, y: 22, w: 88, h: 66 });
  } else {
    orderedVisuals.forEach((element) => place(element, { x: 6, y: 23, w: 88, h: 65 }));
  }

  const placedIds = new Set(nextElements.map((element) => element.id));
  slide.elements.filter((element) => !placedIds.has(element.id)).forEach((element) => nextElements.push(element));
  const finalElements = normalizeBodyTextFits(nextElements).map(normalizeVisualDefaults);

  const typography = finalElements
    .filter((next) => {
      const before = nextElements.find((element) => element.id === next.id);
      return before && before.layoutFit !== next.layoutFit;
    })
    .map((next) => {
      const before = nextElements.find((element) => element.id === next.id);
      return {
        id: next.id,
        role: next.role,
        from: before.layoutFit ?? "normal",
        to: next.layoutFit ?? "normal",
      };
    });

  const moved = finalElements
    .filter((next) => {
      const before = slide.elements.find((element) => element.id === next.id);
      return before && compareBox(before, next);
    })
    .map((next) => {
      const before = slide.elements.find((element) => element.id === next.id);
      return {
        id: next.id,
        role: next.role,
        from: { x: before.x, y: before.y, w: before.w, h: before.h },
        to: { x: next.x, y: next.y, w: next.w, h: next.h },
      };
    });

  return {
    slide: {
      ...slide,
      elements: finalElements,
      layoutDirector: {
        applied: true,
        reason: "storyboard-user-edits-or-multi-asset-layout",
        source: "07_storyboard-state.json",
        typography: typography.length ? "body-text-fit-normalized" : "body-text-fit-kept",
      },
    },
    decision: {
      slide: slide.number,
      title: slide.title,
      applied: true,
      reason: "storyboard-user-edits-or-multi-asset-layout",
      moved,
      typography,
    },
  };
}

function reflowStateForPreview(state) {
  const decisions = [];
  const slides = state.slides.map((slide) => {
    const result = reflowSlide(slide);
    decisions.push(result.decision);
    return {
      ...result.slide,
      elements: result.slide.elements.map(normalizeVisualDefaults),
    };
  });
  return {
    state: {
      ...cloneJson(state),
      meta: {
        ...state.meta,
        artifact_type: state.meta?.artifact_type || "storyboard-state",
        generatedBy: "generate_ppt_preview.mjs storyboard composition",
        renderedAt: new Date().toISOString(),
      },
      slides,
    },
    decisions,
  };
}

function buildLayoutReport(decisions) {
  const applied = decisions.filter((decision) => decision.applied);
  const lines = [
    "# Storyboard Composition Report",
    "",
    `- 기준 원본: \`07_storyboard-state.json\``,
    `- final preview: \`09_ppt-preview.html\``,
    `- reflow 적용 슬라이드: ${applied.length}`,
    "",
    "## Reflow Decisions",
    "",
  ];

  for (const decision of decisions) {
    if (!decision.applied) continue;
    lines.push(`### Slide ${decision.slide}. ${decision.title}`);
    lines.push(`- reason: ${decision.reason}`);
    lines.push(`- moved elements: ${decision.moved.length}`);
    for (const moved of decision.moved) {
      lines.push(
        `  - ${moved.id} (${moved.role}): ` +
          `${Number(moved.from.x).toFixed(1)},${Number(moved.from.y).toFixed(1)},${Number(moved.from.w).toFixed(1)},${Number(moved.from.h).toFixed(1)} -> ` +
          `${Number(moved.to.x).toFixed(1)},${Number(moved.to.y).toFixed(1)},${Number(moved.to.w).toFixed(1)},${Number(moved.to.h).toFixed(1)}`,
      );
    }
    if (decision.typography?.length) {
      lines.push(`- typography normalized: ${decision.typography.length}`);
      for (const item of decision.typography) {
        lines.push(`  - ${item.id} (${item.role}): ${item.from} -> ${item.to}`);
      }
    }
    lines.push("");
  }

  if (applied.length === 0) lines.push("- 적용된 reflow 없음");
  return `${lines.join("\n")}\n`;
}

function renderTextElement(element, slide) {
  const density = textDensity(element.text);
  const longTitle = element.role === "title" && String(element.text ?? "").length > 28 ? "long-title" : "";
  const fit = element.layoutFit ? `fit-${className(element.layoutFit)}` : "";
  const style = [styleForElement(element)];
  if (element.textStyle?.fontSize) style.push(`font-size:${Number(element.textStyle.fontSize)}px`);
  if (element.textStyle?.fontWeight) style.push(`font-weight:${Number(element.textStyle.fontWeight)}`);
  if (element.textStyle?.lineHeight) style.push(`line-height:${Number(element.textStyle.lineHeight)}`);
  if (element.textStyle?.align) style.push(`text-align:${element.textStyle.align}`);
  return `<div class="element text ${className(element.role)} ${density} ${longTitle} ${fit}" data-element-id="${escapeHtml(element.id)}" data-role="${escapeHtml(element.role)}" data-type="text" style="${style.filter(Boolean).join(";")}">${formatTextBlock(element.text)}</div>`;
}

function card(label, body = "") {
  return `<div class="mini-card"><b>${escapeHtml(label)}</b>${body ? `<span>${inlineCode(body)}</span>` : ""}</div>`;
}

function ecosystemVisual() {
  return `
    <div class="visual-scene ecosystem">
      <div class="orbit orbit-a"></div>
      <div class="orbit orbit-b"></div>
      <div class="server-core">
        <span>Spring Boot</span>
        <small>서버 선택의 중심</small>
      </div>
      <div class="reason reason-1">기술 편리함</div>
      <div class="reason reason-2">운영 안정성</div>
      <div class="reason reason-3">기업 시스템</div>
      <div class="reason reason-4">취업 시장</div>
      <div class="reason reason-5">생태계</div>
    </div>`;
}

function frameworkVisual() {
  return `
    <div class="visual-scene framework">
      <div class="boundary">
        <div class="workspace-grid"></div>
        <div class="developer-desk">
          <div class="monitor"><span>핵심 기능</span></div>
          <div class="desk-line"></div>
        </div>
      </div>
      <div class="guardrail top">기본 구조</div>
      <div class="guardrail right">안전한 경계</div>
      <div class="guardrail bottom">흐름 제공</div>
      <div class="outside-risk risk-a"></div>
      <div class="outside-risk risk-b"></div>
    </div>`;
}

function troubleshootingVisual() {
  return `
    <div class="visual-scene triage">
      <div class="triage-title">문제가 생기면 먼저 역할을 나눈다</div>
      <div class="triage-lane">
        ${card("파일 전달 문제", "이미지, CSS, 정적 리소스")}
        <div class="triage-arrow"></div>
        ${card("웹 서버 쪽 확인", "경로, 배포 위치, 접근 권한")}
      </div>
      <div class="triage-lane accent">
        ${card("코드 실행 문제", "Controller, Service, 데이터")}
        <div class="triage-arrow"></div>
        ${card("WAS 쪽 확인", "매핑, 로직, 예외 로그")}
      </div>
    </div>`;
}

function requestResponseVisual() {
  return `
    <div class="visual-scene step-flow three-step">
      ${flowStep("1", "요청", "손님이 주문을 전달한다")}
      <div class="wide-arrow"></div>
      ${flowStep("2", "처리", "주방이 필요한 일을 한다")}
      <div class="wide-arrow"></div>
      ${flowStep("3", "응답", "완성된 결과를 돌려준다")}
      <div class="flow-note">서버도 요청을 받고, 일을 하고, 결과를 돌려준다.</div>
    </div>`;
}

function processFourStepVisual() {
  return `
    <div class="visual-scene step-flow four-step">
      ${flowStep("1", "요청 주소 구분", "어떤 기능으로 온 요청인가")}
      ${flowStep("2", "요청 데이터 읽기", "검색어, 로그인 정보, 주문 값")}
      ${flowStep("3", "필요한 작업 수행", "조회, 저장, 검증")}
      ${flowStep("4", "결과 응답 반환", "성공 또는 오류 응답")}
      <div class="flow-note">요청을 받고, 일을 하고, 결과를 돌려준다.</div>
    </div>`;
}

function responseProofVisual() {
  return `
    <div class="visual-scene response-proof">
      <div class="url-pill">http://localhost:8080/hello</div>
      <div class="proof-row">
        ${card("애플리케이션 실행", "Spring Boot 서버가 켜짐")}
        <div class="wide-arrow"></div>
        ${card("요청 수신", "내장 서버가 /hello를 받음")}
        <div class="wide-arrow"></div>
        ${card("Controller 응답", "Hello from Spring Boot v2")}
      </div>
    </div>`;
}

function staticDynamicVisual() {
  return `
    <div class="visual-scene static-dynamic">
      <div class="compare-card static">
        <b>정적 파일</b>
        <span>이미 만들어진 파일 전달</span>
        <small>이미지 · CSS · JavaScript</small>
      </div>
      <div class="compare-card dynamic">
        <b>동적 응답</b>
        <span>코드를 실행해 결과 생성</span>
        <small>로그인 결과 · 주문 내역 · /hello 문자열</small>
      </div>
    </div>`;
}

function failureBranchVisual() {
  return `
    <div class="visual-scene failure-branch">
      ${flowStep("1", "서버 프로그램 실행", "요청을 받을 준비가 되었나")}
      ${flowStep("2", "URL과 포트", "8080으로 보내고 있나")}
      ${flowStep("3", "경로", "/hello가 맞나")}
      ${flowStep("4", "코드 실행 오류", "Controller 내부 문제인가")}
    </div>`;
}

function troubleshootingChecklistVisual() {
  return `
    <div class="visual-scene checklist">
      <div class="check-item"><b>1</b><span>서버가 실행 중인가?</span></div>
      <div class="check-item"><b>2</b><span>URL과 포트가 맞는가?</span></div>
      <div class="check-item"><b>3</b><span>Controller 매핑이 맞는가?</span></div>
      <div class="check-footer">
        <code>http://localhost:8080/hello</code>
        <code>@GetMapping("/hello")</code>
      </div>
    </div>`;
}

function failureCardsVisual() {
  return `
    <div class="visual-scene failure-cards">
      ${card("서버 실행", "서버를 실행하지 않음")}
      ${card("URL/포트", "localhost:8081/hello 입력")}
      ${card("Controller 매핑", "/hello 대신 /hi")}
      ${card("변경 반영", "수정 후 재실행하지 않음")}
    </div>`;
}

function noticesTraceVisual() {
  return `
    <div class="visual-scene notices-trace">
      <div class="trace-head">/notices 요청을 읽는 순서</div>
      ${flowStep("1", "실제 요청 경로 확인", "/notices")}
      <div class="wide-arrow"></div>
      ${flowStep("2", "Controller 메서드 찾기", "@GetMapping")}
      <div class="wide-arrow"></div>
      ${flowStep("3", "응답 생성 지점 확인", "/hello 흐름을 확장")}
    </div>`;
}

function coffeeMachineVisual(element) {
  const split = Number(element.x ?? 0) > 50;
  const title = split ? "분리된 모듈" : "한 기계 안 역할 영역";
  const middle = split ? "연결 흐름" : "부드러운 경계";
  return `
    <div class="visual-scene coffee ${split ? "coffee-split" : "coffee-inside"}">
      <div class="coffee-title">${title}</div>
      <div class="coffee-system">
        <div class="coffee-module grinder">분쇄<br><small>1cm 이하</small></div>
        <div class="coffee-flow">${middle}</div>
        <div class="coffee-module extractor">추출<br><small>커피</small></div>
      </div>
    </div>`;
}

function httpMethodVisual() {
  return `
    <div class="visual-scene method-visual">
      <div class="method-title">요청에 의도가 붙는다</div>
      <div class="method-grid">
        ${card("GET", "가져오기")}
        ${card("POST", "새로 보내기")}
        ${card("PUT", "수정")}
        ${card("DELETE", "삭제")}
      </div>
    </div>`;
}

function httpStatusVisual() {
  return `
    <div class="visual-scene status-visual">
      <div class="method-title">응답은 결과 신호를 돌려준다</div>
      <div class="status-grid">
        ${card("1xx", "진행 중")}
        ${card("2xx", "성공")}
        ${card("3xx", "이동")}
        ${card("4xx", "요청 문제")}
        ${card("5xx", "서버 문제")}
      </div>
    </div>`;
}

function flowStep(number, title, body) {
  return `<div class="flow-step"><b>${escapeHtml(number)}</b><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`;
}

function webWasDiagram() {
  return `
    <div class="visual-scene two-node">
      <div class="node browser">브라우저</div>
      <div class="flow-arrow">요청</div>
      <div class="node web-server">
        <b>웹 서버</b>
        <span>정적 리소스 전달</span>
        <small>HTML · CSS · 이미지</small>
      </div>
      <div class="node was">
        <b>WAS</b>
        <span>코드 실행</span>
        <small>Controller · 동적 응답</small>
      </div>
      <div class="flow-return">응답</div>
    </div>`;
}

function httpDiagram() {
  return `
    <div class="visual-scene http-flow">
      <div class="http-node browser">브라우저</div>
      <div class="http-node server">서버</div>
      <div class="request-line"><span>요청</span></div>
      <div class="response-line"><span>응답</span></div>
      <div class="method-row">
        <span>GET</span><span>POST</span><span>PUT</span><span>DELETE</span>
      </div>
      <div class="status-row">
        <span>2xx 성공</span><span>3xx 이동</span><span>4xx 요청 오류</span><span>5xx 서버 오류</span>
      </div>
    </div>`;
}

function urlSplitDiagram() {
  return `
    <div class="visual-scene url-split">
      <div class="url-line">
        <span class="url-part scheme">http</span><span>://</span><span class="url-part host">localhost</span><span>:</span><span class="url-part port">8080</span><span class="url-part path">/hello</span>
      </div>
      <div class="url-labels">
        <div><b>http</b><span>통신 약속</span></div>
        <div><b>localhost</b><span>내 컴퓨터</span></div>
        <div><b>8080</b><span>서버 포트</span></div>
        <div><b>/hello</b><span>요청 경로</span></div>
      </div>
    </div>`;
}

function springToolsMock() {
  return `
    <div class="mock-browser">
      <div class="browser-bar"><span></span><span></span><span></span><b>spring.io/tools</b></div>
      <div class="mock-page tools-page">
        <div class="mock-eyebrow">Spring Tools</div>
        <h3>Spring Tools for Eclipse</h3>
        <p>Spring 기반 프로젝트 개발을 위한 공식 도구 페이지</p>
        <div class="download-grid">
          ${card("macOS ARM_64", "Apple Silicon Mac")}
          ${card("macOS x86_64", "Intel Mac")}
          ${card("Windows", "보조 환경")}
        </div>
        <div class="mock-callout">공식 페이지 기준으로 확인</div>
      </div>
    </div>`;
}

function stsWizardMock(sources = {}) {
  const displayName = sources.projectName || "spring-practice";
  return `
    <div class="app-window">
      <div class="window-bar"><b>New Spring Boot Project</b></div>
      <div class="wizard-body">
        <div class="field-row"><span>Project</span><b>${escapeHtml(displayName)}</b></div>
        <div class="field-row"><span>Java</span><b>21</b></div>
        <div class="field-row"><span>Build</span><b>Gradle</b></div>
        <div class="dependency-panel">
          <b>Dependencies</b>
          <div class="checked">spring-boot-starter-webmvc</div>
        </div>
      </div>
    </div>`;
}

function codeBlock(title, code, language = "") {
  return `<div class="code-card ${language}"><div class="code-title">${escapeHtml(title)}</div><pre><code>${escapeHtml(code.trim())}</code></pre></div>`;
}

function controllerAndPort(sources) {
  return `
    <div class="source-compare">
      ${codeBlock("HelloController.java", sources.controller)}
      ${codeBlock("application.properties", sources.properties)}
    </div>`;
}

function codeRunBrowser(sources) {
  const controllerSnippet = sources.controller
    .split("\n")
    .filter((line) => /Controller|Mapping|@|String\s+\w+|return\s+/.test(line))
    .slice(0, 14)
    .join("\n");
  const terminal =
    sources.bootRun?.trim() ||
    [
      "$ ./gradlew bootRun",
      "> Task :bootRun",
      `Started ${sources.projectName || "Spring Boot practice project"}`,
    ].join("\n");
  const browser = sources.response?.trim() || "실행 결과는 02_practice-code/03_run-captures 기준으로 확인";
  return `
    <div class="run-stack">
      ${codeBlock("Controller 핵심 코드", controllerSnippet)}
      ${codeBlock("터미널 실행", terminal, "terminal")}
      <div class="browser-result">
        <div class="address">practice-code 실행 결과</div>
        <div class="response">${escapeHtml(browser)}</div>
      </div>
    </div>`;
}

function usesCh01VisualPack(sources = {}) {
  const marker = `${sources.productionId || ""} ${sources.projectName || ""}`;
  return /ch01|hello-server|server-webapp-runtime/i.test(marker);
}

function genericVisual(slide, element) {
  const briefLines = linesForText(element.text || slide.humanBrief || slide.screenFields?.question || slide.title).slice(0, 4);
  const chips = briefLines.length
    ? briefLines.map((line) => `<span>${inlineCode(line.replace(/^[-•]\s*/, ""))}</span>`).join("")
    : `<span>${escapeHtml(slide.title)}</span>`;
  return `
    <div class="visual-scene polished generic-visual">
      <div class="generic-title">${escapeHtml(slide.title)}</div>
      <div class="generic-chips">${chips}</div>
    </div>`;
}

function visualFor(slide, element, sources) {
  const explicitAsset = element.asset?.src || element.assetDataUrl || element.assetSrc || element.asset?.path || "";
  if (explicitAsset) {
    return `<img class="generated-image" src="${escapeHtml(explicitAsset)}" alt="${escapeHtml(slide.title)}" draggable="false">`;
  }

  const generatedSrc = providedImageFor(slide, element);
  if (generatedSrc) {
    return `<img class="generated-image" src="${escapeHtml(generatedSrc)}" alt="${escapeHtml(slide.title)}" draggable="false">`;
  }

  if (!usesCh01VisualPack(sources)) {
    return genericVisual(slide, element);
  }

  switch (slide.number) {
    case 1:
      return ecosystemVisual();
    case 4:
      return frameworkVisual();
    case 5:
      return requestResponseVisual();
    case 6:
      return processFourStepVisual();
    case 7:
      return responseProofVisual();
    case 9:
      return webWasDiagram();
    case 10:
      return coffeeMachineVisual(element);
    case 11:
      return staticDynamicVisual();
    case 13:
      return Number(element.x ?? 0) < 30 ? httpMethodVisual() : httpStatusVisual();
    case 14:
      return urlSplitDiagram();
    case 15:
      return failureBranchVisual();
    case 17:
      return springToolsMock();
    case 18:
      return stsWizardMock(sources);
    case 19:
      return controllerAndPort(sources);
    case 20:
      return codeRunBrowser(sources);
    case 22:
      return troubleshootingChecklistVisual();
    case 23:
      return failureCardsVisual();
    case 24:
      return noticesTraceVisual();
    default:
      return genericVisual(slide, element);
  }
}

function renderVisualElement(element, slide, sources) {
  const kindClass = className(String(element.type ?? "visual").replace("-placeholder", ""));
  return `<div class="element visual ${className(element.role)} visual-${kindClass}" data-element-id="${escapeHtml(element.id)}" data-role="${escapeHtml(element.role)}" data-type="${escapeHtml(element.type)}" style="${styleForElement(element)}">${visualFor(slide, element, sources)}</div>`;
}

function renderElement(element, slide, sources) {
  if (element.type === "text") return renderTextElement(element, slide);
  return renderVisualElement(element, slide, sources);
}

function renderSlide(slide, sources) {
  const layoutClass = `layout-${className(slide.layoutType)}`;
  const directorClass = slide.layoutDirector?.applied ? "layout-directed" : "";
  const rendered = slide.elements.map((element) => renderElement(element, slide, sources)).join("\n");
  return `
    <section id="slide-${String(slide.number).padStart(2, "0")}" class="ppt-slide ${layoutClass} ${directorClass}" data-slide-number="${slide.number}" aria-label="slide ${slide.number}: ${escapeHtml(slide.title)}">
      <div class="slide-accent"></div>
      ${rendered}
    </section>`;
}

function buildHtml(state, sources) {
  const slides = state.slides.map((slide) => renderSlide(slide, sources)).join("\n");
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title>${escapeHtml(state.meta.title)} - PPT Preview</title>
  <style>
    :root {
      --ink: #18212f;
      --muted: #5b6678;
      --line: #dbe3ee;
      --paper: #ffffff;
      --soft: #f5f7fb;
      --teal: #0f766e;
      --green: #16a34a;
      --blue: #2563eb;
      --amber: #f59e0b;
      --red: #dc2626;
      --violet: #7c3aed;
      --fs-micro: 14px;
      --fs-caption: 16px;
      --fs-label: 18px;
      --fs-body-compact: 20px;
      --fs-body: 22px;
      --fs-callout: 24px;
      --fs-visual-title: 28px;
      --fs-section: 34px;
      --fs-title-long: 36px;
      --fs-title: 42px;
      --lh-title: 1.14;
      --lh-body: 1.34;
      --lh-body-compact: 1.28;
      --lh-list: 1.45;
      --gap-body: 10px;
      --gap-body-compact: 8px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: #edf1f6;
      color: var(--ink);
      font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", Arial, sans-serif;
    }

    .deck {
      display: grid;
      gap: 28px;
      justify-items: center;
      padding: 32px 0 56px;
    }

    .ppt-slide {
      position: relative;
      width: 1280px;
      height: 720px;
      overflow: hidden;
      background:
        linear-gradient(90deg, rgba(15, 118, 110, 0.08), transparent 32%),
        linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid rgba(24, 33, 47, 0.12);
      box-shadow: 0 18px 48px rgba(24, 33, 47, 0.16);
      isolation: isolate;
    }

    .slide-accent {
      position: absolute;
      left: 0;
      top: 0;
      width: 12px;
      height: 100%;
      background: linear-gradient(180deg, var(--teal), var(--blue) 45%, var(--amber));
      z-index: 0;
    }

    .element {
      position: absolute;
      z-index: 1;
    }

    .text {
      display: flex;
      align-items: flex-start;
      color: var(--ink);
    }

    .text .formatted {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--gap-body);
      line-height: var(--lh-body);
      word-break: keep-all;
      overflow-wrap: anywhere;
    }

    .text .formatted strong {
      display: block;
      color: var(--teal);
      font-weight: 800;
      font-size: var(--fs-callout);
      line-height: var(--lh-body);
      margin-bottom: 2px;
    }

    code {
      font-family: "D2Coding", "Cascadia Mono", Consolas, monospace;
      background: rgba(37, 99, 235, 0.08);
      color: #1d4ed8;
      padding: 1px 6px;
      border-radius: 5px;
      font-size: var(--fs-body-compact);
    }

    .title {
      align-items: center;
      font-size: var(--fs-title);
      font-weight: 850;
      letter-spacing: 0;
      line-height: var(--lh-title);
    }

    .title.long-title { font-size: var(--fs-title-long); }

    .screen-text {
      font-size: var(--fs-body);
      font-weight: 550;
    }

    .custom-text {
      font-size: var(--fs-body);
      font-weight: 550;
    }

    .screen-text.dense { font-size: var(--fs-body-compact); }
    .screen-text.very-dense { font-size: var(--fs-body-compact); }

    .layout-directed .title {
      font-size: var(--fs-title-long);
    }

    .layout-directed .title.long-title {
      font-size: var(--fs-section);
    }

    .layout-directed .screen-text,
    .layout-directed .custom-text {
      font-size: var(--fs-body);
    }

    .layout-directed .fit-balanced {
      font-size: var(--fs-body);
    }

    .layout-directed .fit-compact {
      font-size: var(--fs-body-compact);
    }

    .layout-directed .fit-tight {
      font-size: var(--fs-body-compact);
    }

    .layout-directed .fit-balanced .formatted {
      gap: var(--gap-body-compact);
      line-height: var(--lh-body-compact);
    }

    .layout-directed .fit-compact .formatted {
      gap: var(--gap-body-compact);
      line-height: var(--lh-body-compact);
    }

    .layout-directed .fit-tight .formatted {
      gap: var(--gap-body-compact);
      line-height: var(--lh-body-compact);
    }

    .objective-card,
    .content-card {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid var(--line);
      border-left: 8px solid var(--teal);
      border-radius: 8px;
      padding: 28px;
      font-size: var(--fs-callout);
      box-shadow: 0 14px 32px rgba(24, 33, 47, 0.08);
    }

    .content-card { border-left-color: var(--amber); }

    .layout-section-divider-flow {
      background:
        linear-gradient(120deg, rgba(15, 118, 110, 0.12), transparent 45%),
        linear-gradient(300deg, rgba(245, 158, 11, 0.16), transparent 45%),
        #ffffff;
    }

    .layout-section-divider-flow .title {
      justify-content: center;
      text-align: center;
      font-size: var(--fs-title);
    }

    .layout-section-divider-flow .screen-text {
      justify-content: center;
      text-align: center;
      color: var(--muted);
      font-size: var(--fs-body);
    }

    .layout-directed.layout-section-divider-flow .title {
      font-size: var(--fs-title-long);
    }

    .layout-directed.layout-section-divider-flow .screen-text {
      font-size: var(--fs-body);
      line-height: var(--lh-body-compact);
    }

    .layout-directed.layout-section-divider-flow .screen-text .formatted {
      gap: var(--gap-body-compact);
    }

    .layout-source-two-column-list .screen-text .formatted {
      columns: 2;
      column-gap: 54px;
      display: block;
      font-size: var(--fs-body-compact);
      line-height: var(--lh-list);
    }

    .layout-source-two-column-list .screen-text .formatted span {
      display: block;
      break-inside: avoid;
      margin-bottom: 8px;
    }

    .visual {
      border-radius: 8px;
      overflow: hidden;
    }

    .generated-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: var(--asset-fit, contain);
      object-position: var(--asset-position-x, 50%) var(--asset-position-y, 50%);
      transform: scale(var(--asset-scale, 1));
      transform-origin: center center;
      border: 1px solid rgba(91, 102, 120, 0.22);
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 16px 36px rgba(24, 33, 47, 0.10);
      -webkit-user-drag: none;
      user-select: none;
    }

    .visual-scene,
    .mock-browser,
    .app-window,
    .source-compare,
    .run-stack {
      width: 100%;
      height: 100%;
      border: 1px solid rgba(91, 102, 120, 0.22);
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 16px 36px rgba(24, 33, 47, 0.10);
      position: relative;
      overflow: hidden;
    }

    .visual-scene::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.13), transparent 26%),
        radial-gradient(circle at 84% 78%, rgba(245, 158, 11, 0.18), transparent 26%);
      pointer-events: none;
    }

    .ecosystem .orbit {
      position: absolute;
      border: 2px solid rgba(37, 99, 235, 0.24);
      border-radius: 50%;
      left: 12%;
      top: 10%;
      width: 76%;
      height: 76%;
    }

    .ecosystem .orbit-b {
      transform: rotate(28deg);
      border-color: rgba(15, 118, 110, 0.25);
    }

    .server-core {
      position: absolute;
      left: 30%;
      top: 32%;
      width: 40%;
      height: 34%;
      display: grid;
      place-items: center;
      text-align: center;
      background: #102a43;
      color: white;
      border-radius: 8px;
      box-shadow: 0 18px 36px rgba(16, 42, 67, 0.24);
      padding: 20px;
      z-index: 2;
    }

    .server-core span {
      font-size: var(--fs-visual-title);
      font-weight: 850;
    }

    .server-core small {
      font-size: var(--fs-micro);
      color: rgba(255, 255, 255, 0.82);
    }

    .reason {
      position: absolute;
      min-width: 120px;
      text-align: center;
      padding: 12px 14px;
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-size: var(--fs-label);
      font-weight: 800;
      box-shadow: 0 10px 24px rgba(24, 33, 47, 0.09);
      z-index: 3;
    }

    .reason-1 { left: 7%; top: 18%; color: var(--blue); }
    .reason-2 { right: 6%; top: 18%; color: var(--green); }
    .reason-3 { left: 4%; bottom: 18%; color: var(--teal); }
    .reason-4 { right: 5%; bottom: 18%; color: var(--amber); }
    .reason-5 { left: 39%; top: 6%; color: var(--violet); }

    .framework .boundary {
      position: absolute;
      left: 17%;
      top: 18%;
      width: 66%;
      height: 58%;
      border: 4px solid var(--teal);
      border-radius: 8px;
      background: rgba(15, 118, 110, 0.08);
    }

    .workspace-grid {
      position: absolute;
      inset: 18px;
      background-image:
        linear-gradient(rgba(15,118,110,0.13) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15,118,110,0.13) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    .developer-desk {
      position: absolute;
      left: 29%;
      top: 28%;
      width: 42%;
      height: 42%;
      display: grid;
      place-items: center;
    }

    .monitor {
      width: 76%;
      height: 58%;
      background: #102a43;
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: white;
      font-size: var(--fs-callout);
      font-weight: 850;
    }

    .desk-line {
      width: 88%;
      height: 8px;
      background: var(--amber);
      border-radius: 999px;
    }

    .guardrail {
      position: absolute;
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px 14px;
      font-weight: 850;
      font-size: var(--fs-body-compact);
      box-shadow: 0 10px 24px rgba(24, 33, 47, 0.08);
    }

    .guardrail.top { left: 38%; top: 9%; color: var(--teal); }
    .guardrail.right { right: 4%; top: 45%; color: var(--blue); }
    .guardrail.bottom { left: 38%; bottom: 8%; color: var(--amber); }

    .outside-risk {
      position: absolute;
      width: 44px;
      height: 44px;
      border: 3px solid rgba(220, 38, 38, 0.35);
      border-radius: 50%;
    }

    .risk-a { left: 6%; top: 18%; }
    .risk-b { right: 8%; bottom: 17%; }

    .triage {
      padding: 34px;
      display: grid;
      gap: 28px;
      align-content: center;
    }

    .triage-title {
      font-size: var(--fs-callout);
      font-weight: 850;
      color: var(--teal);
      z-index: 2;
    }

    .triage-lane {
      display: grid;
      grid-template-columns: 1fr 64px 1fr;
      gap: 18px;
      align-items: center;
      z-index: 2;
    }

    .mini-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      background: rgba(255,255,255,0.92);
      min-height: 92px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
    }

    .mini-card b {
      font-size: var(--fs-body);
      color: var(--ink);
    }

    .mini-card span {
      font-size: var(--fs-caption);
      color: var(--muted);
    }

    .triage-arrow,
    .flow-arrow,
    .flow-return {
      height: 4px;
      background: var(--blue);
      border-radius: 999px;
      position: relative;
    }

    .triage-arrow::after,
    .flow-arrow::after,
    .flow-return::after {
      content: "";
      position: absolute;
      right: -2px;
      top: -6px;
      border-left: 12px solid var(--blue);
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }

    .triage-lane.accent .triage-arrow { background: var(--amber); }
    .triage-lane.accent .triage-arrow::after { border-left-color: var(--amber); }

    .two-node {
      padding: 34px;
      display: grid;
      grid-template-columns: 1fr 70px 1fr 1fr;
      align-items: center;
      gap: 18px;
    }

    .node,
    .http-node {
      min-height: 150px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.92);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: 10px;
      font-size: var(--fs-body);
      font-weight: 850;
      z-index: 2;
    }

    .node span {
      font-size: var(--fs-label);
      font-weight: 700;
      color: var(--muted);
    }

    .node small {
      font-size: var(--fs-caption);
      color: var(--teal);
      font-weight: 800;
    }

    .web-server { border-top: 8px solid var(--blue); }
    .was { border-top: 8px solid var(--amber); }

    .flow-return {
      position: absolute;
      left: 27%;
      bottom: 20%;
      width: 50%;
      background: var(--teal);
    }

    .flow-return::after { border-left-color: var(--teal); }

    .http-flow {
      padding: 36px;
    }

    .http-node {
      position: absolute;
      top: 30%;
      width: 27%;
      height: 30%;
    }

    .http-node.browser { left: 9%; border-top: 8px solid var(--blue); }
    .http-node.server { right: 9%; border-top: 8px solid var(--green); }

    .request-line,
    .response-line {
      position: absolute;
      left: 38%;
      width: 24%;
      height: 4px;
      background: var(--blue);
      border-radius: 999px;
      z-index: 3;
    }

    .request-line { top: 41%; }
    .response-line {
      top: 56%;
      background: var(--green);
      transform: rotate(180deg);
    }

    .request-line span,
    .response-line span {
      position: absolute;
      top: -34px;
      left: 36%;
      font-weight: 850;
      color: var(--ink);
      transform: rotate(0);
    }

    .request-line::after,
    .response-line::after {
      content: "";
      position: absolute;
      right: -2px;
      top: -6px;
      border-left: 12px solid currentColor;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      color: inherit;
    }

    .method-row,
    .status-row {
      position: absolute;
      left: 9%;
      right: 9%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .method-row { top: 10%; }
    .status-row { bottom: 9%; }

    .method-row span,
    .status-row span {
      text-align: center;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px 8px;
      font-weight: 850;
    }

    .url-split {
      padding: 34px;
      display: grid;
      align-content: center;
      gap: 34px;
    }

    .url-line {
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "D2Coding", "Cascadia Mono", Consolas, monospace;
      font-size: var(--fs-section);
      font-weight: 850;
      background: #102a43;
      color: #ffffff;
      border-radius: 8px;
      padding: 24px;
    }

    .url-part {
      padding: 8px 10px;
      border-radius: 6px;
      color: #ffffff;
    }

    .scheme { background: var(--blue); }
    .host { background: var(--teal); }
    .port { background: var(--amber); }
    .path { background: var(--violet); }

    .url-labels {
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .url-labels div {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      text-align: center;
    }

    .url-labels b {
      display: block;
      font-size: var(--fs-body-compact);
      color: var(--ink);
    }

    .url-labels span {
      font-size: var(--fs-caption);
      color: var(--muted);
    }

    .browser-bar,
    .window-bar {
      height: 42px;
      background: #102a43;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 18px;
      font-size: var(--fs-caption);
    }

    .browser-bar span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #f87171;
    }

    .browser-bar span:nth-child(2) { background: #facc15; }
    .browser-bar span:nth-child(3) { background: #4ade80; }

    .browser-bar b {
      margin-left: 16px;
      font-weight: 650;
      color: rgba(255,255,255,0.86);
    }

    .mock-page,
    .wizard-body {
      height: calc(100% - 42px);
      padding: 34px;
      background: #ffffff;
    }

    .mock-eyebrow {
      color: var(--teal);
      font-size: var(--fs-label);
      font-weight: 850;
    }

    .mock-page h3 {
      margin: 8px 0 10px;
      font-size: var(--fs-section);
      color: var(--ink);
    }

    .mock-page p {
      margin: 0 0 26px;
      font-size: var(--fs-body-compact);
      color: var(--muted);
    }

    .download-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .mock-callout {
      margin-top: 26px;
      display: inline-block;
      padding: 10px 14px;
      border-radius: 8px;
      background: rgba(15,118,110,0.10);
      color: var(--teal);
      font-weight: 850;
    }

    .field-row {
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
      gap: 18px;
      padding: 16px 0;
      border-bottom: 1px solid var(--line);
      font-size: var(--fs-body);
    }

    .field-row span {
      color: var(--muted);
      font-weight: 750;
    }

    .field-row b {
      color: var(--ink);
      font-weight: 850;
    }

    .dependency-panel {
      margin-top: 24px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      background: var(--soft);
      font-size: var(--fs-body-compact);
    }

    .checked {
      margin-top: 14px;
      background: #ffffff;
      border: 1px solid rgba(22, 163, 74, 0.45);
      border-left: 8px solid var(--green);
      border-radius: 8px;
      padding: 14px;
      font-weight: 850;
      color: var(--green);
    }

    .source-compare {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 18px;
      padding: 20px;
      background: #f8fafc;
    }

    .code-card {
      min-width: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #101827;
      color: #e5edf8;
    }

    .code-title {
      flex: none;
      padding: 11px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      color: #a7f3d0;
      font-weight: 850;
      font-size: var(--fs-caption);
    }

    pre {
      margin: 0;
      padding: 16px;
      overflow: hidden;
      font-family: "D2Coding", "Cascadia Mono", Consolas, monospace;
      font-size: var(--fs-caption);
      line-height: var(--lh-list);
      white-space: pre-wrap;
    }

    pre code {
      padding: 0;
      background: transparent;
      color: inherit;
      font-size: inherit;
      border-radius: 0;
    }

    .run-stack {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 0.6fr;
      gap: 14px;
      padding: 18px;
      background: #f8fafc;
    }

    .run-stack .code-card:first-child {
      grid-row: 1 / 3;
    }

    .terminal .code-title { color: #fde68a; }

    .browser-result {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #ffffff;
      display: grid;
      grid-template-rows: auto 1fr;
      overflow: hidden;
    }

    .address {
      padding: 12px 16px;
      background: #edf2f7;
      font-family: "D2Coding", "Cascadia Mono", Consolas, monospace;
      font-size: var(--fs-caption);
      color: var(--muted);
    }

    .response {
      display: grid;
      place-items: center;
      font-size: var(--fs-callout);
      font-weight: 850;
      color: var(--green);
    }

    .step-flow,
    .failure-branch,
    .notices-trace {
      padding: 26px;
      display: grid;
      align-items: center;
      gap: 14px;
      z-index: 1;
    }

    .three-step {
      grid-template-columns: 1fr 42px 1fr 42px 1fr;
      grid-template-rows: 1fr auto;
    }

    .four-step,
    .failure-branch {
      grid-template-columns: repeat(4, 1fr);
    }

    .flow-step {
      position: relative;
      z-index: 2;
      min-width: 0;
      min-height: 126px;
      border: 1px solid var(--line);
      border-top: 7px solid var(--teal);
      border-radius: 8px;
      background: rgba(255,255,255,0.94);
      padding: 16px;
      display: grid;
      align-content: center;
      gap: 8px;
      box-shadow: 0 10px 24px rgba(24, 33, 47, 0.08);
    }

    .failure-branch .flow-step:nth-child(2) { border-top-color: var(--blue); }
    .failure-branch .flow-step:nth-child(3) { border-top-color: var(--amber); }
    .failure-branch .flow-step:nth-child(4) { border-top-color: var(--red); }

    .flow-step b {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: var(--teal);
      color: #fff;
      font-size: var(--fs-label);
    }

    .flow-step strong {
      font-size: var(--fs-body-compact);
      color: var(--ink);
      line-height: var(--lh-body-compact);
    }

    .flow-step span {
      font-size: var(--fs-micro);
      color: var(--muted);
      line-height: var(--lh-body);
    }

    .flow-note {
      grid-column: 1 / -1;
      z-index: 2;
      justify-self: center;
      padding: 10px 16px;
      border-radius: 8px;
      background: rgba(15,118,110,0.10);
      color: var(--teal);
      font-weight: 850;
      font-size: var(--fs-label);
    }

    .wide-arrow {
      position: relative;
      height: 4px;
      background: var(--blue);
      border-radius: 999px;
      z-index: 2;
    }

    .wide-arrow::after {
      content: "";
      position: absolute;
      right: -2px;
      top: -6px;
      border-left: 12px solid var(--blue);
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }

    .response-proof,
    .checklist,
    .failure-cards,
    .static-dynamic,
    .coffee,
    .method-visual,
    .status-visual {
      padding: 26px;
      display: grid;
      align-content: center;
      gap: 18px;
    }

    .url-pill {
      z-index: 2;
      justify-self: center;
      padding: 14px 18px;
      border-radius: 8px;
      background: #102a43;
      color: #fff;
      font-family: "D2Coding", "Cascadia Mono", Consolas, monospace;
      font-size: var(--fs-body);
      font-weight: 850;
    }

    .proof-row {
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr 42px 1fr 42px 1fr;
      gap: 14px;
      align-items: center;
    }

    .static-dynamic {
      grid-template-columns: 1fr 1fr;
    }

    .compare-card {
      z-index: 2;
      min-height: 210px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255,255,255,0.94);
      padding: 24px;
      display: grid;
      align-content: center;
      gap: 12px;
      text-align: center;
    }

    .compare-card.static { border-top: 8px solid var(--blue); }
    .compare-card.dynamic { border-top: 8px solid var(--amber); }

    .compare-card b {
      font-size: var(--fs-callout);
      color: var(--ink);
    }

    .compare-card span {
      font-size: var(--fs-label);
      color: var(--muted);
    }

    .compare-card small {
      font-size: var(--fs-caption);
      color: var(--teal);
      font-weight: 850;
    }

    .checklist {
      grid-template-rows: repeat(3, auto) 1fr;
    }

    .check-item {
      z-index: 2;
      display: grid;
      grid-template-columns: 42px 1fr;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255,255,255,0.94);
      font-size: var(--fs-body-compact);
      font-weight: 850;
    }

    .check-item b {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: var(--green);
      color: #fff;
    }

    .check-footer {
      z-index: 2;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .failure-cards {
      grid-template-columns: 1fr 1fr;
    }

    .coffee-title,
    .method-title,
    .trace-head {
      z-index: 2;
      text-align: center;
      font-size: var(--fs-body-compact);
      font-weight: 850;
      color: var(--teal);
    }

    .coffee-system {
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr 0.8fr 1fr;
      gap: 12px;
      align-items: center;
      border: 2px solid rgba(15,118,110,0.28);
      border-radius: 8px;
      background: rgba(255,255,255,0.76);
      padding: 18px;
      min-height: 210px;
    }

    .coffee-module {
      min-height: 120px;
      display: grid;
      place-items: center;
      text-align: center;
      border-radius: 8px;
      color: #fff;
      font-size: var(--fs-callout);
      font-weight: 850;
      line-height: var(--lh-body-compact);
    }

    .coffee-module small {
      font-size: var(--fs-micro);
      color: rgba(255,255,255,0.86);
    }

    .grinder { background: var(--amber); }
    .extractor { background: var(--teal); }

    .coffee-flow {
      color: var(--muted);
      font-weight: 850;
      text-align: center;
      position: relative;
    }

    .coffee-flow::before,
    .coffee-flow::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 38%;
      height: 4px;
      background: var(--blue);
      border-radius: 999px;
    }

    .coffee-flow::before { left: -8%; }
    .coffee-flow::after { right: -8%; }

    .method-grid,
    .status-grid {
      z-index: 2;
      display: grid;
      gap: 10px;
    }

    .method-grid { grid-template-columns: 1fr 1fr; }
    .status-grid { grid-template-columns: 1fr; }

    .status-grid .mini-card {
      min-height: 54px;
      padding: 10px 14px;
      display: grid;
      grid-template-columns: 58px 1fr;
      align-items: center;
      gap: 10px;
    }

    .status-grid .mini-card b { font-size: var(--fs-body-compact); }
    .status-grid .mini-card span { font-size: var(--fs-caption); }

    .notices-trace {
      grid-template-columns: 1fr 38px 1fr 38px 1fr;
      grid-template-rows: auto 1fr;
    }

    .notices-trace .trace-head {
      grid-column: 1 / -1;
    }

    @media (max-width: 1340px) {
      .deck {
        align-items: start;
        overflow-x: auto;
        padding-left: 24px;
        padding-right: 24px;
      }
    }

    @media print {
      body { background: #ffffff; }
      .deck { display: block; padding: 0; }
      .ppt-slide {
        width: 100vw;
        height: 56.25vw;
        max-height: 100vh;
        page-break-after: always;
        border: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <main class="deck">
${slides}
  </main>
</body>
</html>
`;
}

function scriptJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function storyboardControlsHtml(state) {
  const navItems = state.slides
    .map((slide) => {
      const number = String(slide.number).padStart(2, "0");
      return `<a href="#slide-${number}" data-nav-slide="${slide.number}"><b class="nav-number">${number}</b><span class="nav-title">${escapeHtml(slide.title)}</span></a>`;
    })
    .join("\n");

  return `
  <aside class="storyboard-nav" aria-label="slide navigator">
    <div class="storyboard-nav-title">슬라이드</div>
    <div class="storyboard-nav-list">
      ${navItems}
    </div>
  </aside>
  <aside class="storyboard-toolbar" aria-label="storyboard editor">
    <div class="storyboard-title">스토리보드 편집</div>
    <div class="storyboard-hint">완성 슬라이드 위에서 이미지, 텍스트, 맞춤, 레이어를 조정합니다.</div>
    <div class="selected-summary" id="selectedSummary">선택된 요소 없음</div>
    <div class="control-grid">
      <label>X <input id="editX" type="number" step="0.1"></label>
      <label>Y <input id="editY" type="number" step="0.1"></label>
      <label>W <input id="editW" type="number" step="0.1"></label>
      <label>H <input id="editH" type="number" step="0.1"></label>
    </div>
    <div class="control-grid image-controls">
      <label>Fit <select id="assetFit"><option>contain</option><option>cover</option><option>fill</option></select></label>
      <label>X% <input id="assetPosX" type="number" min="0" max="100" step="1"></label>
      <label>Y% <input id="assetPosY" type="number" min="0" max="100" step="1"></label>
      <label>Zoom <input id="assetScale" type="number" min="0.5" max="3" step="0.05"></label>
    </div>
    <div class="control-grid text-controls">
      <label>Size <select id="textSize"><option value="">auto</option><option>14</option><option>16</option><option>18</option><option>20</option><option>22</option><option>24</option><option>28</option><option>34</option><option>36</option><option>42</option></select></label>
      <label>Line <select id="textLineHeight"><option value="">auto</option><option>1.28</option><option>1.34</option><option>1.45</option></select></label>
      <label>Align <select id="textAlign"><option>left</option><option>center</option><option>right</option></select></label>
      <label>Weight <select id="textWeight"><option value="">auto</option><option>550</option><option>650</option><option>750</option><option>850</option><option>900</option></select></label>
    </div>
    <label class="wide-control text-editor-control">텍스트 <textarea id="textEditor" rows="3"></textarea></label>
    <label class="wide-control prompt-control">프롬프트/메모 <textarea id="promptEditor" rows="3"></textarea></label>
    <div class="toolbar-actions">
      <button type="button" id="addImage">사진 추가</button>
      <button type="button" id="replaceImage">사진 교체</button>
      <button type="button" id="addText">텍스트 추가</button>
      <button type="button" id="duplicateElement">복제</button>
      <button type="button" id="bringForward">앞으로</button>
      <button type="button" id="sendBackward">뒤로</button>
      <button type="button" id="deleteElement">삭제</button>
      <button type="button" id="importState">JSON 불러오기</button>
      <button type="button" id="downloadState">JSON 다운로드</button>
      <button type="button" id="clearSelection">선택 해제</button>
    </div>
    <input id="assetFile" type="file" accept="image/*" hidden>
    <input id="importStateFile" type="file" accept="application/json,.json" hidden>
  </aside>
  <script type="application/json" id="storyboard-state">${scriptJson(state)}</script>
  <script>
  (() => {
    const state = JSON.parse(document.getElementById("storyboard-state").textContent);
    const storageKey = "wysiwyg-storyboard:" + location.pathname;
    const cssEscape = window.CSS && CSS.escape ? CSS.escape : (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, "\\\\$&");
    const selectedSummary = document.getElementById("selectedSummary");
    const fields = {
      x: document.getElementById("editX"),
      y: document.getElementById("editY"),
      w: document.getElementById("editW"),
      h: document.getElementById("editH"),
    };
    const imageFields = {
      fit: document.getElementById("assetFit"),
      x: document.getElementById("assetPosX"),
      y: document.getElementById("assetPosY"),
      scale: document.getElementById("assetScale"),
    };
    const textFields = {
      text: document.getElementById("textEditor"),
      size: document.getElementById("textSize"),
      lineHeight: document.getElementById("textLineHeight"),
      align: document.getElementById("textAlign"),
      weight: document.getElementById("textWeight"),
    };
    const promptEditor = document.getElementById("promptEditor");
    const assetFile = document.getElementById("assetFile");
    const importStateFile = document.getElementById("importStateFile");
    let selected = null;
    let drag = null;

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved?.slides?.length === state.slides.length) {
        for (const slide of state.slides) {
          const savedSlide = saved.slides.find((item) => item.number === slide.number);
          if (!savedSlide) continue;
          slide.elements = savedSlide.elements || slide.elements;
          syncSlideDom(slide);
        }
      }
    } catch (error) {
      console.warn("Saved storyboard state ignored.", error);
    }

    function className(value) {
      return String(value || "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "");
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function formatTextBlock(text) {
      const lines = String(text || "").split(/\\r?\\n/).map((line) => line.trim()).filter(Boolean);
      if (!lines.length) lines.push("새 텍스트");
      return '<div class="formatted">' + lines.map((line, index) => {
        const tag = index === 0 && lines.length > 1 && line.length <= 18 ? "strong" : "span";
        return "<" + tag + ">" + escapeHtml(line) + "</" + tag + ">";
      }).join("") + "</div>";
    }

    function visualAssetSrc(element) {
      return element.asset?.src || element.assetDataUrl || element.assetSrc || element.asset?.path || "";
    }

    function slideNumberFor(el) {
      return Number(el.closest(".ppt-slide")?.dataset.slideNumber || 0);
    }

    function findStateElement(el) {
      const slide = state.slides.find((item) => item.number === slideNumberFor(el));
      if (!slide) return {};
      const element = slide.elements.find((item) => item.id === el.dataset.elementId);
      return { slide, element };
    }

    function activeSlideDom() {
      if (selected) return selected.closest(".ppt-slide");
      const slides = [...document.querySelectorAll(".ppt-slide")];
      const viewportCenter = window.innerHeight / 2;
      return slides
        .map((slide) => {
          const rect = slide.getBoundingClientRect();
          return { slide, distance: Math.abs((rect.top + rect.bottom) / 2 - viewportCenter) };
        })
        .sort((a, b) => a.distance - b.distance)[0]?.slide || slides[0];
    }

    function activeSlide() {
      const number = Number(activeSlideDom()?.dataset.slideNumber || state.slides[0]?.number || 1);
      return state.slides.find((slide) => slide.number === number) || state.slides[0];
    }

    function ensureLayers(slide) {
      slide.elements.forEach((element, index) => {
        if (!Number.isFinite(Number(element.zIndex))) element.zIndex = index + 1;
      });
    }

    const EDITABLE_CONTENT_TOP = 18;
    const MIN_ELEMENT_SIZE = 3;

    function deltaPct(value, total) {
      return (value / total) * 100;
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function minTopForElement(element) {
      if (element?.role === "title") return 0;
      if (element?.type !== "text") return 0;
      return EDITABLE_CONTENT_TOP;
    }

    function constrainElementBox(element) {
      const minY = minTopForElement(element);
      element.w = clamp(Number(element.w) || MIN_ELEMENT_SIZE, MIN_ELEMENT_SIZE, 100);
      element.h = clamp(Number(element.h) || MIN_ELEMENT_SIZE, MIN_ELEMENT_SIZE, 100 - minY);
      element.x = clamp(Number(element.x) || 0, 0, Math.max(0, 100 - element.w));
      element.y = clamp(Number(element.y) || minY, minY, Math.max(minY, 100 - element.h));
    }

    function syncGeometryFields(element) {
      fields.x.value = Number(element.x).toFixed(1);
      fields.y.value = Number(element.y).toFixed(1);
      fields.w.value = Number(element.w).toFixed(1);
      fields.h.value = Number(element.h).toFixed(1);
    }

    function applyElementToDom(el, element) {
      el.style.left = element.x + "%";
      el.style.top = element.y + "%";
      el.style.width = element.w + "%";
      el.style.height = element.h + "%";
      if (Number.isFinite(Number(element.zIndex))) el.style.zIndex = Number(element.zIndex);
      el.style.setProperty("--asset-fit", element.assetFit || element.fit || "contain");
      el.style.setProperty("--asset-position-x", Number.isFinite(Number(element.assetPositionX)) ? Number(element.assetPositionX) + "%" : "50%");
      el.style.setProperty("--asset-position-y", Number.isFinite(Number(element.assetPositionY)) ? Number(element.assetPositionY) + "%" : "50%");
      el.style.setProperty("--asset-scale", Number.isFinite(Number(element.assetScale)) ? Number(element.assetScale) : 1);
      if (element.type === "text") {
        if (element.textStyle?.fontSize) el.style.fontSize = Number(element.textStyle.fontSize) + "px";
        if (element.textStyle?.fontWeight) el.style.fontWeight = String(element.textStyle.fontWeight);
        if (element.textStyle?.lineHeight) el.style.lineHeight = String(element.textStyle.lineHeight);
        if (element.textStyle?.align) el.style.textAlign = element.textStyle.align;
      }
      const src = visualAssetSrc(element);
      if (src && el.classList.contains("visual")) {
        el.innerHTML = '<img class="generated-image" src="' + escapeHtml(src) + '" alt="" draggable="false">';
      }
    }

    function createElementDom(slide, element) {
      const node = document.createElement("div");
      node.className = element.type === "text"
        ? "element text " + className(element.role || "custom-text") + " normal"
        : "element visual " + className(element.role || "user-image") + " visual-" + className(String(element.type || "visual").replace("-placeholder", ""));
      node.dataset.elementId = element.id;
      node.dataset.role = element.role || "";
      node.dataset.type = element.type || "";
      if (element.type === "text") {
        node.innerHTML = formatTextBlock(element.text);
      } else {
        const src = visualAssetSrc(element);
        node.innerHTML = src
          ? '<img class="generated-image" src="' + escapeHtml(src) + '" alt="" draggable="false">'
          : '<div class="visual-scene polished"><div>이미지 또는 도형</div></div>';
      }
      applyElementToDom(node, element);
      bindElementDom(node);
      return node;
    }

    function updateElementContent(el, element) {
      if (element.type === "text") {
        el.innerHTML = formatTextBlock(element.text);
      } else if (visualAssetSrc(element)) {
        el.innerHTML = '<img class="generated-image" src="' + escapeHtml(visualAssetSrc(element)) + '" alt="" draggable="false">';
      }
      applyElementToDom(el, element);
    }

    function syncSlideDom(slide) {
      ensureLayers(slide);
      const section = document.querySelector('.ppt-slide[data-slide-number="' + slide.number + '"]');
      if (!section) return;
      const liveIds = new Set(slide.elements.map((element) => element.id));
      section.querySelectorAll(".element").forEach((node) => {
        if (!liveIds.has(node.dataset.elementId)) node.remove();
      });
      for (const element of slide.elements) {
        let node = section.querySelector('.element[data-element-id="' + cssEscape(element.id) + '"]');
        if (!node) {
          node = createElementDom(slide, element);
          section.appendChild(node);
        } else {
          updateElementContent(node, element);
        }
      }
    }

    function saveLocal() {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }

    function setSelected(el) {
      document.querySelectorAll(".element.selected-editable").forEach((item) => item.classList.remove("selected-editable"));
      document.querySelectorAll(".resize-handle").forEach((item) => item.remove());
      selected = el;
      if (!el) {
        selectedSummary.textContent = "선택된 요소 없음";
        for (const input of Object.values(fields)) input.value = "";
        for (const input of Object.values(imageFields)) input.value = "";
        for (const input of Object.values(textFields)) input.value = "";
        promptEditor.value = "";
        return;
      }
      const { slide, element } = findStateElement(el);
      if (!element) return;
      el.classList.add("selected-editable");
      const handle = document.createElement("div");
      handle.className = "resize-handle";
      handle.dataset.resize = "se";
      el.appendChild(handle);
      selectedSummary.textContent = "Slide " + String(slide.number).padStart(2, "0") + " · " + (element.role || element.type) + " · " + element.id;
      syncGeometryFields(element);
      imageFields.fit.value = element.assetFit || element.fit || "contain";
      imageFields.x.value = Number.isFinite(Number(element.assetPositionX)) ? Number(element.assetPositionX) : 50;
      imageFields.y.value = Number.isFinite(Number(element.assetPositionY)) ? Number(element.assetPositionY) : 50;
      imageFields.scale.value = Number.isFinite(Number(element.assetScale)) ? Number(element.assetScale) : 1;
      textFields.text.value = element.type === "text" ? element.text || "" : "";
      textFields.size.value = element.textStyle?.fontSize || "";
      textFields.lineHeight.value = element.textStyle?.lineHeight || "";
      textFields.align.value = element.textStyle?.align || element.align || "left";
      textFields.weight.value = element.textStyle?.fontWeight || "";
      promptEditor.value = element.prompt?.ko || "";
    }

    function updateSelectedFromInputs() {
      if (!selected) return;
      const { element } = findStateElement(selected);
      if (!element) return;
      element.x = Number(fields.x.value);
      element.y = Number(fields.y.value);
      element.w = Number(fields.w.value);
      element.h = Number(fields.h.value);
      constrainElementBox(element);
      element.status = "user-override";
      element.userOverride = true;
      applyElementToDom(selected, element);
      syncGeometryFields(element);
      saveLocal();
    }

    for (const input of Object.values(fields)) {
      input.addEventListener("input", updateSelectedFromInputs);
    }

    function updateImageControls() {
      if (!selected) return;
      const { element } = findStateElement(selected);
      if (!element || element.type === "text") return;
      element.assetFit = imageFields.fit.value || "contain";
      element.assetPositionX = Number(imageFields.x.value || 50);
      element.assetPositionY = Number(imageFields.y.value || 50);
      element.assetScale = Number(imageFields.scale.value || 1);
      element.status = "user-override";
      element.userOverride = true;
      applyElementToDom(selected, element);
      saveLocal();
    }

    imageFields.fit.addEventListener("change", updateImageControls);
    imageFields.x.addEventListener("input", updateImageControls);
    imageFields.y.addEventListener("input", updateImageControls);
    imageFields.scale.addEventListener("input", updateImageControls);

    function updateTextControls() {
      if (!selected) return;
      const { element } = findStateElement(selected);
      if (!element || element.type !== "text") return;
      element.text = textFields.text.value;
      element.textStyle = {
        ...(element.textStyle || {}),
        fontSize: textFields.size.value ? Number(textFields.size.value) : undefined,
        lineHeight: textFields.lineHeight.value ? Number(textFields.lineHeight.value) : undefined,
        align: textFields.align.value || "left",
        fontWeight: textFields.weight.value ? Number(textFields.weight.value) : undefined,
      };
      element.status = "user-override";
      element.userOverride = true;
      updateElementContent(selected, element);
      saveLocal();
    }

    textFields.text.addEventListener("input", updateTextControls);
    textFields.size.addEventListener("change", updateTextControls);
    textFields.lineHeight.addEventListener("change", updateTextControls);
    textFields.align.addEventListener("change", updateTextControls);
    textFields.weight.addEventListener("change", updateTextControls);

    promptEditor.addEventListener("input", () => {
      if (!selected) return;
      const { element } = findStateElement(selected);
      if (!element) return;
      element.prompt = { ...(element.prompt || {}), ko: promptEditor.value, userEdited: true };
      element.status = "user-override";
      element.userOverride = true;
      saveLocal();
    });

    assetFile.addEventListener("change", () => {
      if (!assetFile.files?.[0]) return;
      const file = assetFile.files[0];
      let target = selected ? findStateElement(selected) : {};
      if (assetFile.dataset.mode === "add" || !target.element || target.element.type === "text") {
        const slide = activeSlide();
        const element = addVisualElement(slide);
        syncSlideDom(slide);
        selected = document.querySelector('.ppt-slide[data-slide-number="' + slide.number + '"] .element[data-element-id="' + cssEscape(element.id) + '"]');
        target = { slide, element };
      }
      const reader = new FileReader();
      reader.onload = () => {
        target.element.asset = {
          src: reader.result,
          name: file.name,
          source: "user-upload",
          updatedAt: new Date().toISOString(),
        };
        target.element.assetDataUrl = String(reader.result || "");
        target.element.assetFit = target.element.assetFit || "contain";
        target.element.assetPositionX = Number.isFinite(Number(target.element.assetPositionX)) ? target.element.assetPositionX : 50;
        target.element.assetPositionY = Number.isFinite(Number(target.element.assetPositionY)) ? target.element.assetPositionY : 50;
        target.element.assetScale = Number.isFinite(Number(target.element.assetScale)) ? target.element.assetScale : 1;
        target.element.status = "user-override";
        target.element.userOverride = true;
        updateElementContent(selected, target.element);
        setSelected(selected);
        saveLocal();
      };
      reader.readAsDataURL(file);
      assetFile.value = "";
      assetFile.dataset.mode = "";
    });

    function addVisualElement(slide) {
      ensureLayers(slide);
      const id = "s" + slide.number + "-user-image-" + Date.now().toString(36);
      const element = {
        id,
        type: "ai-placeholder",
        role: "user-image",
        requestType: "image",
        x: 18,
        y: 26,
        w: 48,
        h: 44,
        zIndex: Math.max(0, ...slide.elements.map((item) => Number(item.zIndex) || 0)) + 1,
        assetFit: "contain",
        assetPositionX: 50,
        assetPositionY: 50,
        assetScale: 1,
        prompt: { kind: "image", ko: "", uiLabel: "image-promptKo", userEdited: false },
        status: "user-override",
        userOverride: true,
      };
      slide.elements.push(element);
      return element;
    }

    function addTextElement() {
      const slide = activeSlide();
      ensureLayers(slide);
      const id = "s" + slide.number + "-user-text-" + Date.now().toString(36);
      const element = {
        id,
        type: "text",
        role: "custom-text",
        text: "새 텍스트",
        x: 10,
        y: 28,
        w: 34,
        h: 16,
        zIndex: Math.max(0, ...slide.elements.map((item) => Number(item.zIndex) || 0)) + 1,
        textStyle: { fontSize: 22, lineHeight: 1.34, align: "left", fontWeight: 650 },
        status: "user-override",
        userOverride: true,
      };
      slide.elements.push(element);
      syncSlideDom(slide);
      const node = document.querySelector('.ppt-slide[data-slide-number="' + slide.number + '"] .element[data-element-id="' + cssEscape(id) + '"]');
      setSelected(node);
      saveLocal();
    }

    function duplicateSelected() {
      if (!selected) return;
      const { slide, element } = findStateElement(selected);
      if (!slide || !element) return;
      ensureLayers(slide);
      const copy = JSON.parse(JSON.stringify(element));
      copy.id = "s" + slide.number + "-copy-" + Date.now().toString(36);
      copy.x = Math.min(94 - Number(copy.w || 20), Number(copy.x || 0) + 3);
      copy.y = Math.min(94 - Number(copy.h || 15), Number(copy.y || 0) + 3);
      copy.zIndex = Math.max(0, ...slide.elements.map((item) => Number(item.zIndex) || 0)) + 1;
      copy.userOverride = true;
      copy.status = "user-override";
      slide.elements.push(copy);
      syncSlideDom(slide);
      const node = document.querySelector('.ppt-slide[data-slide-number="' + slide.number + '"] .element[data-element-id="' + cssEscape(copy.id) + '"]');
      setSelected(node);
      saveLocal();
    }

    function deleteSelected() {
      if (!selected) return;
      const { slide, element } = findStateElement(selected);
      if (!slide || !element) return;
      slide.elements = slide.elements.filter((item) => item.id !== element.id);
      selected.remove();
      setSelected(null);
      saveLocal();
    }

    function moveLayer(direction) {
      if (!selected) return;
      const { slide, element } = findStateElement(selected);
      if (!slide || !element) return;
      ensureLayers(slide);
      element.zIndex = direction === "front"
        ? Math.max(...slide.elements.map((item) => Number(item.zIndex) || 0)) + 1
        : Math.min(...slide.elements.map((item) => Number(item.zIndex) || 0)) - 1;
      slide.elements.sort((a, b) => (Number(a.zIndex) || 0) - (Number(b.zIndex) || 0));
      slide.elements.forEach((item, index) => { item.zIndex = index + 1; });
      syncSlideDom(slide);
      const node = document.querySelector('.ppt-slide[data-slide-number="' + slide.number + '"] .element[data-element-id="' + cssEscape(element.id) + '"]');
      setSelected(node);
      saveLocal();
    }

    document.getElementById("addImage").addEventListener("click", () => {
      assetFile.dataset.mode = "add";
      assetFile.click();
    });
    document.getElementById("replaceImage").addEventListener("click", () => {
      assetFile.dataset.mode = "replace";
      assetFile.click();
    });
    document.getElementById("addText").addEventListener("click", addTextElement);
    document.getElementById("duplicateElement").addEventListener("click", duplicateSelected);
    document.getElementById("deleteElement").addEventListener("click", deleteSelected);
    document.getElementById("bringForward").addEventListener("click", () => moveLayer("front"));
    document.getElementById("sendBackward").addEventListener("click", () => moveLayer("back"));

    document.getElementById("clearSelection").addEventListener("click", () => setSelected(null));
    document.getElementById("importState").addEventListener("click", () => importStateFile.click());
    importStateFile.addEventListener("change", () => {
      const file = importStateFile.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const imported = JSON.parse(String(reader.result || "{}"));
        if (!Array.isArray(imported.slides)) throw new Error("Invalid storyboard state JSON");
        state.meta = imported.meta || state.meta;
        state.slides = imported.slides;
        state.slides.forEach(syncSlideDom);
        setSelected(null);
        saveLocal();
      };
      reader.readAsText(file);
      importStateFile.value = "";
    });
    document.getElementById("downloadState").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "07_storyboard-state.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    function enterInlineTextEdit(el, element) {
      if (!el || !element || element.type !== "text") return;
      el.contentEditable = "true";
      el.classList.add("editing-text");
      el.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      const onInput = () => {
        element.text = el.innerText;
        textFields.text.value = element.text;
        element.userOverride = true;
        saveLocal();
      };
      const onBlur = () => {
        el.contentEditable = "false";
        el.classList.remove("editing-text");
        el.removeEventListener("input", onInput);
        el.removeEventListener("blur", onBlur);
        updateElementContent(el, element);
      };
      el.addEventListener("input", onInput);
      el.addEventListener("blur", onBlur);
    }

    function bindElementDom(el) {
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelected(el);
      });
      el.addEventListener("dblclick", (event) => {
        const { element } = findStateElement(el);
        if (element?.type === "text") {
          event.preventDefault();
          event.stopPropagation();
          enterInlineTextEdit(el, element);
        }
      });
      el.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        const { element } = findStateElement(el);
        if (!element) return;
        setSelected(el);
        const slideRect = el.closest(".ppt-slide").getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        drag = {
          el,
          element,
          slideRect,
          mode: event.target.dataset.resize ? "resize" : "move",
          startX: event.clientX,
          startY: event.clientY,
          start: { x: element.x, y: element.y, w: element.w, h: element.h },
          rect,
        };
        el.setPointerCapture(event.pointerId);
      });
    }

    document.querySelectorAll(".ppt-slide .element").forEach(bindElementDom);

    document.querySelectorAll(".storyboard-nav-list a").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const slide = document.querySelector(link.getAttribute("href"));
        const deck = document.querySelector(".deck");
        if (!slide || !deck) return;
        const top = slide.offsetTop - Math.max(0, (deck.clientHeight - slide.offsetHeight) / 2);
        deck.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", link.getAttribute("href"));
      });
    });

    window.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      const dxPct = deltaPct(dx, drag.slideRect.width);
      const dyPct = deltaPct(dy, drag.slideRect.height);
      if (drag.mode === "move") {
        const minY = minTopForElement(drag.element);
        drag.element.x = clamp(Number(drag.start.x) + dxPct, 0, Math.max(0, 100 - Number(drag.element.w || 0)));
        drag.element.y = clamp(Number(drag.start.y) + dyPct, minY, Math.max(minY, 100 - Number(drag.element.h || 0)));
      } else {
        drag.element.w = clamp(Number(drag.start.w) + dxPct, MIN_ELEMENT_SIZE, Math.max(MIN_ELEMENT_SIZE, 100 - Number(drag.element.x || 0)));
        drag.element.h = clamp(Number(drag.start.h) + dyPct, MIN_ELEMENT_SIZE, Math.max(MIN_ELEMENT_SIZE, 100 - Number(drag.element.y || 0)));
      }
      constrainElementBox(drag.element);
      drag.element.status = "user-override";
      drag.element.userOverride = true;
      applyElementToDom(drag.el, drag.element);
      syncGeometryFields(drag.element);
    });

    window.addEventListener("pointerup", () => {
      if (!drag) return;
      saveLocal();
      drag = null;
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".ppt-slide") && !event.target.closest(".storyboard-toolbar") && !event.target.closest(".storyboard-nav")) setSelected(null);
    });
  })();
  </script>`;
}

function buildStoryboardHtml(state, sources) {
  const html = buildHtml(state, sources)
    .replace("<title>", "<title>Storyboard - ")
    .replace("<body>", "<body class=\"storyboard-mode\">")
    .replace("</style>", `
    .storyboard-mode {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #e8edf3;
    }
    .storyboard-mode .deck {
      position: fixed;
      left: 248px;
      right: 376px;
      top: 0;
      bottom: 0;
      overflow: auto;
      align-content: start;
      justify-items: center;
      gap: 28px;
      padding: 32px 28px 64px;
      scroll-behavior: smooth;
      box-sizing: border-box;
    }
    .storyboard-mode .ppt-slide {
      scroll-margin: 32px;
    }
    .storyboard-mode .element {
      outline: 2px solid transparent;
      outline-offset: 2px;
      cursor: move;
      touch-action: none;
    }
    .storyboard-mode .element:hover {
      outline-color: rgba(37, 99, 235, 0.55);
    }
    .storyboard-mode .selected-editable {
      outline-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.16);
    }
    .resize-handle {
      position: absolute;
      right: 4px;
      bottom: 4px;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: #2563eb;
      border: 2px solid #fff;
      cursor: nwse-resize;
      z-index: 30;
    }
    .storyboard-nav {
      position: fixed;
      left: 14px;
      top: 14px;
      bottom: 14px;
      width: 220px;
      z-index: 100;
      overflow: auto;
      box-sizing: border-box;
      padding: 14px;
      border: 1px solid rgba(24, 33, 47, 0.16);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 14px 36px rgba(24, 33, 47, 0.13);
      font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", Arial, sans-serif;
    }
    .storyboard-nav-title {
      color: #18212f;
      font-size: 18px;
      font-weight: 850;
      margin-bottom: 12px;
    }
    .storyboard-nav-list {
      display: grid;
      gap: 7px;
    }
    .storyboard-nav-list a {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      align-items: center;
      gap: 9px;
      min-height: 44px;
      padding: 8px;
      border: 1px solid rgba(219, 227, 238, 0.92);
      border-radius: 7px;
      color: #18212f;
      text-decoration: none;
      background: #fff;
    }
    .storyboard-nav-list a:hover {
      border-color: rgba(37, 99, 235, 0.45);
      background: #f8fbff;
    }
    .nav-number {
      display: grid;
      place-items: center;
      height: 30px;
      border-radius: 6px;
      background: #edf6f5;
      color: #0f766e;
      font-size: 13px;
      font-weight: 850;
    }
    .nav-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #394456;
      font-size: 13px;
      font-weight: 750;
      line-height: 1.25;
    }
    .storyboard-toolbar {
      position: fixed;
      top: 14px;
      right: 14px;
      bottom: 14px;
      width: 348px;
      overflow: auto;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-sizing: border-box;
      padding: 14px;
      border: 1px solid rgba(24, 33, 47, 0.16);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 14px 36px rgba(24, 33, 47, 0.13);
      font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", Arial, sans-serif;
    }
    .storyboard-title {
      font-size: 20px;
      font-weight: 850;
      color: #18212f;
    }
    .storyboard-hint,
    .selected-summary {
      color: #5b6678;
      font-size: 14px;
      line-height: 1.35;
    }
    .selected-summary {
      color: #0f766e;
      font-weight: 750;
      padding: 9px 10px;
      border-radius: 7px;
      background: #edf6f5;
    }
    .control-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .text-controls {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .text-controls .wide-control:first-child {
      grid-column: 1 / -1;
    }
    .control-grid label,
    .wide-control {
      display: grid;
      gap: 4px;
      font-size: 12px;
      color: #5b6678;
      font-weight: 750;
    }
    .control-grid input,
    .control-grid select,
    .wide-control input,
    .wide-control select,
    .wide-control textarea {
      width: 100%;
      border: 1px solid #dbe3ee;
      border-radius: 6px;
      padding: 7px 8px;
      font: inherit;
      color: #18212f;
      background: #fff;
    }
    .wide-control textarea {
      resize: vertical;
      min-height: 82px;
      max-height: 160px;
      font-size: 12px;
      line-height: 1.3;
    }
    .toolbar-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .toolbar-actions button {
      border: 0;
      border-radius: 6px;
      background: #18212f;
      color: #fff;
      min-height: 38px;
      padding: 9px 10px;
      font-weight: 800;
      cursor: pointer;
      line-height: 1.15;
    }
    .toolbar-actions button + button {
      background: #5b6678;
    }
    .toolbar-actions #deleteElement {
      background: #dc2626;
    }
    .storyboard-mode .editing-text {
      cursor: text;
      user-select: text;
      background: rgba(255, 255, 255, 0.88);
    }
    @media (max-width: 1540px) {
      .storyboard-nav {
        width: 200px;
      }
      .storyboard-mode .deck {
        left: 222px;
        right: 338px;
      }
      .storyboard-toolbar {
        width: 306px;
      }
      .toolbar-actions {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 1180px) {
      .storyboard-mode {
        height: auto;
        min-height: 100vh;
        overflow: auto;
      }
      .storyboard-nav,
      .storyboard-toolbar {
        position: static;
        width: auto;
        margin: 12px;
      }
      .storyboard-mode .deck {
        position: static;
        overflow: visible;
        padding: 12px;
      }
    }
    </style>`)
    .replace("</body>", () => `${storyboardControlsHtml(state)}\n</body>`);
  return html;
}

const state = JSON.parse(readText(statePath));
const sources = {
  projectName,
  productionId: state.meta?.production || "",
  controller: readText(sourcePaths.controller),
  properties: readText(sourcePaths.properties),
  bootRun: readText(sourcePaths.bootRun),
  response: readText(sourcePaths.response),
};

if (!Array.isArray(state.slides) || state.slides.length === 0) {
  throw new Error(`No slides found in ${statePath}`);
}

const { state: previewState } = reflowStateForPreview(state);

fs.writeFileSync(statePath, `${JSON.stringify(previewState, null, 2)}\n`, "utf8");
fs.writeFileSync(outputPath, buildHtml(previewState, sources), "utf8");
fs.writeFileSync(storyboardOutputPath, buildStoryboardHtml(previewState, sources), "utf8");
console.log(`Wrote ${statePath}`);
console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${storyboardOutputPath}`);
console.log(`Slides: ${state.slides.length}`);
