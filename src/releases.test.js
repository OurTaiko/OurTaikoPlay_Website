import test from "node:test";
import assert from "node:assert/strict";
import { getDownloads, loadNightly } from "./releases.js";

const asset = (platform, extension) => ({
  name: `OurTaikoPlay-1.0-20261008-450a08f-${platform}.${extension}`,
  state: "uploaded",
  browser_download_url: `https://github.com/OurTaiko/OurTaikoPlay/releases/download/nightly/OurTaikoPlay-${platform}.${extension}`,
});
test("uses the uploaded assets from a prerelease Nightly", () => {
  const windows = asset("Windows-x64", "zip");
  const android = asset("Android-arm64", "apk");
  const result = getDownloads({ prerelease: true, assets: [windows, android] });
  assert.equal(result.windows.url, windows.browser_download_url);
  assert.equal(result.android.url, android.browser_download_url);
});
test("does not invent downloads when an asset is missing or unfinished", () => {
  assert.deepEqual(getDownloads({ assets: [] }), {});
  assert.deepEqual(
    getDownloads({
      assets: [{ ...asset("Windows-x64", "zip"), state: "new" }],
    }),
    {},
  );
  assert.deepEqual(
    getDownloads({ draft: true, assets: [asset("Windows-x64", "zip")] }),
    {},
  );
  assert.deepEqual(getDownloads(null), {});
});
test("rejects download URLs outside the project and malformed data", () => {
  for (const url of [
    "https://example.org/game.zip",
    "javascript:alert(1)",
    "https://github.com/other/repo/releases/download/game.zip",
    "invalid",
  ]) {
    assert.deepEqual(
      getDownloads({
        assets: [{ ...asset("Windows-x64", "zip"), browser_download_url: url }],
      }),
      {},
    );
  }
});
test("propagates API failure so the release-page fallback remains usable", async () => {
  await assert.rejects(
    loadNightly(async () => ({ ok: false, status: 403 })),
    /403/,
  );
  await assert.rejects(
    loadNightly(async () => {
      throw new Error("offline");
    }),
    /offline/,
  );
});
