import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>Flash — AI × 3D Developer \| Lolihost<\/title>/i);
  assert.match(html, /Flash 的个人作品集，专注 AI、3D 与开发工具。/);
  assert.match(html, /class="vue-root"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the portfolio sections and static links in source", async () => {
  const [css, page, layout, portfolio, packageJson, friends] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/vue-portfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../content/friends.json", import.meta.url), "utf8"),
  ]);

  assert.match(portfolio, /const latestUpdates = \[/);
  assert.match(portfolio, /友链、更新与其他。/);
  assert.match(portfolio, /\["首页", "项目", "技术栈", "联系", "更多"\]/);
  assert.match(portfolio, /from "\.\.\/content\/friends\.json"/);
  assert.match(portfolio, /flash-portfolio\/edit\/master\/content\/friends\.json/);
  assert.match(css, /\.more-grid/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(page, /export const metadata:\s*Metadata/);
  assert.match(page, /<VuePortfolio \/>/);
  assert.match(layout, /Flash — AI × 3D Developer/);
  assert.ok(Array.isArray(JSON.parse(friends)));
  assert.match(packageJson, /"build:pages"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("app/_sites-preview/SkeletonPreview.tsx", templateRoot)),
  );
});
