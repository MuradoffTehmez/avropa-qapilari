# Avropa Qapıları Satış və Təmir Platforması
## Product Requirements Document — PRD

**Sənəd versiyası:** 1.0  
**Platforma:** Web / PWA-ready  
**Əsas infrastruktur:** Cloudflare Developer Platform  
**Frontend:** Next.js + React + TypeScript  
**Runtime:** Cloudflare Workers  
**Database:** Cloudflare D1 + Prisma ORM  
**Object Storage:** Cloudflare R2  
**Image Pipeline:** Cloudflare Images  
**Cache/Config:** Cloudflare KV + Cache/CDN  
**Async Processing:** Cloudflare Queues  
**Durable Processes:** Cloudflare Workflows  
**Security:** Cloudflare WAF + Turnstile + Rate Limiting  
**AI mərhələsi:** Workers AI + Vectorize  
**Əsas bazar:** Azərbaycan  
**Əsas valyuta:** AZN  
**Dil arxitekturası:** AZ / EN / RU üçün hazır

---

# 1. Məhsulun məqsədi

Platformanın məqsədi Avropa istehsalı və Avropa standartlarına uyğun qapıların:

- onlayn təqdimatı;
- kataloqlaşdırılması;
- konfiqurasiyası;
- rəng seçimi;
- ölçü seçimi;
- aksesuar seçimi;
- qiymət hesablanması;
- sifarişi;
- qiymət təklifi alınması;
- ölçü ustasının sifarişi;
- çatdırılması;
- quraşdırılması;
- təmiri;
- zəmanət idarəsi;
- servis tarixçəsinin saxlanması

üçün vahid rəqəmsal ekosistem yaratmaqdır.

Platforma yalnız e-commerce mağazası kimi deyil, aşağıdakı model əsasında hazırlanmalıdır:

**Door Commerce + Door Configurator + Installation + Repair + Warranty + CRM Platform**

---

# 2. Məhsul vizyonu

İstifadəçi sayt daxilində bütün prosesi yerinə yetirə bilməlidir:

**Qapını tap → müqayisə et → konfiqurasiya et → rəng seç → ölçü seç → qiyməti gör → ölçü ustası çağır → sifariş et → quraşdırmanı seç → sifarişi izlə → zəmanətini gör → gələcəkdə təmir sifariş et.**

Uzunmüddətli məqsəd şirkətin qapı ilə bağlı bütün müştəri münasibətlərini bu sistem üzərindən idarə etməsidir.

---

# 3. Məhsulun əsas fərqləndirici xüsusiyyətləri

Platformanın əsas üstünlükləri:

1. interaktiv qapı konfiquratoru;
2. daxili və xarici rənglərin ayrıca seçilməsi;
3. qapının real vaxt vizual preview-u;
4. custom ölçü;
5. dinamik qiymət hesablanması;
6. smart lock və aksesuar konfiqurasiyası;
7. onlayn qiymət təklifi;
8. ölçü ustası sifarişi;
9. quraşdırma sifarişi;
10. qapı təmiri üçün ayrıca workflow;
11. usta idarəetmə sistemi;
12. zəmanət sistemi;
13. qapı serial nömrəsi;
14. QR əsaslı servis məlumatı;
15. bütün servis tarixçəsinin saxlanılması;
16. sonrakı mərhələdə AI qapı məsləhətçisi;
17. sonrakı mərhələdə 3D/AR preview.

---

# 4. Əsas istifadəçi qrupları

## 4.1. Anonim istifadəçi

Qeydiyyat olmadan:

- kataloqa baxır;
- axtarış edir;
- filter istifadə edir;
- məhsullara baxır;
- qapı konfiqurasiya edir;
- qiymət görür;
- məhsulları müqayisə edir;
- WhatsApp vasitəsilə əlaqə saxlayır;
- qiymət təklifi istəyir;
- təmir müraciəti yaradır;
- ölçü sifariş edir;
- səbət yaradır.

---

## 4.2. Qeydiyyatdan keçmiş müştəri

Əlavə olaraq:

- favorilər;
- saxlanmış konfiqurasiyalar;
- sifariş tarixçəsi;
- təmir tarixçəsi;
- ölçü sifarişləri;
- zəmanətlər;
- ünvanlar;
- bildirişlər;
- rəylər;
- invoice/sənədlər;
- servis tarixçəsi

idarə edə bilir.

---

## 4.3. Redaktor

İdarə edə bilər:

- məhsul məzmunu;
- şəkillər;
- kateqoriyalar;
- blog;
- FAQ;
- layihələr;
- SEO məlumatları.

Maliyyə, istifadəçi rolları və kritik sistem parametrlərini görməməlidir.

---

## 4.4. Admin

İdarə edir:

- məhsullar;
- sifarişlər;
- müştərilər;
- təmir;
- ustalar;
- appointment;
- stok;
- qiymətlər;
- endirimlər;
- CMS;
- rəylər.

---

## 4.5. Super Admin

Bütün platformaya tam giriş:

- RBAC;
- admin hesabları;
- sistem konfiqurasiyası;
- security;
- integration;
- audit log;
- API;
- pricing engine;
- payment;
- Cloudflare-related application settings.

---

## 4.6. Usta / Technician

Gələcək və ya ikinci mərhələ:

- ona təyin olunmuş işləri görür;
- status dəyişir;
- ünvana baxır;
- müştəri ilə əlaqə saxlayır;
- işə başlama statusu verir;
- foto əlavə edir;
- istifadə etdiyi ehtiyat hissələrini qeyd edir;
- işi tamamlayır.

---

# 5. Cloudflare arxitekturası

Cloudflare 2026-cı il sənədlərində yeni Next.js tətbiqlərini Workers üzərində yerləşdirmək üçün `vinext` yolunu tövsiyə edir; mövcud OpenNext tətbiqləri də dəstəklənməyə davam edir.

Arxitektura:

```text
                       USER
                         │
                         ▼
              Cloudflare Global Network
                         │
        ┌────────────────┴────────────────┐
        │                                 │
       WAF                            CDN / Cache
        │                                 │
        └────────────────┬────────────────┘
                         ▼
                Cloudflare Workers
             Next.js / vinext Runtime
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
         D1             R2              KV
      Database       Media/files     Config/cache
          │              │
          │         Cloudflare Images
          │
          ├──────────── Queues
          │
          ├──────────── Workflows
          │
          ├──────────── Workers AI
          │
          └──────────── Vectorize
```

---

# 6. Cloudflare xidmətlərinin vəzifələri

## 6.1. Cloudflare Workers

Əsas application runtime.

İdarə edəcək:

- Next.js server rendering;
- Server Components;
- API routes;
- Server Actions;
- authentication;
- authorization;
- business logic;
- configurator;
- checkout;
- admin API;
- webhook processing;
- D1/R2/KV bindings.

Workers Cloudflare bindings vasitəsilə D1, R2, KV, Queues, Durable Objects, AI və digər resurslara birbaşa çıxış verir.

---

# 7. Next.js arxitekturası

Tövsiyə:

```text
Next.js
React
TypeScript
App Router
Server Components
Server Actions
Route Handlers
Zod
React Hook Form
Zustand
Tailwind CSS
shadcn/ui
```

Yeni layihə olduğu üçün deployment layer:

```text
Next.js
   ↓
vinext
   ↓
Cloudflare Workers
```

olaraq planlaşdırılmalıdır.

---

# 8. Cloudflare D1

Əsas relational database D1 olacaq.

D1:

- serverless SQL database-dir;
- SQLite semantikasına əsaslanır;
- Workers ilə native binding istifadə edə bilir;
- Prisma ORM tərəfindən dəstəklənir.

Əsas məlumatlar:

```text
Users
Products
Categories
Brands
Options
Configurations
Orders
Repair Requests
Appointments
Technicians
Reviews
Inventory
Warranties
SEO
CMS
```

D1 daxilində saxlanmalıdır.

---

# 9. Prisma ORM

ORM:

```text
Prisma ORM
```

olacaq.

