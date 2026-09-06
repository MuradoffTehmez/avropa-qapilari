# EuroPorta brend faylları

| Fayl | İstifadə |
|---|---|
| `europorta-mark.svg` | Vektor işarə — çap, böyük ölçü, istənilən fon |
| `europorta-mark.png` | 512 × 512, şəffaf fon — favicon, avatar, sosial profil |
| `europorta-mark-180.png` | 180 × 180, şəffaf — Apple touch icon |
| `europorta-full.png` | Tam loqo (işarə + söz nişanı), şəffaf fon |

Orijinal fayl: `Logo/EuroPorta.png` (ağ fonlu).
Şəffaf variantlar ondan proqram şəkildə çıxarılıb.

## Saytda

Header, footer və mobil menyuda **vektor** loqo işlənir:
`src/components/layout/Logo.tsx`. Raster fayllar yalnız
`opengraph`, favicon və xarici istifadə üçündür.

## Rənglər

| | |
|---|---|
| Navy | `#0b1d34` |
| Qızıl (əsas) | `#ad7d38` |
| Qızıl (işıqlı) | `#e8c17a` |
| Qızıl (kölgə) | `#8f6529` |

## Qaydalar

- Loqonun ətrafında ən azı işarənin eninin 1/4 qədər boş sahə saxlayın.
- İşarəni deformasiya etməyin, rəngini dəyişməyin.
- Tünd fonda `europorta-mark.svg` olduğu kimi işləyir (portal içi ağdır).
- Minimum ölçü: işarə 24 px, tam loqo 120 px en.
