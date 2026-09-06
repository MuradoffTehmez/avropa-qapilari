# EuroPorta — layihə təlimatı

Avropa qapılarının satışı, konfiqurasiyası, quraşdırılması və təmiri üçün platforma.
Hazırda **Mərhələ 2** — backend qoşulub (Prisma + SQLite, `src/app/api/`).

Tam məhsul tələbləri: [`docs/PRD.md`](docs/PRD.md)

---

## Əsas qaydalar

1. **Mərhələ 2 — backend qoşulub.** API route-ları `src/app/api/`, server
   məntiqi `src/server/`, sxem `prisma/schema.prisma`. Data qatı üçün
   Prisma + SQLite (Cloudflare D1 ilə eyni motor).
2. **Qiymət yalnız serverdə hesablanır.** Client-dən gələn `total`,
   `price`, `priceDelta` heç vaxt qəbul edilmir — `src/server/pricing.ts`
   məhsul və option dəyərlərini bazadan oxuyub yenidən hesablayır (PRD §130).
3. **Bütün UI mətni sözlükdən gəlir.** Komponentə sabit mətn yazma —
   `src/i18n/dictionaries/{az,en,ru}.ts` fayllarının üçünə də açar əlavə et.
   `Dictionary` tipi üçünün eyni olmasını məcbur edir; biri unudulsa build düşür.
4. **Şirkət məlumatları boşdur** və elə də qalmalıdır. `src/config/brand.ts`-də
   telefon, e-poçt, ünvan, sosial linklər boş sətirdir; UI onları
   `hasContact` / `hasSocial` ilə şərtli göstərir. Uydurma məlumat yazma.
5. **"demo" və "nümunə" sözləri qadağandır.** İstifadəçi məhz bunları silməyi
   istəyib. Test datası olduğunu bildirmək lazımdırsa kod şərhində yaz, UI-də yox.
6. **PRD istinadı UI mətninə yazılmır.** Kod şərhində yazmaq olar.
7. **Parol və sessiya.** Parollar scrypt ilə `salt:hash` şəklində saxlanılır;
   sessiya tokeni bazada yalnız SHA-256 hash kimi qalır, kuki HttpOnly.
   `src/server/auth.ts`-dən kənarda parol emalı yazma.
8. **Kritik yazma əməliyyatları idempotent olmalıdır** — `Idempotency-Key`
   başlığı (PRD §137).

---

## Texnologiya

- Next.js 16 (App Router), React 19, TypeScript strict
- Tailwind CSS v4 — konfiqurasiya `src/app/globals.css`-dəki `@theme` blokundadır
- Zustand — `src/store/` (səbət, siyahılar, iş axını)
- `qrcode` — yalnız server komponentində

## Yoxlama əmrləri

```bash
npm run build
```

```bash
npm run typecheck
```

```bash
npm run lint
```

Baza sxemi dəyişəndə:

```bash
npm run db:migrate
```

Dəyişiklikdən sonra üçünü də işlət. Lint xəbərdarlıqları da təmizlənməlidir.

---

## Tipoqrafiya

İki şrift işlənir:

- **Inter** (`font-sans`) — bütün UI, mətn, forma, admin, cədvəl
- **Fraunces** (`font-display`) — yalnız marketinq başlıqları: `h1`,
  `SectionHeading` başlığı. Admin panelə və UI elementlərinə tətbiq etmə.

Yeni marketinq səhifəsi yazanda `h1`-ə `font-display` sinfini əlavə et.
Şrift dəyişdirilərsə Azərbaycan hərflərinin (`ə ı İ ğ ş ç ö ü`) glif
dəstəyini mütləq yoxla — Google Fonts-da `latin-ext` altçoxluğu lazımdır.

---

## Məhsul şəkilləri

`Product.images` boş olduqca sayt SVG qapı vizualını göstərir.
İstehsalçı kataloqundan foto gələndə `public/products/<sku>/` qovluğuna
qoyulur və seed-də qeyd olunur — komponentlərdə dəyişiklik lazım deyil.
Qayda: [`public/products/README.md`](public/products/README.md).

Vizual göstərmək lazım olanda `ProductMedia` komponentindən istifadə et,
`DoorVisual`-ı birbaşa çağırma (foto dəstəyi itir).