İstifadə məqsədi:

- schema;
- type safety;
- relation;
- migration;
- query abstraction;
- repository/service layer.

Cloudflare D1 Prisma tərəfindən rəsmi dəstəklənir və Workers-dan Prisma vasitəsilə sorğu icra edilə bilir.

---

# 10. D1 read replication strategiyası

Public kataloq read-heavy olacaq:

```text
category
product
brand
SEO
blog
FAQ
project
```

kimi sorğular D1 Read Replication-dan faydalana bilər.

Read Replication aktivləşdirildikdə D1 Sessions API vasitəsilə sequential consistency təmin edilə bilər.

Public read:

```text
first-unconstrained
```

tipli session istifadə edə bilər.

Kritik read-after-write əməliyyatları:

```text
checkout
inventory
payment
order status
admin update
```

üçün:

```text
first-primary
```

və ya bookmark əsaslı session istifadə edilməlidir.

---

# 11. D1 transaction strategiyası

Checkout zamanı:

```text
Order
OrderItems
Payment attempt
Inventory reservation
Audit event
```

məlumatları mümkün qədər atomik əməliyyat kimi yazılmalıdır.

D1 `batch()` daxilində SQL statement-ləri transaction kimi icra edir və ardıcıllıq daxilində failure olduqda sequence rollback edilə bilir.

Critical transaction layer ayrıca repository/service səviyyəsində dizayn edilməlidir.

---

# 12. Cloudflare R2

R2 saxlayacaq:

- məhsul original şəkilləri;
- configurator layer şəkilləri;
- texture-lar;
- məhsul videoları;
- repair foto/video;
- technician foto;
- project portfolio;
- invoice PDF;
- warranty sənədləri;
- manual PDF;
- sertifikat;
- 3D asset;
- gələcək AR asset.

R2 S3-compatible object storage-dır və egress haqqı tətbiq etmir.

---

# 13. R2 bucket strukturu

```text
door-platform-production/

products/
    {productId}/
        originals/
        gallery/
        thumbnails/
        configurator/

brands/
categories/

configurator/
    colors/
    textures/
    handles/
    glass/
    locks/

repairs/
    {requestId}/

projects/
    {projectId}/

users/
    {userId}/

technicians/
    {technicianId}/

documents/
    warranties/
    invoices/
    certificates/
```

Public və private asset-lər ayrılmalıdır.

---

# 14. Cloudflare Images

R2-dəki original media Cloudflare Images vasitəsilə:

- resize;
- crop;
- compression;
- responsive delivery;
- AVIF;
- WebP;
- thumbnail;
- product card;
- gallery;
- hero

formatlarında təqdim ediləcək.

Cloudflare Images R2 kimi xarici storage-dakı şəkilləri transform və optimize edə bilir.

Original şəkilin 5 ayrı versiyasını R2-də fiziki olaraq saxlamaq əvəzinə dynamic transformations istifadə olunmalıdır.

---

# 15. Cloudflare KV

KV yalnız yüksək read və aşağı write tələbi olan məlumat üçün istifadə edilməlidir.

Misal:

```text
site settings
navigation
feature flags
filter metadata
popular categories
configuration dictionary
public cached lookups
rate-limit helper data
```

Amma aşağıdakılar KV-də authoritative məlumat kimi saxlanmamalıdır:

```text
order
payment
stock
repair state
financial information
```

Çünki Workers KV eventually consistent-dir və dəyişikliklərin digər regionlarda görünməsi gecikə bilər.

---

# 16. Cloudflare Cache/CDN

Cache edilə bilər:

```text
public product detail
category pages
brand pages
blog
FAQ
project pages
navigation
public search suggestions
```

Cache edilməməlidir:

```text
/account/*
/admin/*
/checkout/*
/api/auth/*
/api/order/*
/api/payment/*
/api/repair/private/*
```

Session və şəxsi məlumat olan response-lar CDN cache-ə daxil edilməməlidir.

---

# 17. Cloudflare Queues

Queues aşağıdakılar üçün istifadə olunmalıdır:

```text
order.created
order.confirmed
repair.created
appointment.created
email.send
notification.send
image.process
inventory.low
review.request
search.index.update
analytics.event
```

Cloudflare Queues asinxron message processing üçün producer/consumer modeli təqdim edir.

Məsələn:

```text
Checkout
   ↓
Order DB-yə yazılır
   ↓
Queue: order.created
   ↓
Email consumer
   ↓
Admin notification
   ↓
Analytics
```

Beləliklə istifadəçi checkout zamanı email göndərilməsini gözləmir.

---

# 18. Cloudflare Workflows

Workflows uzun və retry tələb edən proseslərdə istifadə olunmalıdır.

Cloudflare Workflows multi-step prosesin state-ni davamlı saxlayaraq retry və uzunmüddətli execution təmin edir.

İdeal workflow:

### Order lifecycle

```text
ORDER
 ↓
Payment
 ↓
Confirmation
 ↓
Supplier validation
 ↓
Preparation
 ↓
Installation scheduling
 ↓
Delivery
 ↓
Installation
 ↓
Warranty creation
 ↓
Review request
```

### Repair workflow

```text
Request
 ↓
Review
 ↓
Technician assignment
 ↓
Appointment
 ↓
Repair
 ↓
Parts check
 ↓
Completion
 ↓
Invoice
 ↓
Warranty / service record
```

---

# 19. Cloudflare Turnstile

Turnstile aşağıdakılarda istifadə olunmalıdır:

- login;
- signup;
- password reset;
- contact;
- repair form;
- measurement form;
- quote request;
- review;
- checkout-un riskli halları.

Turnstile browser-side challenge token yaradır və server tərəfindən validate edilməlidir.

Turnstile sadəcə frontend widget kimi qəbul edilməməlidir.

Server verification məcburi olacaq.

---

# 20. Cloudflare WAF

WAF aşağıdakı endpoint-ləri əlavə qoruyacaq:

```text
/api/*
/admin/*
/auth/*
/checkout/*
/webhooks/*
```

Strategiya:

- managed rules;
- custom rules;
- rate limiting;
- suspicious bots;
- abnormal POST traffic;
- login brute force;
- API abuse.

Turnstile + WAF layered security kimi istifadə ediləcək.

---

# 21. Workers AI — gələcək mərhələ

Cloudflare Workers AI serverless GPU inference təqdim edir.

İstifadə ediləcək:

### AI Door Assistant

İstifadəçi:

> Mənzil üçün maksimum 1500 AZN-lik, səs izolyasiyası güclü, tünd rəngli qapı istəyirəm.

Sistem uyğun məhsulları tapacaq.

### AI Repair Assistant

İstifadəçi:

> Qapı bağlananda aşağıdan yerə sürtür.

AI ilkin ehtimal yarada bilər:

- hinge alignment;
- frame deformation;
- door sag.

AI heç vaxt professional servis qiymətləndirilməsini əvəz etməməlidir.

---

# 22. Vectorize

Vectorize gələcək semantic search və recommendation üçün istifadə edilə bilər.

Cloudflare Vectorize embedding-ləri saxlayaraq similarity search, recommendation və semantic search ssenarilərini dəstəkləyir.

Məsələn:

```text
"minimalist qara villa qapısı"
```

axtarışı sadəcə keyword deyil, semantik uyğunluğa görə nəticə qaytara bilər.

---

# 23. Sayt informasiya arxitekturası

```text
/
├── qapilar
│   ├── giris-qapilari
│   ├── daxili-qapilar
│   ├── villa-qapilari
│   ├── metal-qapilar
│   ├── zirehli-qapilar
│   ├── smart-qapilar
│   └── ...
│
├── qapi
│   └── [slug]
│
├── configurator
│
├── brands
│   └── [slug]
│
├── services
│   ├── repair
│   ├── installation
│   ├── measurement
│   └── maintenance
│
├── repair
│
├── measurement
│
├── projects
├── about
├── blog
├── faq
├── contact
│
├── favorites
├── compare
├── cart
├── checkout
│
└── account
    ├── profile
    ├── orders
    ├── configurations
    ├── repairs
    ├── appointments
    ├── favorites
    ├── addresses
    ├── warranties
    └── notifications
```

