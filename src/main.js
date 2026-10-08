import { loadNightly } from "./releases.js";

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const setMenu = (open) => {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
  nav.classList.toggle("is-open", open);
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
matchMedia("(min-width: 801px)").addEventListener("change", () =>
  setMenu(false),
);

loadNightly()
  .then((downloads) => {
    const names = { windows: "Windows", android: "Android" };
    for (const [platform, asset] of Object.entries(downloads)) {
      const link = document.querySelector(`[data-download="${platform}"]`);
      link.href = asset.url;
      link.title = asset.name;
      link.replaceChildren(
        document.createTextNode(`下载 ${names[platform]} 版 `),
      );
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "↓";
      link.append(icon);
    }
    if (Object.keys(downloads).length) {
      document.querySelector("#release-status").textContent =
        "已同步 GitHub Nightly 下载。开发版可能存在未修复的问题；若下载失败，可前往全部发布记录。";
    }
  })
  .catch(() => {
    document.querySelector("#release-status").textContent =
      "暂时无法同步下载文件。Windows / Android 按钮仍可打开 Nightly 发布页，其他入口不受影响。";
  });
