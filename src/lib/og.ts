/** Paylaşım kartları (OG image) üçün ümumi ayarlar. */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export const ogColors = {
  navy: "#0b1d34",
  navyDeep: "#071322",
  gold: "#d3a54f",
  goldSoft: "#e8c17a",
  paper: "#ffffff",
  muted: "rgba(255,255,255,0.62)",
  line: "rgba(255,255,255,0.14)",
};

/**
 * Satori WOFF2 oxumur — köhnə User-Agent ilə Google Fonts TTF qaytarır.
 * Azərbaycan hərfləri üçün latin-ext altçoxluğu tələb olunur.
 */
export async function loadOgFont(weight: 400 | 600 | 700): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&subset=latin,latin-ext`,
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:20.0) Gecko/20100101 Firefox/20.0" } },
  ).then((r) => r.text());

  const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error("OG font URL tapılmadı");

  return fetch(url).then((r) => r.arrayBuffer());
}

/** Loqo işarəsinin sadələşdirilmiş SVG variantı — satori üçün. */
export const ogMark = `<svg width="72" height="72" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 2.5 46.5 13v33.5h-37V13z" fill="#0b1d34" stroke="#d3a54f" stroke-width="3" stroke-linejoin="round"/>
<path d="M28 12.5 39 18.7v27.8H17V18.7z" fill="#ffffff" stroke="#e8c17a" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M27.4 19.6 36.6 22v24.5h-9.2z" fill="#0b1d34"/>
<rect x="29.1" y="28" width="1.7" height="11" rx="0.85" fill="#e8c17a"/>
<rect x="15" y="46.5" width="26" height="2.6" fill="#e8c17a"/>
<rect x="11" y="49.1" width="34" height="2.6" fill="#d3a54f"/>
<rect x="6.5" y="51.7" width="43" height="2.8" rx="0.6" fill="#e8c17a"/>
</svg>`;