---

# 24. Multi-language URL

Arxitektura başlanğıcdan locale-ready olmalıdır:

```text
/az/
/en/
/ru/
```

Məsələn:

```text
/az/qapilar
/en/doors
/ru/dveri
```

DB translation data ayrıca saxlanmalıdır.

---

# 25. Ana səhifə

Homepage aşağıdakı ardıcıllıqla qurulmalıdır.

## 25.1 Header

Desktop:

```text
LOGO

Qapılar
Konfiqurator
Xidmətlər
Təmir
Layihələr
Haqqımızda
Əlaqə

Search
Favorites
Account
Cart
```

Mobile:

```text
☰       LOGO       🛒
```

---

# 26. Hero section

Hero premium, böyük vizual və sadə CTA təqdim etməlidir.

Məsələn:

```text
AVROPA KEYFİYYƏTİ
EVİNİZİN GİRİŞİNDƏN BAŞLAYIR

Premium təhlükəsizlik və interyer qapıları.

[ Qapını seç ]

[ Konfiqurasiya et ]
```

İkinci CTA:

```text
Ölçü ustası çağır
```

---

# 27. Kateqoriyalar

Visual category cards:

```text
Giriş qapıları
Villa qapıları
Otaq qapıları
Təhlükəsizlik qapıları
Smart qapılar
Şüşəli qapılar
```

---

# 28. Homepage Configurator CTA

İnteraktiv:

```text
QAPINIZI YARADIN

1 Model
2 Ölçü
3 Rəng
4 Kilid
5 Aksesuar
```

CTA:

**Konfiqurasiyaya başla**

---

# 29. Featured products

Card:

```text
[IMAGE]

Milano Security 720

RC3 Security
42 dB
Made in Europe

1 450 AZN-dən

♡     Müqayisə

[Ətraflı]
```

---

# 30. Xidmət bölməsi

```text
Ölçü
Çatdırılma
Quraşdırma
Təmir
Zəmanət
```

---

# 31. Repair CTA

```text
QAPINIZDA PROBLEM VAR?

Kilid, menteşə, çərçivə,
smart lock və digər problemlər.

[Usta çağır]
```

---

# 32. Projects / Portfolio

Real quraşdırılmış qapılar:

```text
Mərdəkan Villa
Milano 720
RAL 7016

Before / After
```

---

# 33. Brands

Avropa markalarının logo carousel/grid strukturu.

Hər brand üçün ayrıca SEO səhifəsi.

---

# 34. Reviews

Yalnız təsdiqlənmiş və ya admin moderation-dan keçmiş rəylər.

---

# 35. FAQ

Məsələn:

- qapının ölçüsü necə götürülür?
- çatdırılma neçə gün çəkir?
- quraşdırma qiymətə daxildir?
- zəmanət neçə ildir?
- custom ölçü mümkündür?
- qapının sağ/sol açılması necə müəyyən edilir?

---

# 36. Footer

```text
Products
Services
Company
Support
Legal

Address
Phone
WhatsApp
Email

Instagram
Facebook
TikTok

Privacy
Terms
Cookies
Warranty
Delivery
Returns
```

---

# 37. Məhsul kataloqu

Kataloq:

```text
/qapilar
```

Features:

- grid/list;
- sort;
- filter;
- pagination/infinite load;
- SEO-friendly URLs;
- mobile filter drawer.

---

# 38. Filter sistemi

Filterlər:

### Məhsul

- kateqoriya;
- subcategory;
- brand;
- collection.

### Qiymət

- min;
- max.

### Texniki

- material;
- security class;
- fire rating;
- sound insulation;
- thermal insulation.

### Dizayn

- rəng;
- stil;
- texture;
- glass;
- surface.

### Ölçü

- width;
- height;
- custom size.

### Açılma

- left;
- right;
- inward;
- outward.

### Digər

- stock;
- made-to-order;
- sale;
- smart lock;
- installation available.

---

# 39. Sort

```text
Ən populyar
Yeni
Qiymət: ucuzdan bahaya
Qiymət: bahadan ucuza
Ən yüksək reytinq
Endirim
```

---

# 40. Search

Search:

- product name;
- SKU;
- category;
- brand;
- color;
- feature.

Autocomplete:

```text
mila...

Products
Milano 720
Milano Glass

Categories
Milano Collection
```

---

# 41. Məhsul detail page

Desktop:

```text
┌─────────────────────┬─────────────────────────────┐
│                     │ Milano Security 720         │
│                     │                             │
│      GALLERY        │ ★ 4.8                       │
│                     │                             │
│                     │ 1 450 AZN-dən               │
│                     │                             │
│                     │ RC3                         │
│                     │ 42 dB                       │
│                     │                             │
│                     │ [Konfiqurasiya et]          │
│                     │ [Səbətə əlavə et]           │
└─────────────────────┴─────────────────────────────┘
```

---

# 42. Məhsul səhifəsində məlumatlar

- product name;
- SKU;
- brand;
- gallery;
- video;
- starting price;
- availability;
- delivery estimate;
- installation availability;
- warranty;
- material;
- dimensions;
- sound insulation;
- thermal properties;
- security class;
- fire rating;
- certificates;
- description.

---

# 43. Məhsul tab/section-ları

```text
Overview
Technical Specifications
Dimensions
Colors
Locks
Installation
Delivery
Warranty
Documents
Reviews
FAQ
```

---

# 44. Product documents

Download:

- technical sheet;
- certificate;
- installation instructions;
- warranty document.

Files R2-də saxlanmalıdır.

---

# 45. Favorilər

Anonymous user:

local state.

Registered user:

D1.

Login olduqdan sonra local favorites server favorites ilə merge edilməlidir.

---

# 46. Product comparison

Maximum:

**4 məhsul**

Müqayisə:

| Xüsusiyyət | Door A | Door B | Door C |
|---|---|---|---|
| Price | | | |
| Material | | | |
| Security | | | |
| Sound | | | |
| Thermal | | | |
| Fire | | | |
| Warranty | | | |
| Smart Lock | | | |
| Custom Size | | | |

---

# 47. Door Configurator

Configurator platformanın əsas modulu olacaq.

URL:

```text
/configurator
/configurator/[productSlug]
```

---

# 48. Configurator mərhələləri

```text
STEP 1
Qapı növü

STEP 2
Model

STEP 3
Ölçü

STEP 4
Açılma istiqaməti

STEP 5
Xarici rəng

STEP 6
Daxili rəng

STEP 7
Frame

STEP 8
Glass

STEP 9
Handle

STEP 10
Lock

STEP 11
Smart Lock

STEP 12
Accessories

STEP 13
Installation

STEP 14
Delivery

STEP 15
Summary
```

---

# 49. Configurator UI

Desktop:

```text
┌───────────────────────────────────────────┐
│                                           │
│            DOOR PREVIEW                   │
│                                           │
│                                           │
├───────────────────────┬───────────────────┤
│ Config Options        │ Order Summary     │
│                       │                   │
│ Colors                │ Door 1400         │
│ Locks                 │ Lock +200         │
│ Handles               │ Install +100      │
│                       │                   │
│                       │ TOTAL 1700 AZN    │
└───────────────────────┴───────────────────┘
```

Mobile:

```text
Preview

↓
Options

↓
Sticky Price

1 700 AZN
[Continue]
```

---

# 50. Configurator preview

MVP-də 3D yerinə:

**layer-based rendering** istifadə edilməlidir.

```text
base
+
outside color
+
inside color
+
glass
+
handle
+
lock
+
accessories
```

R2:

```text
configurator/{productId}/
    base.webp
    frame.webp
    handle-black.webp
    glass-01.webp
```

---

# 51. Configurator option system

OptionGroup:

```text
SIZE
OUTSIDE_COLOR
INSIDE_COLOR
FRAME
GLASS
HANDLE
LOCK
SMART_LOCK
OPENING_DIRECTION
ACCESSORY
INSTALLATION
```

