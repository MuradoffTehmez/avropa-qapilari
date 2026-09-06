# EuroPorta — Girişin yeni standartı

Avropa istehsalı qapıların onlayn satışı, konfiqurasiyası, quraşdırılması, təmiri və
zəmanət idarəçiliyi üçün platforma. Bu repozitoriya **Mərhələ 1 — frontend** işidir.

---

## Mövcud vəziyyət

| | Vəziyyət |
|---|---|
| Frontend (Mərhələ 1) | ✅ Hazırdır |
| Backend / API | ⛔ Hələ yazılmayıb |
| Məlumat mənbəyi | Test datası — `src/mock/` |
| Formalar | Client-side validasiya işləyir; müraciətlər brauzerdə saxlanılır |
| Autentifikasiya | Yoxdur — `/giris` ekranı hazır, sessiya backend ilə qoşulacaq |
| Ödəniş | Yoxdur — provayder abstraksiyası planlaşdırılıb |
| Şirkət əlaqə məlumatları | Boş — `src/config/brand.ts` faylında doldurulmalıdır |

Test datası hər modeldən bir qeyddən ibarətdir (9 məhsul — hər kateqoriyadan biri).
Təhvil zamanı `src/mock/` qovluğu repository qatı ilə əvəzlənəcək.

---

## Brend

| | |
|---|---|
| Ad | EuroPorta |
| Slogan | Girişin yeni standartı |
| Rənglər | Navy `#0b1d34` · Qızıl `#ad7d38` (loqodan çıxarılıb) |
| Loqo mənbəyi | `Logo/EuroPorta.png` |
| Veb variantları | `public/brand/europorta-full.png`, `public/brand/europorta-mark.png` |
| Vektor işarə | `src/components/layout/Logo.tsx` |

Brend məlumatı bir yerdə saxlanılır: [`src/config/brand.ts`](src/config/brand.ts).
Telefon, e-poçt, ünvan və sosial linklər boş qaldıqca UI-də avtomatik gizlədilir —
doldurduğunuz anda header, footer və əlaqə səhifəsində görünəcək.

---

## Texnologiya

- **Next.js 16** (App Router, Server Components default)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-first konfiqurasiya, `@theme` tokenləri
- **Zustand** — səbət, favorilər, müqayisə və iş axını üçün persist olunan state
- **lucide-react** — ikonlar

---

## Başlanğıc

```bash
npm install
```

```bash
npm run dev
```

Sayt: <http://localhost:3000> → dil kukisi / brauzer dilinə görə yönlənir.

```bash
npm run build
```

```bash
npm run lint
```

```bash
npm run typecheck
```

---

## Dil dəstəyi

Üç dil tam dəstəklənir: **AZ** (default), **EN**, **RU**.

- Hər dilin öz tam sözlüyü var (`src/i18n/dictionaries/`), fallback yoxdur —
  TypeScript üç faylın açar dəstinin eyni olmasını məcbur edir.
- Kateqoriya, material, stil və ölkə adları da tərcümə olunur
  (`dict.taxonomy`, `src/lib/i18n-format.ts`).
- URL seqmentləri lokallaşdırılıb: `/az/qapilar`, `/en/doors`, `/ru/dveri`
  (`next.config.ts` rewrite-ları).
- Dil seçimi kukidə saxlanılır; ilk ziyarətdə `Accept-Language` nəzərə alınır.

---

## Səhifə xəritəsi

Bütün URL-lər locale prefiksi ilə işləyir.

### Public

