// Generates site/sitemap.xml from the same LANGS/PAGES source of truth as
// build.mjs, so adding a language or page can never leave the sitemap out
// of sync with what actually gets deployed.
//
// Run: node site/i18n/build-sitemap.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { LANGS, PAGES } from "./langs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = join(__dirname, "..");

const BASE_URL = "https://janisaarinen.com";
const LASTMOD = new Date().toISOString().slice(0, 10);

// hreflang wants IETF language tags, not always identical to our internal
// `code` (e.g. bare "zh" is ambiguous — the translation is Simplified).
const HREFLANG = { en: "en", zh: "zh-Hans", ko: "ko", ja: "ja", pt: "pt", es: "es", fr: "fr" };

const PAGE_META = {
  "index.html": { changefreq: "monthly", priority: "1.0" },
  "listing_01.html": { changefreq: "monthly", priority: "0.8" },
  "listing_21.html": { changefreq: "monthly", priority: "0.8" },
};

function urlFor(lang, pageFilename) {
  const path = lang.dir ? `${lang.dir}/${pageFilename}` : pageFilename;
  return `${BASE_URL}/${path}`;
}

function main() {
  const urlEntries = PAGES.map((pageFilename) => {
    const meta = PAGE_META[pageFilename];
    const alternates = LANGS.map(
      (l) => `      <xhtml:link rel="alternate" hreflang="${HREFLANG[l.code]}" href="${urlFor(l, pageFilename)}" />`
    ).join("\n");
    const xDefault = `      <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(LANGS[0], pageFilename)}" />`;

    return LANGS.map((lang) => {
      return [
        "  <url>",
        `    <loc>${urlFor(lang, pageFilename)}</loc>`,
        `    <lastmod>${LASTMOD}</lastmod>`,
        `    <changefreq>${meta.changefreq}</changefreq>`,
        `    <priority>${meta.priority}</priority>`,
        alternates,
        xDefault,
        "  </url>",
      ].join("\n");
    }).join("\n");
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>
`;

  writeFileSync(join(SITE_ROOT, "sitemap.xml"), xml, "utf8");
  console.log(`[sitemap] wrote sitemap.xml (${LANGS.length * PAGES.length} URLs)`);
}

main();