OptionValue:

```text
RAL 7016
White
Golden Oak
Premium Black
Smart Lock X2
```

---

# 52. Variant explosion qadağası

Aşağıdakılar ayrıca məhsul yaradılmamalıdır:

```text
Milano White
Milano Black
Milano RAL7016
Milano Smart
Milano Glass
```

Bir product:

```text
Milano Security 720
```

və onun configurable option-ları olmalıdır.

---

# 53. Pricing Engine

Formula:

```text
Final Price =
Base Price
+ Size Modifier
+ Color Modifier
+ Material Modifier
+ Glass Modifier
+ Handle Modifier
+ Lock Modifier
+ Accessory Price
+ Installation
+ Delivery
- Discount
```

---

# 54. Price rule

PriceRule:

```text
type
condition
amount
priority
validFrom
validTo
```

Məsələn:

```text
IF width > 1000
ADD 150 AZN
```

və ya:

```text
IF outsideColor = RAL7016
ADD 50 AZN
```

---

# 55. Custom ölçü

İstifadəçi:

```text
Width
Height
```

daxil edir.

Allowed:

```text
minWidth
maxWidth
minHeight
maxHeight
```

Məhdudiyyət pozularsa:

> Bu ölçü üçün fərdi qiymət təklifi tələb olunur.

CTA:

**Qiymət təklifi al**

---

# 56. Configuration save

Registered user:

**Konfiqurasiyanı saxla**

Configuration ID:

```text
CFG-26-XXXXXXXX
```

Sonradan istifadəçi eyni konfiqurasiyanı yenidən aça bilər.

---

# 57. Share configuration

Link:

```text
/configuration/CFG-XXXX
```

Müştəri dizaynı:

- ailəsinə;
- dizaynerə;
- memara;
- şirkət əməkdaşına

göndərə bilər.

Private information linkdə olmamalıdır.

---

# 58. Cart

Cart item sadəcə product deyil.

```text
Product
+
Configuration Snapshot
```

olmalıdır.

Cart item:

```text
Milano Security 720

960x2050
RAL7016
White Interior
Premium Black Handle
Smart Lock X2
Right / Inward

Quantity 1

1 850 AZN
```

---

# 59. Cart persistence

Anonymous:

signed cookie/local state.

Registered:

D1 Cart.

Login zamanı cart merge edilməlidir.

---

# 60. Checkout

Checkout:

### Customer

- name;
- surname;
- email;
- phone.

### Address

- city;
- district;
- street;
- building;
- apartment;
- floor;
- note.

### Delivery

- pickup;
- delivery.

### Installation

- yes;
- no.

### Payment

provider abstraction.

### Confirmation

order summary.

---

# 61. Payment architecture

Payment provider hard-coded edilməməlidir.

Interface:

```text
PaymentProvider
```

məsələn:

```text
createPayment()
verifyPayment()
refundPayment()
handleWebhook()
```

Beləliklə gələcəkdə Azərbaycan payment provider-i dəyişdirilə bilər.

---

# 62. Order numbering

```text
ORD-2026-000001
```

Daxili primary ID public şəkildə göstərilməməlidir.

---

# 63. Order status

```text
DRAFT
PENDING_PAYMENT
PAID
CONFIRMED
PROCESSING
MANUFACTURING
READY
SHIPPED
DELIVERED
INSTALLATION_SCHEDULED
INSTALLED
COMPLETED
CANCELLED
REFUNDED
```

---

# 64. Order timeline

Account:

```text
✓ Sifariş yaradıldı
✓ Ödəniş təsdiqləndi
✓ Hazırlanır
● Çatdırılma hazırlanır
○ Quraşdırma
○ Tamamlandı
```

---

# 65. Order snapshot

Order verildikdə məhsul məlumatı snapshot kimi saxlanmalıdır.

Məsələn:

```json
{
  "productName": "Milano 720",
  "sku": "MIL-720",
  "width": 960,
  "height": 2050,
  "outsideColor": "RAL7016",
  "insideColor": "White",
  "lock": "Smart Lock X2",
  "handle": "Premium Black"
}
```

Sonradan məhsul dəyişdirilsə belə köhnə sifariş dəyişməməlidir.

---

# 66. Quote Request

Custom və yüksək qiymətli məhsullar üçün:

**Qiymət təklifi al**

Quote:

```text
QTE-2026-000001
```

Status:

```text
NEW
REVIEWING
PRICED
SENT
ACCEPTED
REJECTED
EXPIRED
CONVERTED
```

Quote bir kliklə Order-a çevrilə bilməlidir.

---

# 67. Ölçü ustası sifarişi

Form:

```text
Name
Phone
Address
Property Type
Door Count
Preferred Date
Preferred Time
Notes
```

Property:

```text
APARTMENT
VILLA
OFFICE
COMMERCIAL
OTHER
```

---

# 68. Measurement status

```text
NEW
CONFIRMED
TECHNICIAN_ASSIGNED
SCHEDULED
COMPLETED
CANCELLED
```

Usta ölçüləri admin paneldə qeyd edə bilər:

```text
width
height
frameDepth
openingDirection
notes
photos
```

---

# 69. Repair sistemi

URL:

```text
/services/repair
/repair/request
```

---

# 70. Repair categories

```text
LOCK
HANDLE
HINGE
FRAME
GLASS
ALIGNMENT
SMART_LOCK
INSULATION
DOOR_NOT_CLOSING
DOOR_NOT_OPENING
NOISE
DRAFT
DAMAGED_PANEL
OTHER
```

---

# 71. Repair wizard

STEP 1:

**Problem nədir?**

STEP 2:

**Qapının növü**

STEP 3:

**Problemi təsvir et**

STEP 4:

**Foto/video**

STEP 5:

**Ünvan**

STEP 6:

**Tarix/saat**

STEP 7:

**Əlaqə**

STEP 8:

**Təsdiq**

---

# 72. Repair media

Müştəri əlavə edə bilər:

- JPEG;
- PNG;
- WEBP;
- HEIC processing lazım olduqda;
- MP4.

Security:

- file type validation;
- MIME check;
- size limit;
- randomized object key;
- private bucket;
- signed access.

---

# 73. Repair status

```text
NEW
REVIEWING
QUOTE_REQUIRED
WAITING_CUSTOMER
SCHEDULED
TECHNICIAN_ASSIGNED
ON_THE_WAY
IN_PROGRESS
WAITING_FOR_PART
COMPLETED
CANCELLED
```

---

# 74. Technician

Technician profile:

```text
Name
Photo
Phone
Specialization
Service Areas
Working Hours
Status
Rating
Completed Jobs
```

---

# 75. Technician assignment

Admin:

```text
Repair #REP-00128

Assign Technician
▼
Ali Məmmədov
```

Assignment tarixçəsi Audit Log-da saxlanmalıdır.

---

# 76. Technician job interface

Mobil-first olmalıdır.

```text
Today's Jobs

09:00
REP-00128
Yasamal

[Start Route]

[Call]

[Open Job]
```

---

# 77. Technician repair completion

Usta qeyd edə bilər:

```text
Problem
Diagnosis
Work Performed
Parts Used
Labor Cost
Photos Before
Photos After
Customer Note
```

---

# 78. Appointment engine

Appointment modeli:

```text
MEASUREMENT
INSTALLATION
REPAIR
MAINTENANCE
CONSULTATION
```

Fields:

```text
date
startTime
endTime
technicianId
address
status
```

---

# 79. Appointment conflict

Eyni technician üçün overlap qadağandır.

Server validation məcburidir.

Frontend validation kifayət deyil.

---

# 80. Installation sistemi

Order daxilində:

```text
Installation Requested
```

olarsa ayrıca installation appointment yaranır.

Quraşdırma tamamlananda:

- technician;
- date;
- photos;
- notes;
- customer confirmation

saxlanılır.

---

# 81. Warranty sistemi

Qapı quraşdırıldıqdan sonra warranty avtomatik yaradıla bilər.

