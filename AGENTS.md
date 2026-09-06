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
9. **Səlahiyyət hər sorğuda serverdə yoxlanılır.** `AuthGuard` yalnız
   interfeys səviyyəsindədir; route handler-də `requireUser(rol)` çağır və
   sətirləri istifadəçiyə görə filtrlə (PRD §93).
10. **Ödəniş provayderi abstraksiyadır** — `src/server/payments.ts`.
    Yeni provayder əlavə edəndə yalnız adapter yazılır, sxem və route
    dəyişmir.

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

Kataloq və ya seçim dəyişəndə başlanğıc konfiqurasiyaları yoxla:

```bash
npm run check:defaults
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
  server/          data qatı: db, auth, pricing, account, admin, technician,
                   payments, password-reset, validation, http, numbering
  app/api/         route handler-ləri
  i18n/            AZ / EN / RU tam sözlüklər
  mock/            kataloq məzmunu — `prisma/seed.ts` buradan doldurur
  store/           zustand
  lib/             routes, utils, hooks, i18n-format, api, cn
  config/brand.ts  brend konfiqurasiyası
```

---

## Data qatı

Əməliyyat datası (sifariş, müraciət, hesab, zəmanət, ödəniş) **bazadadır**.
Səhifələr onu `src/server/` oxu modullarından alır:

| Modul | Nə üçün |
|---|---|
| `account.ts` | müştəri kabineti — hər sorğu `userId` ilə məhdudlaşır |
| `admin.ts` | admin panelinin cədvəlləri və KPI-ları |
| `technician.ts` | ustaya təyin edilmiş işlər |
| `pricing.ts` | server qiyməti (PRD §130) |

`src/mock/` **kataloq məzmununun mənbəyidir** — `prisma/seed.ts` bazanı
oradan doldurur. Hər modeldən bir qeyd saxlanılır: 9 məhsul, 1 sifariş,
1 təmir, 1 zəmanət və s.

- Sayğacları əl ilə yazma — `taxonomy.ts` onları məhsul siyahısından hesablayır.
- Yeni məhsul əlavə edəndə `panelHexes`, `optionGroups` və `specs` doldur.
- Konstruksiya qatları materiala görədir: `src/mock/construction.ts`.
- Məhsul və ya option əlavə etdikdən sonra seed-i yenidən işlət.

Seed üç rol üçün hesab açır (`admin@`, `usta@`, `test@europorta.az`);
parol `SEED_PASSWORD` mühit dəyişənindən gəlir. Yalnız lokal inkişaf
üçündür — production bazasında seed işlədilmir.

---

## Bilinən qərarlar

- **Intl istifadə etmə.** Node və brauzerin ICU verilənləri fərqli boşluq
  simvolu verir və hydration mismatch yaradır. `src/lib/utils.ts`-dəki
  `formatPrice`, `formatDate`, `formatNumber` istifadə et.
- **Hydration-a həssas state** `useHydrated()` ilə qorunur
  (`useSyncExternalStore` üzərində) — `useEffect`-də `setState` etmə,
  react-hooks lint qaydası onu bloklayır.
- **Qiymət hesablaması** iki yerdədir: `src/features/pricing/engine.ts`
  yalnız server cavabı gələnə qədər göstərilən optimistik dəyərdir,
  həqiqi məbləği `src/server/pricing.ts` verir (PRD §130). Konfiqurator
  seçim dəyişəndə `/api/configurator/price`-a sorğu göndərir.
- **Başlanğıc seçim uyğunluqdan keçirilir** — bəzi qruplarda bütün
  dəyərlər ilkin şərt tələb edir. `npm run check:defaults` doqquz məhsulun
  başlanğıc konfiqurasiyasını server qiymətləndirməsindən keçirir.
- **Prisma client standart yerə generasiya olunur** və `next.config.ts`-də
  `serverExternalPackages` ilə bundle-dan kənarda saxlanılır. Custom
  `output` yolu Turbopack-in bütün layihəni trace etməsinə səbəb olurdu.
- **E-poçt provayderi yoxdur.** Parol bərpası linki hazırda server
  jurnalına yazılır (`src/server/password-reset.ts` → `deliverResetLink`).
- **Locale route-ları**: fayl sistemi AZ seqmentlərindən istifadə edir;
  EN/RU seqmentləri `next.config.ts` rewrite-ları ilə yönlənir.

---

## Git

- Commit mesajları Azərbaycan dilində, imperativ formada.
- Bir commit = bir məntiqi dəyişiklik.
- `main` branch-ı birbaşa istifadə olunur (tək tərtibatçı).