| Ünvan | Təsvir |
|---|---|
| `/az` | Ana səhifə |
| `/az/qapilar` | Kataloq — filtrlər, sıralama, grid/list, mobil drawer |
| `/az/qapilar/[category]` | Kateqoriya |
| `/az/qapi/[slug]` | Məhsul detalı — qalereya, 11 tab, sənədlər, Product schema |
| `/az/konfiqurator/[slug]` | **Qapı konfiquratoru** — canlı preview və qiymət |
| `/az/sebet`, `/az/sifaris` | Səbət və 6 addımlı checkout |
| `/az/temir` | 8 addımlı təmir sihirbazı |
| `/az/olcu` | Ölçü ustası sifarişi |
| `/az/quote` | Qiymət təklifi sorğusu |
| `/az/xidmetler`, `/az/xidmetler/[service]` | Xidmətlər |
| `/az/brands`, `/az/brands/[slug]` | Brendlər |
| `/az/layiheler`, `/az/layiheler/[slug]` | Layihələr, əvvəl/sonra müqayisəsi |
| `/az/blog`, `/az/faq`, `/az/haqqimizda`, `/az/elaqe` | Kontent |
| `/az/favoritler`, `/az/muqayise` | Favorilər və müqayisə (maks. 4 məhsul) |
| `/az/giris` | Giriş / qeydiyyat / şifrə bərpası |
| `/az/usta` | Usta kabineti |
| `/az/service/door/[serial]` | QR qapı pasportu |
| `/az/legal/[page]` | Hüquqi səhifələr |

### Hesab

`/az/hesab` və alt bölmələr: `orders`, `configurations`, `repairs`,
`appointments`, `warranties`, `addresses`, `notifications`, `profile`.

### Admin

`/az/admin` və 21 alt bölmə: kataloq, satış, xidmətlər, komanda, müştərilər,
anbar, zəmanət, rəylər, kontent, SEO, analitika, audit, tənzimləmələr.

---

## Layihə strukturu

```text
src/
  app/[locale]/
    (public)/      # sayt — header + footer
    (commerce)/    # səbət, checkout
    (account)/     # müştəri kabineti
    admin/         # idarəetmə paneli
  components/
    ui/            # dizayn sistemi primitivləri
    layout/        # header, footer, axtarış, dil seçici, mobil naviqasiya
    product/       # kart, qalereya, kataloq, müqayisə, DoorVisual, DoorScene
    configurator/  # konfiqurator
    cart/          # səbət, checkout
    repair/        # təmir, ölçü, qiymət təklifi
    account/       # kabinet, giriş, usta paneli, bildirişlər
    admin/         # cədvəl, shell, bölmələr
  features/
    catalog/       # filter və sıralama məntiqi
    configurator/  # uyğunluq (compatibility) engine
    pricing/       # qiymət hesablama engine
  i18n/            # AZ / EN / RU tam sözlüklər
  mock/            # TEST DATASI — backend qoşulanda əvəzlənəcək
  store/           # zustand (səbət, siyahılar, iş axını)
  lib/             # routes, utils, hooks, i18n-format
  types/           # domain tipləri
  config/brand.ts  # brend konfiqurasiyası
```

---

## Responsive

Yoxlanılmış ekran ölçüləri: **320, 360, 390, 768, 1024, 1280, 1440, 1920 px**.
25 səhifədə üfüqi sürüşmə yoxdur.

- Mobil: alt naviqasiya paneli, tam ekran çekmecə, 44px toxunma hədəfləri,
  `safe-area` dəstəyi, iOS-da fokus zamanı zoom olmur
- Planşet: 3 sütunlu kataloq, yan panel yığılır
- Desktop: 4 sütun, sabit filtr paneli, maksimum 90rem kontent eni
- Admin cədvəlləri mobildə kart görünüşünə keçir

---

## Növbəti mərhələ

1. Cloudflare Workers + D1 + Prisma qurulumu
2. `src/mock/` → repository/service qatına keçid
3. Autentifikasiya və RBAC
4. Server-side pricing və sifariş axını
5. R2 + Cloudflare Images ilə real məhsul fotoları
6. Turnstile, rate limiting, audit log
7. Ödəniş provayderi inteqrasiyası

Tam məhsul tələbləri sənədi: [`docs/PRD.md`](docs/PRD.md)
Layihə konvensiyaları və iş qaydaları: [`CLAUDE.md`](CLAUDE.md)

---

## Lisenziya

Bu repozitoriya sifarişçi üçün hazırlanıb. Bütün hüquqlar qorunur.