Warranty ID:

```text
WAR-2026-000001
```

Fields:

```text
product
order
serialNumber
installationDate
startDate
endDate
coverage
status
```

---

# 82. Serial Number

Hər qapıya unique:

```text
DR-2026-000001
```

verilə bilər.

Bu serial gələcək servis işlərini məhsulla əlaqələndirəcək.

---

# 83. QR sistemi

QR:

```text
/service/door/DR-2026-000001
```

Public QR nəticəsində şəxsi məlumat göstərilməməlidir.

Public:

```text
Model
Warranty status
Service phone
```

Authenticated technician/admin:

```text
Full configuration
Installation
Warranty
Repair history
Parts
```

görə bilər.

---

# 84. Service History

DoorAsset ayrıca entity kimi saxlanmalıdır.

Beləliklə sistem məhsulun bütün həyat dövrünü bilir:

```text
Sale
Installation
Warranty
Repair
Part Replacement
Maintenance
```

---

# 85. Customer account

Dashboard:

```text
Sifarişlər
Konfiqurasiyalar
Təmir
Appointment
Favorilər
Zəmanətlər
Bildirişlər
```

---

# 86. Customer profile

Fields:

```text
name
surname
email
phone
language
marketingConsent
```

---

# 87. Addresses

Bir user birdən çox ünvan saxlaya bilər.

```text
Home
Villa
Office
```

---

# 88. Authentication

Dəstəklənə bilər:

- email/password;
- email verification;
- Google OAuth;
- Apple gələcək mərhələ.

Session təhlükəsiz HTTP-only cookie vasitəsilə idarə edilməlidir.

---

# 89. Password security

- strong password hashing;
- rate limiting;
- reset token expiration;
- session rotation;
- login audit;
- compromised token invalidation.

Plain password heç vaxt DB-də saxlanılmamalıdır.

---

# 90. Admin panel

URL:

```text
/admin
```

Public application-dan UI səviyyəsində tam ayrılmalıdır.

---

# 91. Admin sidebar

```text
Dashboard

Catalog
  Products
  Categories
  Brands
  Collections
  Configurator
  Colors
  Materials
  Options

Sales
  Orders
  Quotes
  Payments
  Discounts

Services
  Repairs
  Measurements
  Installations
  Appointments

Team
  Technicians
  Admin Users
  Roles

Customers

Inventory
  Stock
  Parts
  Suppliers

Warranty

Reviews

Content
  Pages
  Projects
  Blog
  FAQ

Marketing
  SEO
  Campaigns
  Coupons

Analytics

Audit Logs

Settings
```

---

# 92. Admin Dashboard KPI

```text
Today's Revenue
Monthly Revenue
Orders
Average Order Value

Pending Orders

New Repair Requests
Active Repairs
Pending Installations

Appointments Today

Low Stock

Top Doors
Top Colors
Top Locks

Conversion Rate
Quote Conversion
```

---

# 93. RBAC

Permissions granular olmalıdır.

Format:

```text
resource.action
```

Məsələn:

```text
product.view
product.create
product.update
product.delete

order.view
order.update

repair.assign

user.manage

setting.manage
```

---

# 94. Role matrix

| Funksiya | Super Admin | Admin | Editor | Technician |
|---|---:|---:|---:|---:|
| Products | Full | Full | Edit | No |
| Orders | Full | Full | No | Assigned |
| Repairs | Full | Full | No | Assigned |
| Users | Full | Limited | No | No |
| Roles | Full | No | No | No |
| Settings | Full | Limited | No | No |
| CMS | Full | Full | Full | No |
| SEO | Full | Full | Edit | No |
| Audit | Full | View | No | No |

UI daxilində istifadəçinin icazəsi olmayan modul ümumiyyətlə göstərilməməlidir.

API səviyyəsində də ayrıca permission check aparılmalıdır.

---

# 95. Product Admin

Admin:

- product create;
- duplicate;
- draft;
- preview;
- publish;
- archive.

Fields:

```text
Name
Slug
SKU
Category
Brand
Collection
Base Price
Description
Technical Data
Warranty
SEO
Status
Featured
```

---

# 96. Configurator Admin

Admin interfeysindən:

```text
Product
↓
Available Colors
Available Sizes
Locks
Handles
Glass
Opening
Accessories
Price Modifiers
Compatibility
```

seçilə bilməlidir.

Kod dəyişmədən yeni option yaratmaq mümkün olmalıdır.

---

# 97. Compatibility engine

Bəzi option-lar bir-biri ilə uyğun olmaya bilər.

Məsələn:

```text
Glass A
```

+

```text
Lock X
```

uyğun deyil.

CompatibilityRule:

```text
IF option A
THEN exclude option B
```

və ya:

```text
IF Door = X
ALLOW only Handles Y,Z
```

---

# 98. Inventory

Stok iki səviyyədə düşünülməlidir:

### Product Stock

hazır qapılar.

### Component Stock

- handle;
- lock;
- smart lock;
- glass;
- spare part.

---

# 99. Inventory movement

Hər dəyişiklik ayrıca transaction:

```text
PURCHASE
SALE
RESERVATION
RELEASE
ADJUSTMENT
RETURN
REPAIR_USAGE
```

Inventory sadəcə `stock = 10` field-i olmamalıdır.

---

# 100. Inventory reservation

Checkout:

```text
AVAILABLE
   ↓
RESERVED
   ↓
SOLD
```

Payment fail:

```text
RESERVED
   ↓
RELEASED
```

---

# 101. Low-stock notification

Threshold:

```text
Smart Lock X2

stock = 3
minimum = 5
```

Queue event:

```text
inventory.low
```

Admin notification yaranmalıdır.

---

# 102. Supplier

Gələcək üçün:

```text
Supplier
SupplierProduct
PurchaseOrder
```

modelləri nəzərdə tutulmalıdır.

---

# 103. Review sistemi

Review yalnız:

- registered;
- və ya verified order

üçün aktiv edilə bilər.

Fields:

```text
rating
title
comment
media
status
```

Moderation:

```text
PENDING
APPROVED
REJECTED
```

---

# 104. Projects

Real quraşdırma portfolio-su.

Project:

```text
title
location
description
products
images
beforeAfter
completionDate
SEO
```

---

# 105. Blog

Content marketing:

- qapı seçimi;
- ölçü;
- təhlükəsizlik;
- smart lock;
- dizayn;
- servis;
- zəmanət.

---

# 106. CMS

Admin tərəfindən aşağıdakılar redaktə edilə bilməlidir:

```text
Homepage sections
About
Contact
Services
Delivery
Warranty
Privacy
Terms
```

---

# 107. SEO sistemi

Hər indexable entity:

```text
seoTitle
seoDescription
canonicalUrl
ogTitle
ogDescription
ogImage
robots
```

saxlaya bilməlidir.

---

# 108. Structured Data

İstifadə edilməlidir:

```text
Organization
LocalBusiness
Product
Offer
AggregateRating
Review
Service
BreadcrumbList
Article
FAQPage
```

Data səhifədə olan faktiki məlumatla uyğun olmalıdır.

---

# 109. Sitemap

Dynamic:

```text
/sitemap.xml
```

və lazım olduqda partition:

```text
/sitemap-products.xml
/sitemap-categories.xml
/sitemap-blog.xml
```

---

# 110. robots.txt

Dynamic configuration imkanı.

Admin səhifələri:

```text
Disallow: /admin/
```

Indexation yalnız auth security əvəzi kimi qəbul edilməməlidir.

---

# 111. Canonical

Duplicate filter URL-ləri SEO problemi yaratmamalıdır.

Filter query-lərin böyük hissəsi:

```text
noindex
```

və canonical əsas category-yə göstərilə bilər.

---

# 112. Performance tələbləri

Target:

```text
LCP ≤ 2.5 s
INP ≤ 200 ms
CLS ≤ 0.1
```

Public route-larda JS mümkün qədər aşağı saxlanmalıdır.

Server Components default yanaşma olmalıdır.

