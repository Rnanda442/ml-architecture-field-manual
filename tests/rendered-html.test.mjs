import assert from "node:assert/strict";
import test from "node:test";

const publicManualDescription =
  /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*seven flagship ML architecture cases and six complete supplement lessons)[^>]*>/i;

test("renders compact public presentation shell", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
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

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, publicManualDescription);
  assert.match(html, /Architecture follows the bottleneck/i);
  assert.match(html, /13 complete architecture lessons/i);
  assert.match(html, /Presentation mode/i);
  assert.doesNotMatch(html, /LIBRARY ONLY|OVERLAPPING|PARTIAL/);
  assert.doesNotMatch(html, /Architecture registry|backlog statistics/i);
});
