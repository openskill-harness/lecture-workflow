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

const targetArg = process.argv[2];
if (!targetArg) {
  console.error("Error: preview path or URL is required as the first argument.");
  console.error("Example: node .claude/skills/lecture-storyboard-preview/scripts/audit_ppt_preview_layout.mjs outputs/springboot/03_ch01/09_ppt-preview.html");
  process.exit(1);
}
const target = /^https?:\/\//.test(targetArg) ? targetArg : pathToFileURL(path.resolve(targetArg)).href;

if (!/^https?:\/\//.test(targetArg) && !fs.existsSync(path.resolve(targetArg))) {
  console.error(`Error: preview file not found: ${targetArg}`);
  process.exit(1);
}

const requireFromBundledDeps = createRequire(findPlaywrightPackageJson());
const { chromium } = requireFromBundledDeps("playwright");

function findSystemBrowser() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? findSystemBrowser();
const browser = await chromium.launch({
  headless: true,
  executablePath,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(target, { waitUntil: "load" });

const audit = await page.evaluate(() => {
  const slides = [...document.querySelectorAll(".ppt-slide")];
  const allowedFontSizes = [14, 16, 18, 20, 22, 24, 28, 34, 36, 42];
  const allowedBodyFontSizes = [20, 22];
  const allowedBodyLineHeightRatios = [1.28, 1.34, 1.45];
  const slideBodyFontSpreadMax = 2.1;
  const bodyGapMin = 8;
  const bodyFontSizes = [];
  const allFontSizes = [];
  const bodyLineHeightRatios = [];
  const bodyGaps = [];
  const result = {
    url: location.href,
    slideCount: slides.length,
    generatedImageCount: document.querySelectorAll("img.generated-image").length,
    brokenImages: [],
    textOverflows: [],
    typographyIssues: [],
    fontScale: {
      allowedFontSizes,
      sampleCount: 0,
      uniqueSizes: [],
    },
    bodyTypography: {
      allowedFontSizes: allowedBodyFontSizes,
      allowedLineHeightRatios: allowedBodyLineHeightRatios,
      minGap: bodyGapMin,
      sampleCount: 0,
      uniqueSizes: [],
      lineHeightRatios: [],
      gaps: [],
    },
    overlaps: [],
    outOfBounds: [],
  };

  function roundedSize(value) {
    return Math.round(Number(value) * 10) / 10;
  }

  function roundedRatio(value) {
    return Math.round(Number(value) * 100) / 100;
  }

  function isAllowedToken(value, tokens, tolerance = 0.15) {
    return tokens.some((token) => Math.abs(Number(value) - Number(token)) <= tolerance);
  }

  function visibleBodyFontSize(el) {
    const leafSpans = [...el.querySelectorAll(".formatted span")]
      .filter((span) => span.innerText.trim() && !span.closest("code"));
    const sizes = leafSpans.map((span) => roundedSize(parseFloat(getComputedStyle(span).fontSize))).filter(Number.isFinite);
    if (!sizes.length) return roundedSize(parseFloat(getComputedStyle(el).fontSize));
    sizes.sort((a, b) => a - b);
    return sizes[Math.floor(sizes.length / 2)];
  }

  function hasDirectVisibleText(el) {
    return [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  }

  function selectorFor(el) {
    const className = [...el.classList].join(".");
    return `${el.tagName.toLowerCase()}${className ? `.${className}` : ""}`;
  }

  for (const el of document.querySelectorAll(".ppt-slide *")) {
    if (!hasDirectVisibleText(el)) continue;
    const fontSize = roundedSize(parseFloat(getComputedStyle(el).fontSize));
    if (!Number.isFinite(fontSize)) continue;
    allFontSizes.push(fontSize);
    if (!isAllowedToken(fontSize, allowedFontSizes)) {
      result.typographyIssues.push({
        type: "font-size-not-in-token-scale",
        slide: el.closest(".ppt-slide")?.getAttribute("data-slide-number") ?? null,
        selector: selectorFor(el),
        text: el.textContent.trim().slice(0, 90),
        fontSize,
        allowed: allowedFontSizes,
      });
    }
  }

  for (const img of document.querySelectorAll("img.generated-image")) {
    if (!img.complete || img.naturalWidth === 0) result.brokenImages.push(img.getAttribute("src"));
  }

  for (const slide of slides) {
    const slideNo = slide.getAttribute("data-slide-number");
    const sr = slide.getBoundingClientRect();
    const slideBodySizes = [];
    const elements = [...slide.querySelectorAll(".element")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el,
        r,
        id: [...el.classList].join(" "),
        text: el.innerText?.trim().slice(0, 90) || el.querySelector("img")?.getAttribute("src") || "",
      };
    });

    for (const item of elements) {
      const { el, r } = item;
      if (r.left < sr.left - 1 || r.top < sr.top - 1 || r.right > sr.right + 1 || r.bottom > sr.bottom + 1) {
        result.outOfBounds.push({
          slide: slideNo,
          id: item.id,
          text: item.text,
          rect: {
            left: Math.round(r.left - sr.left),
            top: Math.round(r.top - sr.top),
            right: Math.round(r.right - sr.left),
            bottom: Math.round(r.bottom - sr.top),
          },
        });
      }

      if (el.classList.contains("text")) {
        if (el.classList.contains("screen-text") || el.classList.contains("custom-text")) {
          const fontSize = visibleBodyFontSize(el);
          slideBodySizes.push(fontSize);
          bodyFontSizes.push(fontSize);
          if (!isAllowedToken(fontSize, allowedBodyFontSizes)) {
            result.typographyIssues.push({
              type: "body-font-size-not-in-token-scale",
              slide: slideNo,
              id: item.id,
              text: item.text,
              fontSize,
              allowed: allowedBodyFontSizes,
            });
          }

          const formatted = el.querySelector(".formatted");
          if (formatted) {
            const formattedStyle = getComputedStyle(formatted);
            const lineHeight = roundedSize(parseFloat(formattedStyle.lineHeight));
            const ratio = roundedRatio(lineHeight / fontSize);
            bodyLineHeightRatios.push(ratio);
            if (!isAllowedToken(ratio, allowedBodyLineHeightRatios, 0.02) || ratio < 1.28) {
              result.typographyIssues.push({
                type: "body-line-height-not-in-token-scale",
                slide: slideNo,
                id: item.id,
                text: item.text,
                fontSize,
                lineHeight,
                ratio,
                allowed: allowedBodyLineHeightRatios,
              });
            }

            if (formattedStyle.display.includes("flex")) {
              const gap = roundedSize(parseFloat(formattedStyle.rowGap || formattedStyle.gap || "0"));
              bodyGaps.push(gap);
              if (!Number.isFinite(gap) || gap < bodyGapMin) {
                result.typographyIssues.push({
                  type: "body-line-gap-too-tight",
                  slide: slideNo,
                  id: item.id,
                  text: item.text,
                  gap,
                  minGap: bodyGapMin,
                });
              }
            }
          }
        }

        const overflowY = el.scrollHeight - el.clientHeight;
        const overflowX = el.scrollWidth - el.clientWidth;
        if (overflowY > 2 || overflowX > 2) {
          result.textOverflows.push({
            slide: slideNo,
            id: item.id,
            text: item.text,
            overflowY,
            overflowX,
            client: { w: el.clientWidth, h: el.clientHeight },
            scroll: { w: el.scrollWidth, h: el.scrollHeight },
          });
        }
      }
    }

    if (slideBodySizes.length > 1) {
      const min = Math.min(...slideBodySizes);
      const max = Math.max(...slideBodySizes);
      if (max - min > slideBodyFontSpreadMax) {
        result.typographyIssues.push({
          type: "same-slide-body-font-size-spread",
          slide: slideNo,
          min,
          max,
          spread: roundedSize(max - min),
          allowedSpread: slideBodyFontSpreadMax,
        });
      }
    }

    for (let i = 0; i < elements.length; i += 1) {
      for (let j = i + 1; j < elements.length; j += 1) {
        const a = elements[i];
        const b = elements[j];
        const ix = Math.max(0, Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left));
        const iy = Math.max(0, Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top));
        if (ix * iy > 80) {
          result.overlaps.push({
            slide: slideNo,
            a: a.id,
            b: b.id,
            area: Math.round(ix * iy),
            aText: a.text,
            bText: b.text,
          });
        }
      }
    }
  }

  if (bodyFontSizes.length) {
    result.bodyTypography = {
      allowedFontSizes: allowedBodyFontSizes,
      allowedLineHeightRatios: allowedBodyLineHeightRatios,
      minGap: bodyGapMin,
      sampleCount: bodyFontSizes.length,
      uniqueSizes: [...new Set(bodyFontSizes)].sort((a, b) => a - b),
      lineHeightRatios: [...new Set(bodyLineHeightRatios)].sort((a, b) => a - b),
      gaps: [...new Set(bodyGaps)].sort((a, b) => a - b),
    };
  }

  if (allFontSizes.length) {
    result.fontScale = {
      allowedFontSizes,
      sampleCount: allFontSizes.length,
      uniqueSizes: [...new Set(allFontSizes)].sort((a, b) => a - b),
    };
  }

  return result;
});

await browser.close();

console.log(JSON.stringify(audit, null, 2));

if (
  audit.slideCount === 0 ||
  audit.brokenImages.length ||
  audit.textOverflows.length ||
  audit.typographyIssues.length ||
  audit.overlaps.length ||
  audit.outOfBounds.length
) {
  process.exitCode = 1;
}