Client Components yalnız interaktiv hissədə istifadə edilməlidir.

---

# 113. Image performance

- responsive sizes;
- lazy loading;
- hero preload;
- AVIF/WebP;
- fixed aspect ratio;
- Cloudflare Images;
- R2 original.

Cloudflare Images eyni original asset-dən cihaz və breakpoint üçün dinamik optimized versiyalar yarada bilir.

---

# 114. Mobile-first

Mobil frontend desktop-un sıxılmış forması olmayacaq.

Xüsusilə:

- filter;
- configurator;
- cart;
- checkout;
- repair;
- technician panel

mobil üçün ayrıca interaction pattern istifadə etməlidir.

---

# 115. Responsive breakpoint strategy

Təxminən:

```text
mobile
< 640

tablet
640–1024

desktop
1024+

large desktop
1440+
```

Content maksimum genişliyi məhdudlaşdırılmalıdır.

---

# 116. Design System

Premium architectural görünüş.

Palette:

```text
White
Off-white
Graphite
Dark Grey
Black
```

Accent brand rəngi ayrıca müəyyən edilməlidir.

---

# 117. Typography

Modern sans-serif:

- high readability;
- strong headings;
- generous spacing.

Türk/Azərbaycan xüsusi simvollarını tam dəstəkləməlidir:

```text
ə
ı
İ
ğ
ş
ç
ö
ü
```

---

# 118. Accessibility

Minimum:

WCAG 2.2 AA hədəfi.

- keyboard navigation;
- focus states;
- labels;
- contrast;
- alt;
- aria;
- reduced motion;
- error messages.

---

# 119. Search architecture — MVP

İlk mərhələdə D1:

- indexed SQL;
- FTS5

istifadə edə bilər.

D1 SQLite mühərriki FTS5 full-text search extension dəstəkləyir.

---

# 120. Search Phase 3

Semantic search:

```text
Workers AI
+
Vectorize
```

---

# 121. Notifications

Channels:

```text
In-app
Email
Future: Web Push
Future: SMS
```

---

# 122. Notification events

```text
ORDER_CREATED
ORDER_PAID
ORDER_STATUS_CHANGED

QUOTE_READY

REPAIR_CREATED
REPAIR_ASSIGNED
REPAIR_SCHEDULED
REPAIR_COMPLETED

APPOINTMENT_REMINDER

WARRANTY_EXPIRING
```

---

# 123. Notification preference

User:

```text
Order emails      ON
Repair emails     ON
Marketing         OFF
Push              ON
```

seçə bilməlidir.

Transactional notification marketing preference-dən ayrılmalıdır.

---

# 124. Email

Email provider abstraction:

```text
EmailService
```

Bu, platformanı yalnız bir provider-ə bağlamamalıdır.

Queue vasitəsilə göndərilməsi tövsiyə olunur.

---

# 125. WhatsApp

Məhsul:

**WhatsApp ilə soruş**

Generated text:

```text
Salam.

Milano Security 720 modeli ilə maraqlanıram.

Konfiqurasiya:
960x2050
RAL 7016
Smart Lock X2

Link:
...
```

---

# 126. Analytics event architecture

Frontend event:

```text
product_view
category_view
search
filter_used
configuration_started
configuration_completed
add_to_cart
checkout_started
quote_requested
repair_requested
order_completed
```

---

# 127. Business KPI

Əsas KPI:

```text
Product → Configurator Rate

Configurator Completion Rate

Configurator → Cart

Cart → Checkout

Checkout → Order

Quote Conversion Rate

Repair Conversion Rate

Average Order Value

Repeat Customer Rate

Average Repair Resolution Time
```

---

# 128. Audit Log

Kritik admin əməliyyatı qeydə alınmalıdır.

```text
actor
action
resource
resourceId
before
after
ip
userAgent
timestamp
```

Məsələn:

```text
ADMIN_12
ORDER_STATUS_CHANGE
ORD-120
PAID → CANCELLED
```

---

# 129. Security principles

- deny by default;
- server-side authorization;
- validation;
- prepared queries/ORM;
- no client-trusted prices;
- no client-trusted permissions;
- secure cookies;
- secrets only Workers Secrets;
- sensitive R2 objects private;
- CSRF protection;
- Turnstile;
- rate limits;
- CSP;
- security headers.

---

# 130. Price security

Frontend-dən:

```json
{
 "price": 100
}
```

gəlsə belə bu qəbul edilməməlidir.

Server:

```text
product
+
selected options
+
price rules
```

əsasında qiyməti yenidən hesablamalıdır.

---

# 131. File upload security

Server validate:

- MIME;
- extension;
- max size;
- dimensions;
- ownership;
- access policy.

User filename object key kimi birbaşa istifadə edilməməlidir.

---

# 132. API conventions

Base:

```text
/api/v1/
```

Public:

```text
GET /products
GET /products/:slug
GET /categories
GET /brands
```

Configurator:

```text
POST /configurations
PATCH /configurations/:id
POST /configurations/:id/calculate
```

Cart:

```text
GET /cart
POST /cart/items
PATCH /cart/items/:id
DELETE /cart/items/:id
```

---

# 133. Order API

```text
POST /orders
GET /orders/:id
POST /orders/:id/payment
```

Webhook:

```text
POST /webhooks/payment/:provider
```

---

# 134. Service API

```text
POST /repairs
GET /repairs/:id

POST /measurements

POST /appointments
GET /appointments/availability
```

---

# 135. Admin API

```text
/admin/api/v1/products
/admin/api/v1/orders
/admin/api/v1/repairs
/admin/api/v1/technicians
```

Hər endpoint ayrıca RBAC-dan keçməlidir.

---

# 136. API response format

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Məlumat düzgün deyil",
    "fields": {}
  }
}
```

---

# 137. Idempotency

Kritik əməliyyat:

```text
order creation
payment
refund
webhook
```

idempotent olmalıdır.

Header:

```text
Idempotency-Key
```

dəstəklənə bilər.

---

# 138. Prisma / D1 əsas data modeli

Əsas modellər:

```text
User
UserSession
Address

Role
Permission
RolePermission
UserRole

Brand
Category
Product
ProductTranslation
ProductMedia
ProductSpecification

OptionGroup
OptionValue
ProductOption
CompatibilityRule
PriceRule

DoorConfiguration
ConfigurationChoice

Favorite

Cart
CartItem

Order
OrderItem
OrderStatusHistory

Payment
Refund

Quote
QuoteItem

Technician
TechnicianSkill
ServiceArea

Appointment

RepairRequest
RepairMedia
RepairStatusHistory
RepairPart

MeasurementRequest

InventoryItem
InventoryMovement

Warranty
DoorAsset
ServiceHistory

Review

Project
ProjectMedia

BlogPost
FAQ
Page

Coupon
Promotion

Notification
NotificationPreference

AuditLog

