# Məhsul şəkilləri

İstehsalçı kataloqundan gələn fotoları buraya qoyun:

```text
public/products/
  mil-720/
    01.webp     ← əsas kart şəkli
    02.webp
    03.webp
```

Sonra `src/mock/products.ts`-də həmin modelin seed-inə əlavə edin:

```ts
images: [
  { src: "/products/mil-720/01.webp", alt: "Milano Security 720 — antrasit", primary: true },
  { src: "/products/mil-720/02.webp", alt: "Milano Security 720 — mat qara" },
],
```

`images` boş qaldıqca sayt avtomatik SVG qapı vizualını göstərir —
komponentlərdə heç nə dəyişmək lazım deyil.

## Tövsiyə olunan format

| | |
|---|---|
| Format | WebP (və ya AVIF) |
| Ölçü | ən azı 1200 × 1600 px, 3:4 nisbət |
| Fon | ağ və ya açıq neytral |
| Rakurs | qapı düz qarşıdan, dəstək tam görünsün |
| Fayl ölçüsü | 250 KB-a qədər |

Rəng variantı üçün ayrıca şəkil varsa `colorOptionId` sahəsini doldurun —
konfiquratorda rəng seçiləndə həmin şəkil göstəriləcək.
