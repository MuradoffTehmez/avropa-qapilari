# Avropa Qapıları — Satış və Təmir Platforması

Avropa istehsalı qapıların onlayn satışı, konfiqurasiyası, quraşdırılması, təmiri və
zəmanət idarəçiliyi üçün platforma. Bu repozitoriya **Mərhələ 1 — frontend** işidir.

> **Demo brend qeydi.** Rəsmi ad və loqo hələ hazır olmadığı üçün müvəqqəti olaraq
> **EuroPorta** adı və sadə SVG loqo istifadə olunub. Real brend məlumatı gələndə
> yalnız [`src/config/brand.ts`](src/config/brand.ts) və
> [`src/components/layout/Logo.tsx`](src/components/layout/Logo.tsx) dəyişdirilməlidir.

---

## Mövcud vəziyyət

| | Vəziyyət |
|---|---|
| Frontend (Mərhələ 1) | ✅ Hazırdır |
| Backend / API | ⛔ Hələ yazılmayıb (planlaşdırılıb) |
| Məlumat mənbəyi | Mock data — `src/mock/` |
| Formalar | Client-side validasiya işləyir, serverə göndərilmir |
| Autentifikasiya | Yoxdur — hesab bölməsi demo istifadəçi ilə göstərilir |
| Ödəniş | Yoxdur — provayder abstraksiyası PRD-də təsvir olunub |

Bütün mock məlumatlar bir yerdə saxlanılır ki, backend qoşulanda dəyişiklik
yalnız data qatında olsun; komponentlərin API-si dəyişməyəcək.

---

## Texnologiya

- **Next.js 16** (App Router, Server Components default)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-first konfiqurasiya, `@theme` tokenləri
- **Zustand** — səbət, favorilər və müqayisə üçün persist olunan client state
- **lucide-react** — ikonlar
- Şəkil əvəzinə **proqram SVG qapı renderi** (real fotolar gələnə qədər)

Kod strukturu PRD §188-dəki repozitoriya sxeminə uyğun qurulub.

---

## Başlanğıc

```bash
npm install
```

```bash
npm run dev
```

Sayt: <http://localhost:3000> → avtomatik olaraq `/az` ünvanına yönlənir.

```bash
npm run build
```

```bash
npm run lint
```

---

## Səhifə xəritəsi

Bütün URL-lər locale prefiksi ilə işləyir: `/az`, `/en`, `/ru`.
EN/RU seqmentləri (`/en/doors`, `/ru/dveri`) `next.config.ts`-dəki rewrite-larla
AZ route-larına yönlənir (PRD §24).

### Public

| Ünvan | Təsvir |
|---|---|
| `/az` | Ana səhifə (PRD §25–§36 bölmə ardıcıllığı) |
| `/az/qapilar` | Kataloq — tam filter sistemi, sort, grid/list, mobil drawer |
| `/az/qapilar/[category]` | Kateqoriya səhifəsi |
| `/az/qapi/[slug]` | Məhsul detalı — qalereya, 11 tab, sənədlər, Product schema |
| `/az/konfiqurator` | Model seçimi |
| `/az/konfiqurator/[slug]` | **Qapı konfiquratoru** — canlı preview və qiymət |
| `/az/sebet`, `/az/sifaris` | Səbət və 6 addımlı checkout |
| `/az/temir` | 8 addımlı təmir sihirbazı |
| `/az/olcu` | Ölçü ustası sifarişi |
| `/az/quote` | Qiymət təklifi sorğusu |
| `/az/xidmetler`, `/az/xidmetler/[service]` | Xidmətlər |
| `/az/brands`, `/az/brands/[slug]` | Brendlər |
| `/az/layiheler`, `/az/blog`, `/az/faq`, `/az/haqqimizda`, `/az/elaqe` | Kontent |
| `/az/favoritler`, `/az/muqayise` | Favorilər və müqayisə (maks. 4 məhsul) |
| `/az/service/door/[serial]` | **QR qapı pasportu** — public görünüş |
| `/az/legal/[page]` | Hüquqi səhifələr |

### Hesab

`/az/hesab` və alt bölmələr: `orders`, `configurations`, `repairs`,
`appointments`, `warranties`, `addresses`, `notifications`, `profile`.

### Admin

