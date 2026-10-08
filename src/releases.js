export const RELEASES_URL =
  "https://github.com/OurTaiko/OurTaikoPlay/releases/tag/nightly";
export const RELEASE_API =
  "https://api.github.com/repos/OurTaiko/OurTaikoPlay/releases/tags/nightly";

// Accept only release assets owned by this project; keep the release-page fallback on failure.
export function getDownloads(release) {
  if (!release || release.draft || !Array.isArray(release.assets)) return {};
  const result = {};
  const patterns = {
    windows: /^OurTaikoPlay-.*-Windows-x64\.zip$/i,
    android: /^OurTaikoPlay-.*-Android-arm64\.apk$/i,
  };
  for (const [platform, pattern] of Object.entries(patterns)) {
    const asset = release.assets.find((item) => {
      if (!pattern.test(item?.name ?? "") || item.state !== "uploaded")
        return false;
      try {
        const url = new URL(item.browser_download_url);
        return (
          url.protocol === "https:" &&
          url.hostname === "github.com" &&
          url.pathname.startsWith(
            "/OurTaiko/OurTaikoPlay/releases/download/",
          ) &&
          !url.username &&
          !url.password
        );
      } catch {
        return false;
      }
    });
    if (asset)
      result[platform] = { url: asset.browser_download_url, name: asset.name };
  }
  return result;
}

export async function loadNightly(fetcher = fetch) {
  const response = await fetcher(RELEASE_API, {
    signal: AbortSignal.timeout(6500),
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok)
    throw new Error(`Release request failed: ${response.status}`);
  return getDownloads(await response.json());
}