---

## Dizayn sistemi

Palitra loqodan çıxarılıb — dəyişdirmə:

| Token | Dəyər | İstifadə |
|---|---|---|
| `ink` | `#101f33` | Əsas mətn, tünd səthlər |
| `obsidian` | `#08131f` | Ən tünd fon |
| `gold-500` | `#ad7d38` | Aksent, CTA, aktiv hal |
| `gold-300` | `#e8c17a` | Tünd fonda aksent |
| `bone` / `sand` / `line` / `mist` / `stone` / `graphite` | | Neytral pilləkən |

Qaydalar:

- **Rəngi birbaşa hex kimi yazma** — token istifadə et (`text-ink`, `bg-gold-500`).
- Radiuslar minimaldır (2–6px) — arxitektural görünüş üçün qəsdən belədir.
- Kölgə demək olar ki istifadə olunmur; ayırma sərhədlə (`border-line`) edilir.
- Loqo `src/components/layout/Logo.tsx` — vektordur, raster variantlar
  `public/brand/` qovluğundadır.

---

## Responsive

Yoxlanılan enlər: **320, 360, 390, 768, 1024, 1280, 1440, 1920**.

- Mobil-first yaz; `sm:`, `md:`, `lg:` ilə böyüt.
- Toxunma hədəfi ən azı 44px (`h-11`).
- Sabit `min-w-[Npx]` yalnız `overflow-x-auto` daxilində.
- Cədvəllər mobildə karta çevrilməlidir (`hidden md:block` + kart siyahısı).
- Dəyişiklikdən sonra üfüqi daşmanı yoxla:

```bash
npm run build
```

Brauzerdə: `document.documentElement.scrollWidth > clientWidth` olmamalıdır.

---

## Qovluq strukturu

```text
src/
  app/[locale]/
    (public)/      sayt · (commerce)/ səbət, checkout
    (account)/     müştəri kabineti · admin/ idarəetmə paneli
  components/{ui,layout,product,configurator,cart,repair,account,admin}
  features/{catalog,configurator,pricing}   saf məntiq, UI yoxdur
  i18n/            AZ / EN / RU tam sözlüklər
  mock/            TEST DATASI — backend qoşulanda əvəzlənəcək
  store/           zustand
  lib/             routes, utils, hooks, i18n-format, cn
  config/brand.ts  brend konfiqurasiyası
```

---

## Data qatı

`src/mock/` **müvəqqətidir**. Hər modeldən bir qeyd saxlanılır:
9 məhsul (hər kateqoriyadan biri), 1 sifariş, 1 təmir, 1 zəmanət və s.

- Sayğacları əl ilə yazma — `taxonomy.ts` onları məhsul siyahısından hesablayır.
- Yeni məhsul əlavə edəndə `panelHexes`, `optionGroups` və `specs` doldur.
- Konstruksiya qatları materiala görədir: `src/mock/construction.ts`.

Backend qoşulanda dəyişiklik yalnız bu qatda olmalıdır — komponentlərin
props API-si dəyişməməlidir.

---

## Bilinən qərarlar

- **Intl istifadə etmə.** Node və brauzerin ICU verilənləri fərqli boşluq
  simvolu verir və hydration mismatch yaradır. `src/lib/utils.ts`-dəki
  `formatPrice`, `formatDate`, `formatNumber` istifadə et.
- **Hydration-a həssas state** `useHydrated()` ilə qorunur
  (`useSyncExternalStore` üzərində) — `useEffect`-də `setState` etmə,
  react-hooks lint qaydası onu bloklayır.
- **Qiymət hesablaması** `src/features/pricing/engine.ts`-dədir və hazırda
  yalnız UI göstəricisidir. Backend gələndə eyni qaydalar server-side
  pricing service-ə köçürüləcək (PRD §130).
- **Locale route-ları**: fayl sistemi AZ seqmentlərindən istifadə edir;
  EN/RU seqmentləri `next.config.ts` rewrite-ları ilə yönlənir.

---

## Git

- Commit mesajları Azərbaycan dilində, imperativ formada.
- Bir commit = bir məntiqi dəyişiklik.
- `main` branch-ı birbaşa istifadə olunur (tək tərtibatçı).