`/az/admin` və alt bölmələr: `products`, `categories`, `brands`, `configurator`,
`orders`, `quotes`, `discounts`, `repairs`, `measurements`, `appointments`,
`technicians`, `roles`, `customers`, `inventory`, `warranty`, `reviews`,
`content`, `seo`, `analytics`, `audit`, `settings`.

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
    layout/        # header, footer, axtarış, kuki
    product/       # kart, qalereya, kataloq, müqayisə, DoorVisual
    configurator/  # konfiqurator
    cart/          # səbət, checkout
    repair/        # təmir, ölçü, qiymət təklifi
    account/       # kabinet naviqasiyası, status
    admin/         # cədvəl və shell
  features/
    catalog/       # filter və sort məntiqi
    configurator/  # uyğunluq (compatibility) engine
    pricing/       # qiymət hesablama engine
  i18n/            # AZ baza + EN/RU merge
  mock/            # DEMO DATA — backend qoşulanda əvəzlənəcək
  store/           # zustand (səbət, favorilər, müqayisə)
  lib/             # routes, utils, hooks
  types/           # domain tipləri
  config/brand.ts  # DEMO brend konfiqurasiyası
```

---

## PRD ilə uyğunluq

Frontend mərhələsində icra olunan əsas bölmələr:

- §23–§36 — informasiya arxitekturası və ana səhifə
- §37–§46 — kataloq, filter, sort, axtarış, məhsul səhifəsi, favorilər, müqayisə
- §47–§57 — konfiqurator, option sistemi, custom ölçü, konfiqurasiyanın saxlanması
- §53–§55 — pricing engine (`src/features/pricing/engine.ts`)
- §58–§65 — səbət, checkout, sifariş statusları və snapshot
- §66–§68 — qiymət təklifi və ölçü sifarişi
- §69–§73 — təmir sistemi və sihirbaz
- §81–§85 — zəmanət, serial nömrə, QR pasport, servis tarixçəsi
- §90–§97 — admin paneli, RBAC matrisi, konfiqurator idarəçiliyi
- §107–§111 — SEO: metadata, structured data, sitemap, robots, canonical
- §112–§118 — performans, mobile-first, dizayn sistemi, əlçatanlıq (WCAG 2.2 AA hədəfi)
- §173 — kuki razılığı

### Frontend-də *məqsədli şəkildə* edilməyənlər

Bunlar server tələb edir və növbəti mərhələdəyə saxlanılıb:

- Real qiymət hesablanması serverdə (PRD §130) — hazırkı engine yalnız UI göstəricisidir
- D1 / Prisma, R2, Cloudflare Images, KV, Queues, Workflows
- Autentifikasiya, sessiya, RBAC tətbiqi (§88, §89, §93)
- Turnstile, WAF, rate limiting (§19, §20)
- Ödəniş provayderi inteqrasiyası (§61)
- Appointment konflikt yoxlaması serverdə (§79)
- Fayl yükləmə təhlükəsizliyi və signed URL (§131)

---

## Dizayn sistemi

- Palitra: ağ / off-white / qrafit / tünd boz / qara + **fırçalanmış bürünc** aksent
- Tipoqrafiya: Inter (`latin`, `latin-ext`, `cyrillic` — `ə ı İ ğ ş ç ö ü` tam dəstəklənir)
- Radiuslar minimal (2–6px) — arxitektural görünüş
- Breakpoint-lər PRD §115-ə uyğun: `< 640` / `640–1024` / `1024+` / `1440+`
- Fokus halları, `prefers-reduced-motion`, aria etiketləri və skip-link daxildir

### Qapı vizualı

Real məhsul fotoları olmadığı üçün qapılar `DoorVisual` komponenti ilə SVG qatlarından
qurulur: baza → panel naxışı → şüşə → dəstək → kilid → aksesuar. Bu, PRD §50-dəki
layer-based rendering yanaşmasının eyni ilə həyata keçirilməsidir — fotolar R2-yə
yüklənəndə komponentin daxili qatları `<image>` ilə əvəzlənəcək, xarici API dəyişməyəcək.

---

## Növbəti mərhələ

1. Cloudflare Workers + D1 + Prisma qurulumu
2. `src/mock/` → repository/service qatına keçid
3. Autentifikasiya və RBAC
4. Server-side pricing və sifariş axını
5. R2 + Cloudflare Images ilə real media
6. Turnstile, rate limiting, audit log
7. EN/RU məzmununun tamamlanması (i18n arxitekturası hazırdır)

---

## Lisenziya

Bu repozitoriya sifarişçi üçün hazırlanıb. Bütün hüquqlar qorunur.
