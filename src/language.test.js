import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  matchLanguage,
  resolveLanguage,
  readPreference,
  savePreference,
  supportedLanguages,
  storageKey,
} from "./language.js";

test("matches browser region/script variants and respects preference order", () => {
  for (const [value, expected] of [
    ["zh-CN", "zh-Hans"],
    ["zh-TW", "zh-Hans"],
    ["zh-Hant-HK", "zh-Hans"],
    ["EN-us", "en"],
    ["ja-JP", "ja"],
    ["ko_KR", "ko"],
  ])
    assert.equal(matchLanguage(value), expected);
  assert.equal(resolveLanguage("auto", ["fr-FR", "ja-JP", "en-US"]), "ja");
  assert.equal(resolveLanguage("auto", ["ko-KR", "zh-CN"]), "ko");
  assert.equal(resolveLanguage("auto", ["de-DE"]), "en");
  assert.equal(resolveLanguage("auto", []), "en");
  assert.equal(matchLanguage(null), null);
});
test("manual selection wins; invalid saved choices fall back to browser", () => {
  assert.equal(resolveLanguage("en", ["ja-JP"]), "en");
  assert.equal(resolveLanguage("unsupported", ["ja-JP"]), "ja");
  assert.equal(
    readPreference(() => ({ getItem: () => "bad" })),
    "auto",
  );
});
test("persists choices and removes the override when following the browser", () => {
  const map = new Map();
  const storage = () => ({
    getItem: (key) => map.get(key),
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  });
  savePreference("ko", storage);
  assert.equal(readPreference(storage), "ko");
  savePreference("auto", storage);
  assert.equal(map.has(storageKey), false);
  assert.equal(readPreference(storage), "auto");
});
test("blocked storage does not break language selection", () => {
  const unavailable = () => {
    throw new Error("SecurityError");
  };
  assert.equal(readPreference(unavailable), "auto");
  assert.doesNotThrow(() => savePreference("ja", unavailable));
});
test("all four locales cover both pages and dynamic accessibility labels", () => {
  const locales = supportedLanguages.map((lang) =>
    JSON.parse(
      readFileSync(new URL(`./locales/${lang}.json`, import.meta.url), "utf8"),
    ),
  );
  const keys = Object.keys(locales[0]).sort();
  for (const locale of locales) {
    assert.deepEqual(Object.keys(locale).sort(), keys);
    for (const [key, value] of Object.entries(locale))
      assert.ok(typeof value === "string" && value.trim(), key);
  }
  for (const page of ["index.html", "credits.html"]) {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    for (const [, key] of html.matchAll(
      /data-i18n(?:-aria-label|-title|-content)?="([^"]+)"/g,
    ))
      assert.ok(keys.includes(key), `${page}: ${key}`);
    assert.match(html, /data-language="auto"/);
    for (const language of supportedLanguages)
      assert.ok(html.includes(`data-language="${language}"`));
  }
  for (const key of [
    "nav.open",
    "nav.close",
    "language.label",
    "language.auto",
  ])
    assert.ok(keys.includes(key));
});
