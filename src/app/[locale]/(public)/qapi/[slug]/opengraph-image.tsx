import { ImageResponse } from "next/og";
import { getProduct, products } from "@/mock/products";
import { getBrand } from "@/mock/taxonomy";
import { brand } from "@/config/brand";
import { formatPrice } from "@/lib/utils";
import { isLocale } from "@/i18n";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/types";
import { loadOgFont, ogColors, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "EuroPorta";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductOgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const product = getProduct(slug);

  const [regular, semibold] = await Promise.all([loadOgFont(400), loadOgFont(700)]);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: ogColors.navy,
            color: ogColors.paper,
            fontSize: 64,
            fontFamily: "Inter",
          }}
        >
          {brand.name}
        </div>
      ),
      { ...size, fonts: [{ name: "Inter", data: regular, weight: 400 }] },
    );
  }

  const productBrand = getBrand(product.brandSlug);
  const panel = product.panelHexes[0];

  const specs = [
    product.securityClass !== "—" && product.securityClass,
    `${product.soundInsulationDb} dB`,
    product.fireRating,
    `${product.warrantyYears} ${dict.common.years}`,
  ].filter(Boolean) as string[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: ogColors.navy,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Şaquli xətt naxışı */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 90px)",
          }}
        />

        {/* Mətn hissəsi */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 56px",
            width: 760,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: ogColors.paper }}>
              Euro<span style={{ color: ogColors.gold }}>Porta</span>
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 6,
                paddingLeft: 14,
                borderLeft: `1px solid ${ogColors.line}`,
                fontSize: 17,
                color: ogColors.muted,
              }}
            >
              {productBrand?.name ?? brand.slogan}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 19, color: ogColors.goldSoft, letterSpacing: 3 }}>
              {product.sku}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontSize: 62,
                fontWeight: 700,
                color: ogColors.paper,
                lineHeight: 1.08,
                letterSpacing: -1.5,
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 24,
                color: ogColors.muted,
                lineHeight: 1.4,
                maxWidth: 620,
              }}
            >
              {product.shortDescription.slice(0, 110)}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 36 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 15, color: ogColors.muted, letterSpacing: 2 }}>
                {dict.product.startingPrice.toUpperCase()}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 6,
                  fontSize: 42,
                  fontWeight: 700,
                  color: ogColors.goldSoft,
                }}
              >
                {formatPrice(product.basePrice)}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, paddingBottom: 8 }}>
              {specs.map((spec) => (
                <div
                  key={spec}
                  style={{
                    display: "flex",
                    padding: "7px 14px",
                    border: `1px solid ${ogColors.line}`,
                    borderRadius: 3,
                    fontSize: 17,
                    color: ogColors.paper,
                  }}
                >
                  {spec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Qapı vizualı */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.03)",
            borderLeft: `1px solid ${ogColors.line}`,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 232,
              height: 420,
              background: `linear-gradient(100deg, ${panel} 0%, ${panel} 55%, rgba(0,0,0,0.35) 100%)`,
              border: "8px solid rgba(0,0,0,0.35)",
              position: "relative",
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 22,
                  right: 22,
                  top: 58 + i * 58,
                  height: 2,
                  background: "rgba(0,0,0,0.28)",
                  display: "flex",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                right: 22,
                top: 196,
                width: 42,
                height: 7,
                borderRadius: 4,
                background: ogColors.goldSoft,
                display: "flex",
              }}
            />
          </div>
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