SiteSetting
SeoMetadata
```

---

# 139. User model

```prisma
model User {
  id              String   @id @default(cuid())
  email           String?  @unique
  phone           String?  @unique
  firstName       String?
  lastName        String?

  emailVerifiedAt DateTime?
  phoneVerifiedAt DateTime?

  status          UserStatus @default(ACTIVE)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

# 140. Product

```prisma
model Product {
  id             String @id @default(cuid())

  name           String
  slug           String @unique
  sku            String @unique

  categoryId     String
  brandId        String?

  basePriceMinor Int

  active         Boolean @default(true)
  featured       Boolean @default(false)

  customSize     Boolean @default(false)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

Qiymətlər floating-point deyil:

```text
1850.50 AZN
```

əvəzinə:

```text
185050 qəpik
```

kimi integer minor units ilə saxlana bilər.

Bu maliyyə hesablamalarında precision problemlərini azaldır.

---

# 141. Product translations

```prisma
model ProductTranslation {
  id          String @id @default(cuid())

  productId   String
  locale      String

  name        String
  description String?
  shortText   String?

  @@unique([productId, locale])
}
```

---

# 142. Category

Tree:

```text
Entrance Doors
   ├── Security
   ├── Thermal
   └── Smart
```

Self relation istifadə olunmalıdır.

---

# 143. ProductMedia

```text
IMAGE
VIDEO
DOCUMENT
MODEL_3D
CONFIG_LAYER
```

Metadata:

```text
r2Key
alt
width
height
sort
```

---

# 144. ProductSpecification

Dynamic specification sistemi:

```text
Security Class → RC3
Sound Insulation → 42 dB
Material → Steel
```

Admin yeni specification əlavə edə bilməlidir.

---

# 145. OptionGroup

```prisma
model OptionGroup {
  id        String @id @default(cuid())
  key       String @unique
  name      String
  sortOrder Int @default(0)
}
```

---

# 146. OptionValue

```prisma
model OptionValue {
  id          String @id @default(cuid())

  optionGroupId String

  code        String?
  name        String

  hex         String?
  ralCode     String?

  imageKey    String?
  textureKey  String?

  active      Boolean @default(true)
}
```

---

# 147. ProductOption

```prisma
model ProductOption {
  id           String @id @default(cuid())

  productId    String
  optionValueId String

  priceDeltaMinor Int @default(0)

  defaultOption Boolean @default(false)
  available     Boolean @default(true)

  @@unique([productId, optionValueId])
}
```

---

# 148. DoorConfiguration

```text
id
publicCode
userId?
productId

width
height
quantity

priceSnapshot

status
createdAt
updatedAt
```

---

# 149. ConfigurationChoice

Hər seçilmiş option ayrıca record.

Bu JSON-dan daha yaxşı relational filtering imkanı verir.

Order daxilində isə final configuration JSON snapshot əlavə saxlanıla bilər.

---

# 150. Cart

```text
Cart
  └ CartItem
       ├ product
       └ configuration
```

---

# 151. Order

Əsas:

```text
id
orderNumber
userId

status

subtotalMinor
discountMinor
deliveryMinor
installationMinor
totalMinor

currency

customer snapshot
address snapshot

createdAt
```

---

# 152. OrderItem

```text
productId?
productName
sku
configurationSnapshot
quantity
unitPriceMinor
totalMinor
```

---

# 153. Status history

Status sadəcə Order cədvəlində dəyişdirilməməlidir.

Əlavə:

```text
OrderStatusHistory
```

saxlanmalıdır.

---

# 154. Payment

```text
provider
providerReference
amount
currency
status
requestId
createdAt
paidAt
```

Payment data heç vaxt provider-dən gələn frontend redirect-ə əsasən təsdiqlənməməlidir.

Server-to-server verification/webhook istifadə edilməlidir.

---

# 155. RepairRequest

```text
repairNumber
user
doorAsset?
issueType
description
address
preferredDate
status
assignedTechnician
```

---

# 156. DoorAsset

Çox vacib domain modeli:

```text
DoorAsset
```

Bu artıq satılmış/quraşdırılmış fiziki qapını ifadə edir.

```text
serialNumber
productId
orderItemId
ownerUserId
configurationSnapshot
installationDate
warranty
```

---

# 157. Repair ilə DoorAsset

Əgər qapı platformadan alınıbsa:

```text
RepairRequest
   ↓
DoorAsset
   ↓
Order
```

əlaqəsi yaranır.

Beləliklə usta qapının dəqiq:

- modelini;
- rəngini;
- ölçüsünü;
- kilidini;
- quraşdırılma tarixini

görə bilir.

---

# 158. Inventory

```text
InventoryItem
InventoryMovement
```

InventoryItem:

```text
SKU
type
name
stock
reserved
reorderLevel
```

---

# 159. DB indexing

Minimum index:

```text
Product.slug
Product.sku
Product.categoryId
Product.brandId
Product.active

Order.orderNumber
Order.userId
Order.status
Order.createdAt

RepairRequest.repairNumber
RepairRequest.userId
RepairRequest.status

Appointment.technicianId
Appointment.date

DoorAsset.serialNumber
```

Search query-lərinə uyğun composite index-lər production metrics əsasında əlavə edilməlidir.

---

# 160. Soft delete

Financial və audit data hard delete edilməməlidir.

Məsələn:

```text
Order
Payment
Repair
Warranty
```

üçün:

```text
archivedAt
deletedAt
```

strategiyası istifadə oluna bilər.

---

# 161. Database migration

Prisma migrations:

```text
development
staging
production
```

environment-lərdə ayrı tətbiq edilməlidir.

Production DB migration CI/CD daxilində kontrollu şəkildə işlədilməlidir.

---

# 162. Environment strategiyası

```text
development
staging
production
```

Cloudflare resources ayrı olmalıdır.

Məsələn:

```text
door-db-dev
door-db-staging
door-db-production
```

Eyni prinsip:

- R2;
- KV;
- Queues.

---

# 163. Secrets

Heç vaxt repository-də saxlanılmamalıdır.

Workers Secrets:

```text
AUTH_SECRET
PAYMENT_SECRET
EMAIL_SECRET
TURNSTILE_SECRET
WEBHOOK_SECRET
```

---

# 164. CI/CD

GitHub Actions:

```text
pull_request
   ↓
Install
   ↓
Typecheck
   ↓
Lint
   ↓
Unit tests
   ↓
Build
   ↓
Preview/Staging

main
   ↓
Production checks
   ↓
Migration
   ↓
Cloudflare deploy
```

---

# 165. Quality gates

Production deploy üçün:

```text
lint pass
typecheck pass
unit test pass
integration test pass
build pass
migration check pass
```

məcburi olmalıdır.

---

# 166. Testing

## Unit

- pricing;
- discount;
- permissions;
- configuration validation.

## Integration

- D1;
- checkout;
- order;
- repair;
- payment.

## E2E

Playwright:

```text
browse product
configure
add to cart
checkout

repair request

admin product create
admin repair assignment
```

---

# 167. Observability

Monitor:

- Workers errors;
- request latency;
- D1 query;
- Queue failure;
- Workflow failure;
- payment errors;
- 4xx/5xx.

Critical error alert yaradılmalıdır.

---

# 168. Logging

Structured JSON.

```json
{
  "requestId": "...",
  "route": "...",
  "userId": "...",
  "status": 500,
  "duration": 120
}
```

Sensitive data log edilməməlidir.

---

# 169. Request ID

Hər request:

```text
requestId
```

almalıdır.

Support məsələsində:

> Error ID: ABC123

göstərilə bilər.

---

# 170. Error handling

İstifadəçiyə stack trace göstərilməməlidir.

Production:

```text
Sistemdə xəta baş verdi.
Xəta kodu: ABC123
```

Admin/log sistemində ətraflı məlumat.

---

# 171. Backup / Disaster Recovery

D1-in disaster recovery imkanlarından əlavə kritik business data üçün müntəzəm export strategiyası nəzərdə tutulmalıdır.

R2 asset inventarı və database records uyğunlaşdırılmalıdır.

---

# 172. Privacy

Sistem minimum data prinsipi ilə işləməlidir.

Saxlanılacaq:

- əlaqə məlumatı;
- sifariş məlumatı;
- servis məlumatı.

Lazımsız sensitive data yığılmamalıdır.

---

# 173. Cookie sistemi

Kateqoriyalar:

```text
Necessary
Analytics
Marketing
```

Necessary cookies consent olmadan işləyə bilər.

Analytics/marketing tətbiqi hüquqi tələblərə uyğun konfiqurasiya edilməlidir.

---

# 174. MVP Scope

## Phase 1

Mütləq:

- responsive frontend;
- AZ locale;
- categories;
- brands;
- product catalog;
- product detail;
- filters;
- search;
- configurator;
- color;
- size;
- handles;
- locks;
- dynamic price;
- favorites;
- compare;
- cart;
- quote;
- checkout;
- orders;
- repair;
- measurement;
- admin;
- SEO;
- R2;
- Images;
- D1;
- Prisma;
- Turnstile;
- WAF;
- Queue email architecture.

---

# 175. Phase 2

- customer account;
- advanced order tracking;
- technician system;
- appointments;
- installations;
- inventory;
- supplier;
- warranties;
- DoorAsset;
- QR;
- reviews;
- projects;
- notifications;
- EN/RU;
- advanced analytics.

---

# 176. Phase 3

- Workers AI Door Assistant;
- Repair Assistant;
- Vectorize semantic search;
- recommendation engine;
- 3D configurator;
- AR preview;
- web push;
- smart CRM;
- automated marketing;
- dynamic AI-generated SEO suggestions.

---

# 177. MVP xaricində saxlanılacaq

İlk versiyada məcburi deyil:

- native iOS;
- native Android;
- AR;
- complex 3D;
- AI chatbot;
- supplier ERP;
- full accounting;
- technician GPS live tracking.

Arxitektura bunlara mane olmamalıdır.

---

# 178. Əsas user journey

## Door purchase

```text
Homepage
↓
Category
↓
Product
↓
Configurator
↓
Configuration
↓
Cart
↓
Checkout
↓
Order
↓
Payment
↓
Delivery
↓
Installation
↓
Warranty
```

---

# 179. Repair journey

```text
Repair page
↓
Issue
↓
Photo
↓
Address
↓
Appointment
↓
Repair Request
↓
Admin Review
↓
Technician
↓
Repair
↓
Completion
↓
Service History
```

---

# 180. Quote journey

```text
Product
↓
Custom Configuration
↓
Quote Request
↓
Admin Pricing
↓
Customer
↓
Accept
↓
Order
```

---

# 181. Success metrics

Launch sonrası:

### Commerce

```text
≥ X configurator sessions
Configurator completion
Add-to-cart rate
Checkout rate
Order conversion
```

### Service

```text
Repair request volume
Assignment time
Repair completion time
Customer rating
```

### Technical

```text
Core Web Vitals
API error rate
5xx
DB latency
Queue failures
```

---

# 182. Acceptance Criteria — Catalog

- istifadəçi məhsulları görə bilir;
- filter işləyir;
- sort işləyir;
- URL share edilə bilir;
- filter mobile işləyir;
- inactive product göstərilmir;
- SEO metadata mövcuddur.

---

# 183. Acceptance Criteria — Configurator

- yalnız uyğun options göstərilir;
- seçilən hər option preview-u dəyişə bilir;
- qiymət serverdə hesablanır;
- invalid kombinasiya bloklanır;
- custom size validate edilir;
- configuration save edilə bilir;
- cart-a tam snapshot ötürülür.

---

# 184. Acceptance Criteria — Order

- unique order number;
- server-calculated total;
- duplicate payment/order prevention;
- status history;
- admin visibility;
- customer visibility;
- asynchronous notification.

---

# 185. Acceptance Criteria — Repair

- Turnstile validation;
- media upload;
- unique repair number;
- admin notification;
- technician assignment;
- status timeline;
- completion record.

---

# 186. Acceptance Criteria — Admin

Admin:

- məhsul yarada;
- option bağlaya;
- qiymət dəyişə;
- order görə;
- repair assign edə;
- user görə;
- content redaktə edə

bilməlidir.

Permission olmayan user həmin endpoint-dən istifadə edə bilməməlidir.

---

# 187. Architecture principles

Bütün development zamanı aşağıdakı prinsiplər qorunmalıdır:

### 1. Cloudflare-native

Cloudflare binding mövcud olduğu halda lazımsız ayrıca server qurulmamalıdır.

### 2. Edge-first

Public content CDN/cache-dan maksimum istifadə etməlidir.

### 3. D1 authoritative database

Relational business data D1-də saxlanmalıdır.

### 4. KV authoritative database deyil

KV yalnız uyğun read-heavy data üçün istifadə olunmalıdır.

### 5. R2 original media store

Original media R2.

### 6. Async by default

Email və ağır side effect-lər Queue-a ötürülməlidir.

### 7. Server is authority

Price, permission və payment frontend-dən qəbul edilməməlidir.

### 8. Configuration-driven platform

Yeni rəng/lock/handle əlavə etmək kod dəyişikliyi tələb etməməlidir.

### 9. Mobile-first

Xüsusilə service və configurator.

### 10. Auditability

Kritik admin və business əməliyyatları izlənilə bilməlidir.

---

# 188. Tövsiyə edilən repository strukturu

```text
src/

  app/
    [locale]/

      (public)/
        page.tsx
        doors/
        brands/
        configurator/
        services/
        repair/
        measurement/
        projects/
        blog/
        contact/

      (commerce)/
        cart/
        checkout/

      (account)/
        account/

      admin/
        dashboard/
        catalog/
        orders/
        repairs/
        technicians/
        inventory/
        content/
        settings/

    api/
      v1/
      webhooks/

  components/
    ui/
    layout/
    product/
    configurator/
    cart/
    repair/
    admin/

  features/
    auth/
    catalog/
    configurator/
    pricing/
    cart/
    checkout/
    orders/
    repair/
    appointments/
    inventory/
    warranty/
    notifications/

  server/
    db/
    repositories/
    services/
    permissions/
    queues/
    workflows/

  lib/
    cloudflare/
    validation/
    security/
    seo/
    money/
    dates/

  prisma/
    schema.prisma
    migrations/

  types/

tests/
```

---

# 189. Cloudflare bindings

Təxminən:

```text
DB
MEDIA
CACHE_KV
EMAIL_QUEUE
EVENT_QUEUE
AI
VECTORIZE
```

Environment config:

```text
wrangler.jsonc
```

və ya layihənin seçdiyi uyğun Wrangler configuration formatında idarə edilməlidir.

---

# 190. Yekun platforma modeli

```text
                    CUSTOMER
                       │
                       ▼
                PUBLIC WEBSITE
                       │
        ┌──────────────┼───────────────┐
        │              │               │
      CATALOG     CONFIGURATOR      SERVICES
        │              │               │
        │              │          ┌────┴─────┐
        │              │        REPAIR    MEASURE
        │              │
        └──────────────┼───────────────┐
                       │               │
                      CART           QUOTE
                       │               │
                       └──────┬────────┘
                              ▼
                            ORDER
                              │
                 ┌────────────┼───────────┐
                 │            │           │
              PAYMENT      DELIVERY   INSTALLATION
                                          │
                                          ▼
                                      DOOR ASSET
                                          │
                               ┌──────────┴─────────┐
                               │                    │
                            WARRANTY             SERVICE
                               │                    │
                               └──────────┬─────────┘
                                          ▼
                                     LIFECYCLE
```

---

# 191. Əsas texniki qərar

Bu platformanın data modelinin mərkəzində yalnız `Product` olmamalıdır.

Əsas domain entity-ləri:

```text
Product
Configuration
Order
DoorAsset
Service
```

olmalıdır.

`Product` satılmamış qapı modelini,

`Configuration` müştərinin seçdiyi variantı,

`Order` kommersiya əməliyyatını,

`DoorAsset` artıq müştərinin ünvanında mövcud olan fiziki qapını,

`Service` isə həmin qapının satışdan sonrakı həyat dövrünü ifadə edir.

Bu ayrılıq platformanın gələcəkdə sadə qapı mağazasından tam **Door Lifecycle Management Platform** səviyyəsinə genişlənməsinə imkan verəcək.

---

# 192. Tövsiyə edilən Cloudflare stack — yekun

```text
Application
Next.js + React + TypeScript

Deployment
Cloudflare Workers + vinext

Database
Cloudflare D1

ORM
Prisma

Media
Cloudflare R2

Image optimization
Cloudflare Images

Cache
Cloudflare CDN
Workers Cache
KV

Async
Cloudflare Queues

Durable orchestration
Cloudflare Workflows

Security
WAF
Turnstile
Rate Limiting

AI
Workers AI

Semantic Search
Vectorize

Source Control
GitHub

CI/CD
GitHub Actions + Wrangler
```

Bu stack həm MVP-ni sürətlə qurmaq, həm də sonradan məhsulu genişləndirmək üçün əsas arxitektura kimi qəbul edilməlidir.