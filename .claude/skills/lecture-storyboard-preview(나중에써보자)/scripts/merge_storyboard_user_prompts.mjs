import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) continue;
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      args[key.slice(2)] = true;
    } else {
      args[key.slice(2)] = value;
      i += 1;
    }
  }
  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function scriptJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function promptCandidates(slide) {
  const candidates = [];
  const seen = new Set();

  function add({ elementIndex, kind, ko, uiLabel, updatedAt, source }) {
    if (!kind || !ko) return;
    const key = `${kind}\u0000${ko}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({
      elementIndex,
      kind,
      ko,
      uiLabel: uiLabel || `${kind}-promptKo`,
      updatedAt: updatedAt || "",
      source,
    });
  }

  for (const [elementIndex, element] of (slide.elements || []).entries()) {
    const prompt = element.prompt || {};
    if (prompt.userEdited) {
      add({
        elementIndex,
        kind: prompt.kind,
        ko: prompt.ko,
        uiLabel: prompt.uiLabel,
        updatedAt: prompt.updatedAt || "",
        source: "prompt.userEdited",
      });
    }

    for (const [kind, draft] of Object.entries(element.promptDrafts || {})) {
      if (!draft || !draft.ko || !draft.updatedAt) continue;
      add({
        elementIndex,
        kind,
        ko: draft.ko,
        uiLabel: draft.uiLabel,
        updatedAt: draft.updatedAt,
        source: "promptDrafts",
      });
    }
  }

  candidates.sort((a, b) => {
    const left = Date.parse(a.updatedAt || "") || 0;
    const right = Date.parse(b.updatedAt || "") || 0;
    return right - left;
  });

  return candidates;
}

function mergePromptIntoElement(element, candidate, migratedAt) {
  element.prompt = {
    ...(element.prompt || {}),
    kind: candidate.kind,
    ko: candidate.ko,
    uiLabel: candidate.uiLabel,
    userEdited: true,
    migratedAt,
  };
  element.promptDrafts = {
    ...(element.promptDrafts || {}),
    [candidate.kind]: {
      ko: candidate.ko,
      uiLabel: candidate.uiLabel,
      updatedAt: candidate.updatedAt || migratedAt,
      migratedAt,
    },
  };
  element.status = "user-override";
}

function mergeUserPrompts(baseState, savedState, finalPaths) {
  const migratedAt = new Date().toISOString();
  const report = [];

  for (const baseSlide of baseState.slides || []) {
    const savedSlide = (savedState.slides || []).find((slide) => slide.number === baseSlide.number);
    if (!savedSlide) continue;

    const candidates = promptCandidates(savedSlide);
    if (!candidates.length) continue;

    const used = new Set();
    for (const element of baseSlide.elements || []) {
      if (!element.prompt?.kind) continue;
      const match = candidates.find((candidate, index) => candidate.kind === element.prompt.kind && !used.has(index));
      if (!match) continue;
      const index = candidates.indexOf(match);
      used.add(index);
      mergePromptIntoElement(element, match, migratedAt);
      report.push({
        slide: baseSlide.number,
        title: baseSlide.title,
        elementKind: element.prompt.kind,
        fromElement: match.elementIndex,
        action: "active-prompt",
      });
    }

    const carriedArchive = (savedSlide.userPromptArchive || []).map((item) => ({
      ...item,
      carriedAt: migratedAt,
    }));

    const archived = candidates
      .filter((_, index) => !used.has(index))
      .map((candidate) => ({
        kind: candidate.kind,
        ko: candidate.ko,
        uiLabel: candidate.uiLabel,
        updatedAt: candidate.updatedAt,
        source: candidate.source,
        fromElement: candidate.elementIndex,
        archivedAt: migratedAt,
      }));

    const combinedArchive = [...(baseSlide.userPromptArchive || []), ...carriedArchive, ...archived];
    if (combinedArchive.length) {
      const seen = new Set();
      baseSlide.userPromptArchive = combinedArchive.filter((item) => {
        const key = `${item.kind}\u0000${item.ko}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      report.push({
        slide: baseSlide.number,
        title: baseSlide.title,
        archivedPrompts: baseSlide.userPromptArchive.map((item) => ({ kind: item.kind, fromElement: item.fromElement })),
        action: "archived-extra-prompts",
      });
    }
  }

  baseState.meta = {
    ...(baseState.meta || {}),
    generatedAt: migratedAt,
    userPromptMerge: {
      mergedAt: migratedAt,
      savedState: finalPaths.savedState,
      policy: "preserve user-edited prompt drafts by slide number and prompt kind",
      migratedCount: report.filter((item) => item.action === "active-prompt").length,
      archivedCount: report.filter((item) => item.action === "archived-extra-prompts").length,
    },
    outputFiles: {
      ...((baseState.meta || {}).outputFiles || {}),
      storyboard: finalPaths.storyboard,
      state: finalPaths.state,
      assetsDir: finalPaths.assetsDir,
    },
  };

  return { state: baseState, report };
}

function writeHtmlWithState({ inputHtml, outputHtml, state }) {
  const html = fs.readFileSync(inputHtml, "utf8");
  const next = html.replace(
    /(<script\b(?=[^>]*\bid="initial-state")(?=[^>]*\btype="application\/json")[^>]*>)([\s\S]*?)(<\/script>)/,
    `$1${scriptJson(state)}$3`,
  );
  if (next === html) {
    throw new Error("Could not find initial-state script tag in storyboard HTML.");
  }
  fs.mkdirSync(path.dirname(outputHtml), { recursive: true });
  fs.writeFileSync(outputHtml, next, "utf8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const required = ["baseState", "savedState", "baseHtml", "outState", "outHtml", "assetsDir"];
  for (const key of required) {
    if (!args[key]) throw new Error(`Missing --${key}`);
  }

  const baseState = readJson(args.baseState);
  const savedState = readJson(args.savedState);
  const { state, report } = mergeUserPrompts(baseState, savedState, {
    storyboard: args.outHtml,
    state: args.outState,
    assetsDir: args.assetsDir,
    savedState: args.savedState,
  });

  writeJson(args.outState, state);
  writeHtmlWithState({ inputHtml: args.baseHtml, outputHtml: args.outHtml, state });
  if (args.report) writeJson(args.report, report);

  console.log(`Merged user prompts: ${report.filter((item) => item.action === "active-prompt").length}`);
  console.log(`Archived extra prompts: ${report.filter((item) => item.action === "archived-extra-prompts").length}`);
  console.log(`Wrote ${args.outHtml}`);
  console.log(`Wrote ${args.outState}`);
}

main();
