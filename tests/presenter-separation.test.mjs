import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("keeps presenter scripts out of the audience application", async () => {
  const files = await readdir(new URL("../app/components/", import.meta.url));
  for (const file of files.filter((name) => name.endsWith(".tsx"))) {
    const source = await readFile(new URL(`../app/components/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /data\/scripts|PresenterScript|Open Presenter View|speaker notes|Copy Script/);
  }

  const privateScript = await readFile(new URL("../presenter-scripts/complete-presenter-script.ts", import.meta.url), "utf8");
  assert.match(privateScript, /PRIVATE PRESENTER MATERIAL/);
  assert.match(privateScript, /export const caseScripts/);
  assert.match(privateScript, /export const supplementScripts/);
});
