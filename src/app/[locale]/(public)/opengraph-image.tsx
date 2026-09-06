import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { loadOgFont, ogColors, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = brand.name;

export default async function HomeOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);

  const [regular, semibold] = await Promise.all([loadOgFont(400), loadOgFont(700)]);

  const stats = [
    ["4 200+", dict.home.heroStatDoors],
    ["18", dict.home.heroStatYears],
    ["12", dict.home.heroStatBrands],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 64px 56px",
          background: ogColors.navy,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 90px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: ogColors.paper }}>
            Euro<span style={{ color: ogColors.gold }}>Porta</span>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 8,
              paddingLeft: 16,
              borderLeft: `1px solid ${ogColors.line}`,
              fontSize: 18,
              color: ogColors.muted,
              letterSpacing: 2,
            }}
          >
            {dict.meta.slogan.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ display: "flex", fontSize: 19, color: ogColors.goldSoft, letterSpacing: 4 }}>
            {dict.home.heroEyebrow.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 20,
              fontSize: 76,
              fontWeight: 700,
              color: ogColors.paper,
              lineHeight: 1.06,
              letterSpacing: -2,
            }}
          >
            <span>{dict.home.heroTitleTop}</span>
            <span style={{ color: ogColors.goldSoft }}>{dict.home.heroTitleBottom}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 56,
            paddingTop: 30,
            borderTop: `1px solid ${ogColors.line}`,
          }}
        >
          {stats.map(([value, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{ display: "flex", fontSize: 15, color: ogColors.muted, letterSpacing: 2 }}
              >
                {label.toUpperCase()}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 6,
                  fontSize: 40,
                  fontWeight: 700,
                  color: ogColors.paper,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400 },
        { name: "Inter", data: semibold, weight: 700 },
      ],
    },
  );
}
