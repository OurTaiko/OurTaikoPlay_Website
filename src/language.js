export const supportedLanguages = ["zh-Hans", "en", "ja", "ko"];
export const storageKey = "ourtaikoplay.language";

export function matchLanguage(language) {
  if (typeof language !== "string") return null;
  const base = language.trim().toLowerCase().replaceAll("_", "-").split("-")[0];
  if (base === "zh") return "zh-Hans";
  return supportedLanguages.includes(base) ? base : null;
}

export function resolveLanguage(preference, browserLanguages = []) {
  if (supportedLanguages.includes(preference)) return preference;
  for (const language of browserLanguages) {
    const match = matchLanguage(language);
    if (match) return match;
  }
  return "en";
}

export function readPreference(getStorage = () => window.localStorage) {
  try {
    const value = getStorage().getItem(storageKey);
    return supportedLanguages.includes(value) ? value : "auto";
  } catch {
    return "auto";
  }
}

export function savePreference(value, getStorage = () => window.localStorage) {
  try {
    if (supportedLanguages.includes(value))
      getStorage().setItem(storageKey, value);
    else getStorage().removeItem(storageKey);
  } catch {
    // Private or restricted browsing may disable storage; selection still works in this tab.
  }
}
