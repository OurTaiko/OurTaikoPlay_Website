import { initLanguage, t } from "./i18n.js";

initLanguage();

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
if (menuButton && nav) {
  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
    nav.classList.toggle("is-open", open);
    if (open) document.dispatchEvent(new Event("navigation-menu-open"));
  };
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-wrap")) setMenu(false);
  });
  document.addEventListener("language-menu-open", () => setMenu(false));
  matchMedia("(min-width: 1051px)").addEventListener("change", () =>
    setMenu(false),
  );
}
