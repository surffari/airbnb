// Dependency-free static-site generator: renders {{token}} templates in
// site/i18n/templates/*.html against per-language string tables in
// site/i18n/strings/*.json, writing output to site/ (English, at the
// account root) or site/<lang>/ (every other language).
//
// Run: node site/i18n/build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { LANGS, PAGES } from "./langs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = join(__dirname, "..");
const STRINGS_DIR = join(__dirname, "strings");
const TEMPLATES_DIR = join(__dirname, "templates");

const enStrings = JSON.parse(readFileSync(join(STRINGS_DIR, "en.json"), "utf8"));

function deepGet(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function buildSwitcher(currentLangCode, pageFilename) {
  const base = currentLangCode === "en" ? "" : "../";
  const options = LANGS.map((l) => {
    const href = l.code === "en" ? base + pageFilename : base + l.dir + "/" + pageFilename;
    const selected = l.code === currentLangCode ? " selected" : "";
    return `<option value="${href}"${selected}>${l.label}</option>`;
  }).join("");
  return `<div class="lang-switcher"><label class="lang-switcher__icon" for="lang-select" aria-hidden="true">🌐</label><select id="lang-select" class="lang-switcher__select" data-lang-switcher aria-label="Language">${options}</select></div>`;
}

function render(templateSrc, strings, ctx) {
  return templateSrc.replace(/\{\{([\w.]+)\}\}/g, (match, key) => {
    if (key === "ASSET_PREFIX") return ctx.assetPrefix;
    if (key === "HTML_LANG") return ctx.langCode;
    if (key === "LANG_SWITCHER") return ctx.switcherHtml;
    let value = deepGet(strings, key);
    if (value === undefined) {
      value = deepGet(enStrings, key);
      if (value === undefined) {
        throw new Error(`Missing key "${key}" in both ${ctx.langCode}.json and en.json (page: ${ctx.pageFilename})`);
      }
      console.warn(`[i18n] "${key}" missing in ${ctx.langCode}.json — falling back to English (page: ${ctx.pageFilename})`);
    }
    return value;
  });
}

function main() {
  const availableLangFiles = new Set(readdirSync(STRINGS_DIR).map((f) => f.replace(/\.json$/, "")));

  for (const lang of LANGS) {
    if (!availableLangFiles.has(lang.code)) {
      console.warn(`[i18n] skipping "${lang.code}" — no site/i18n/strings/${lang.code}.json yet`);
      continue;
    }
    const strings = lang.code === "en" ? enStrings : JSON.parse(readFileSync(join(STRINGS_DIR, `${lang.code}.json`), "utf8"));
    const outDir = lang.dir ? join(SITE_ROOT, lang.dir) : SITE_ROOT;
    mkdirSync(outDir, { recursive: true });

    for (const pageFilename of PAGES) {
      const templateSrc = readFileSync(join(TEMPLATES_DIR, pageFilename), "utf8");
      const ctx = {
        langCode: lang.code,
        pageFilename,
        assetPrefix: lang.dir ? "../" : "",
        switcherHtml: buildSwitcher(lang.code, pageFilename),
      };
      const output = render(templateSrc, strings, ctx);
      writeFileSync(join(outDir, pageFilename), output, "utf8");
      console.log(`[i18n] wrote ${join(lang.dir || ".", pageFilename)}`);
    }
  }
}

main();
