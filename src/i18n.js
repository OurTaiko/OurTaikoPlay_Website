import zh from "./locales/zh-Hans.json";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import {
  readPreference,
  resolveLanguage,
  savePreference,
  storageKey,
  supportedLanguages,
} from "./language.js";

const messages = { "zh-Hans": zh, en, ja, ko };
let preference = readPreference();
let language;

export function t(key) {
  return messages[language]?.[key] ?? en[key] ?? key;
}

function renderLanguage() {
  language = resolveLanguage(
    preference,
    navigator.languages?.length ? navigator.languages : [navigator.language],
  );
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  for (const attribute of ["aria-label", "title", "content"]) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
      element.setAttribute(
        attribute,
        t(element.getAttribute(`data-i18n-${attribute}`)),
      );
    });
  }
  const navButton = document.querySelector(".menu-toggle");
  if (navButton)
    navButton.setAttribute(
      "aria-label",
      t(
        navButton.getAttribute("aria-expanded") === "true"
          ? "nav.close"
          : "nav.open",
      ),
    );
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute(
      "aria-checked",
      String(button.dataset.language === preference),
    );
  });
}

export function initLanguage() {
  renderLanguage();
  const switcher = document.querySelector(".language-switcher");
  const toggle = switcher.querySelector(".language-toggle");
  const menu = switcher.querySelector(".language-menu");
  const items = [...menu.querySelectorAll("[data-language]")];

  function setOpen(open, restoreFocus = false) {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      document.dispatchEvent(new Event("language-menu-open"));
      (
        items.find((item) => item.getAttribute("aria-checked") === "true") ??
        items[0]
      ).focus();
    } else if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => setOpen(menu.hidden));
  toggle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      (event.key === "ArrowDown" ? items[0] : items.at(-1)).focus();
    }
  });
  menu.addEventListener("click", (event) => {
    const selected = event.target.closest("[data-language]")?.dataset.language;
    if (
      !selected ||
      (selected !== "auto" && !supportedLanguages.includes(selected))
    )
      return;
    preference = selected;
    savePreference(preference);
    renderLanguage();
    setOpen(false, true);
  });
  menu.addEventListener("keydown", (event) => {
    const index = items.indexOf(document.activeElement);
    let next;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    if (event.key === "ArrowUp")
      next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      items[next].focus();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  document.addEventListener("click", (event) => {
    if (!switcher.contains(event.target)) setOpen(false);
  });
  switcher.addEventListener("focusout", (event) => {
    if (!switcher.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener("navigation-menu-open", () => setOpen(false));
  window.addEventListener("languagechange", () => {
    if (preference === "auto") renderLanguage();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) {
      preference = readPreference();
      renderLanguage();
    }
  });
}
