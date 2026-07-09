import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const bundledNodeModules = path.join(
  process.env.USERPROFILE ?? "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "node_modules",
);

function findPlaywrightPackageJson() {
  const direct = path.join(bundledNodeModules, "playwright", "package.json");
  if (fs.existsSync(direct)) {
    const pnpmDir = path.join(bundledNodeModules, ".pnpm");
    if (fs.existsSync(pnpmDir)) {
      const candidate = fs
        .readdirSync(pnpmDir)
        .filter((name) => name.startsWith("playwright@"))
        .map((name) => path.join(pnpmDir, name, "node_modules", "playwright", "package.json"))
        .find((filePath) => fs.existsSync(filePath));
      if (candidate) return candidate;
    }
    return direct;
  }
  throw new Error(`Bundled playwright package not found under ${bundledNodeModules}`);
}

function findSystemBrowser() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const targetArg = process.argv[2];
if (!targetArg) {
  console.error("Error: storyboard path or URL is required as the first argument.");
  console.error("Example: node .claude/skills/lecture-storyboard-preview/scripts/smoke_storyboard_editor.mjs outputs/springboot/03_ch01/07_storyboard.html");
  process.exit(1);
}
const target = /^https?:\/\//.test(targetArg) ? targetArg : pathToFileURL(path.resolve(targetArg)).href;

if (!/^https?:\/\//.test(targetArg) && !fs.existsSync(path.resolve(targetArg))) {
  console.error(`Error: storyboard file not found: ${targetArg}`);
  process.exit(1);
}

const requireFromBundledDeps = createRequire(findPlaywrightPackageJson());
const { chromium } = requireFromBundledDeps("playwright");

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? findSystemBrowser(),
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") pageErrors.push(message.text());
});

