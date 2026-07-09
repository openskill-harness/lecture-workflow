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

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    args[key.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (typeof args.input !== "string" || !args.input) {
  console.error("Error: --input is required.");
  console.error("Example: node .claude/skills/lecture-storyboard-preview/scripts/render_ppt_preview_slides.mjs --input outputs/springboot/03_ch01/09_ppt-preview.html");
  process.exit(1);
}
const input = path.resolve(args.input);
const outDir = path.resolve(args.outDir || path.join(path.dirname(input), "_workspace", "preview-slides"));
if (!fs.existsSync(input)) {
  console.error(`Error: preview file not found: ${input}`);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const requireFromBundledDeps = createRequire(findPlaywrightPackageJson());
const { chromium } = requireFromBundledDeps("playwright");
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? findSystemBrowser();

const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(input).href, { waitUntil: "load" });

const slides = await page.$$(".ppt-slide");
for (let index = 0; index < slides.length; index += 1) {
  const fileName = `slide-${String(index + 1).padStart(2, "0")}.png`;
  await slides[index].screenshot({ path: path.join(outDir, fileName) });
}

await browser.close();
console.log(JSON.stringify({ input, outDir, slides: slides.length }, null, 2));