try {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto(target, { waitUntil: "load" });
  await page.waitForSelector(".storyboard-nav");
  await page.waitForSelector(".storyboard-toolbar");
  await page.waitForSelector(".ppt-slide");

  const slideCount = await page.$$eval(".ppt-slide", (slides) => slides.length);
  assert(slideCount === 27, `Expected 27 slides, found ${slideCount}`);

  await page.click('.storyboard-nav-list a[data-nav-slide="13"]');
  await page.waitForTimeout(900);
  const slide13State = await page.$eval("#slide-13", (slide) => {
    const deck = document.querySelector(".deck");
    const rect = slide.getBoundingClientRect();
    return {
      visible: rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth,
      rect: {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      },
      deck: deck
        ? {
            scrollTop: Math.round(deck.scrollTop),
            clientHeight: deck.clientHeight,
            scrollHeight: deck.scrollHeight,
          }
        : null,
      hash: location.hash,
    };
  });
  assert(slide13State.visible, `Slide 13 did not scroll into view from navigator: ${JSON.stringify(slide13State)}`);

  await page.click('[data-element-id="s13-visual-1"]');
  const selectedSummary = await page.$eval("#selectedSummary", (node) => node.textContent || "");
  assert(selectedSummary.includes("s13-visual-1"), "Selecting slide 13 visual did not update the summary.");

  const initialFit = await page.$eval("#assetFit", (select) => select.value);
  assert(initialFit === "contain", `Expected initial fit contain, found ${initialFit}`);
  await page.selectOption("#assetFit", "cover");
  await page.waitForTimeout(50);
  const coverFit = await page.$eval('[data-element-id="s13-visual-1"]', (node) =>
    getComputedStyle(node).getPropertyValue("--asset-fit").trim(),
  );
  assert(coverFit === "cover", `Expected selected visual fit to update to cover, found ${coverFit}`);
  await page.selectOption("#assetFit", "contain");

  const visualBoxBeforeUpMove = await page.$eval('[data-element-id="s13-visual-1"]', (node) => {
    const rect = node.getBoundingClientRect();
    return {
      stateX: Number(document.getElementById("editX").value),
      stateY: Number(document.getElementById("editY").value),
      stateW: Number(document.getElementById("editW").value),
      stateH: Number(document.getElementById("editH").value),
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      right: rect.right,
      bottom: rect.bottom,
    };
  });
  await page.mouse.move(visualBoxBeforeUpMove.centerX, visualBoxBeforeUpMove.centerY);
  await page.mouse.down();
  await page.mouse.move(visualBoxBeforeUpMove.centerX, visualBoxBeforeUpMove.centerY - 260, { steps: 10 });
  await page.mouse.up();
  const movedUpY = await page.$eval("#editY", (input) => Number(input.value));
  assert(
    movedUpY < 18 && movedUpY >= 0,
    `Dragging right-side visual upward should enter upper whitespace without leaving the slide. Before ${visualBoxBeforeUpMove.stateY}, after ${movedUpY}`,
  );

  await page.fill("#editX", "43");
  await page.fill("#editY", "23");
  await page.fill("#editW", "51");
  await page.fill("#editH", "60");
  await page.waitForTimeout(80);

  const visualBoxBeforeMove = await page.$eval('[data-element-id="s13-visual-1"]', (node) => {
    const rect = node.getBoundingClientRect();
    return {
      stateX: Number(document.getElementById("editX").value),
      stateY: Number(document.getElementById("editY").value),
      stateW: Number(document.getElementById("editW").value),
      stateH: Number(document.getElementById("editH").value),
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      right: rect.right,
      bottom: rect.bottom,
    };
  });
  await page.mouse.move(visualBoxBeforeMove.centerX, visualBoxBeforeMove.centerY);
  await page.mouse.down();
  await page.mouse.move(visualBoxBeforeMove.centerX - 180, visualBoxBeforeMove.centerY, { steps: 8 });
  await page.mouse.up();
  const movedLeftX = await page.$eval("#editX", (input) => Number(input.value));
  assert(
    movedLeftX < visualBoxBeforeMove.stateX - 4,
    `Dragging visual left should decrease x. Before ${visualBoxBeforeMove.stateX}, after ${movedLeftX}`,
  );

  await page.click('[data-element-id="s13-screen"]');
  const screenTextBeforeMove = await page.$eval('[data-element-id="s13-screen"]', (node) => {
    const rect = node.getBoundingClientRect();
    return {
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  });
  await page.mouse.move(screenTextBeforeMove.centerX, screenTextBeforeMove.centerY);
  await page.mouse.down();
  await page.mouse.move(screenTextBeforeMove.centerX, screenTextBeforeMove.centerY - 420, { steps: 10 });
  await page.mouse.up();
  const guardedTextY = await page.$eval("#editY", (input) => Number(input.value));
  assert(guardedTextY >= 18, `Dragging non-title text upward should stop below title zone. y=${guardedTextY}`);

  await page.click('[data-element-id="s13-visual-1"]');

  const visualBoxBeforeResize = await page.$eval('[data-element-id="s13-visual-1"]', (node) => {
    return {
      stateW: Number(document.getElementById("editW").value),
      stateH: Number(document.getElementById("editH").value),
    };
  });
  const resizeHandle = await page.$eval(".selected-editable .resize-handle", (node) => {
    const rect = node.getBoundingClientRect();
    return {
      centerX: (rect.left + rect.right) / 2,
      centerY: (rect.top + rect.bottom) / 2,
    };
  });
  await page.mouse.move(resizeHandle.centerX, resizeHandle.centerY);
  await page.mouse.down();
  await page.mouse.move(resizeHandle.centerX - 180, resizeHandle.centerY - 120, { steps: 8 });
  await page.mouse.up();
  const visualBoxAfterResize = await page.$eval('[data-element-id="s13-visual-1"]', () => ({
    stateW: Number(document.getElementById("editW").value),
    stateH: Number(document.getElementById("editH").value),
  }));
  assert(
    visualBoxAfterResize.stateW < visualBoxBeforeResize.stateW - 4 &&
      visualBoxAfterResize.stateH < visualBoxBeforeResize.stateH - 4,
    `Resizing visual smaller should decrease w/h. Before ${visualBoxBeforeResize.stateW}x${visualBoxBeforeResize.stateH}, after ${visualBoxAfterResize.stateW}x${visualBoxAfterResize.stateH}`,
  );

  const beforeCount = await page.$$eval("#slide-13 .element", (elements) => elements.length);
  await page.click("#addText");
  await page.waitForTimeout(80);
  const afterAddCount = await page.$$eval("#slide-13 .element", (elements) => elements.length);
  assert(afterAddCount === beforeCount + 1, "Text add button did not add an element to the active slide.");

  await page.fill("#textEditor", "테스트 텍스트");
  await page.waitForTimeout(80);
  const selectedText = await page.$eval(".selected-editable", (node) => node.textContent || "");
  assert(selectedText.includes("테스트 텍스트"), "Text editor did not update selected text element.");

  await page.click("#duplicateElement");
  await page.waitForTimeout(80);
  const afterDuplicateCount = await page.$$eval("#slide-13 .element", (elements) => elements.length);
  assert(afterDuplicateCount === beforeCount + 2, "Duplicate button did not duplicate the selected element.");

  await page.click("#deleteElement");
  await page.waitForTimeout(80);
  const afterDeleteCount = await page.$$eval("#slide-13 .element", (elements) => elements.length);
  assert(afterDeleteCount === beforeCount + 1, "Delete button did not remove the selected duplicate.");

  assert(pageErrors.length === 0, `Browser errors: ${pageErrors.join(" | ")}`);

  console.log(
    JSON.stringify(
      {
        target,
        slideCount,
        slide13Visible: slide13State.visible,
        selectedVisualFit: "contain",
        addText: "ok",
        duplicate: "ok",
        delete: "ok",
        pageErrors,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
