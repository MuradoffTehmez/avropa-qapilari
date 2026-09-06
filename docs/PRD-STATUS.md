# PRD icra vəziyyəti

Bu fayl `npm run prd:status` ilə yaradılır. Qiymətləndirmə
`scripts/prd-status.ts` faylındadır — kod dəyişəndə orada yenilənir.

Faiz belə hesablanır: hazır = 1, qismən = 0.5, yoxdur = 0.
Sənəd fəsilləri (məqsəd, vizyon, faza planı) hesaba daxil edilmir.

## Yekun

| Sahə | Hazır | Qismən | Yoxdur | Tamamlanma |
|---|---:|---:|---:|---:|
| Konsepsiya və rollar (§1–§4) | 0 | 1 | 0 | **50%** |
| Cloudflare infrastrukturu (§5–§22) | 2 | 2 | 14 | **17%** |
| Sayt və kataloq (§23–§46) | 24 | 0 | 0 | **100%** |
| Konfiqurator və qiymət (§47–§57) | 11 | 0 | 0 | **100%** |
| Səbət, sifariş, ödəniş (§58–§68) | 9 | 2 | 0 | **91%** |
| Servis, usta, zəmanət (§69–§84) | 10 | 4 | 2 | **75%** |
| Hesab və autentifikasiya (§85–§89) | 5 | 0 | 0 | **100%** |
| Admin panel (§90–§106) | 6 | 6 | 5 | **53%** |
| SEO, performans, əlçatanlıq (§107–§120) | 13 | 0 | 1 | **93%** |
| Bildiriş və analitika (§121–§128) | 1 | 2 | 5 | **25%** |
| Təhlükəsizlik və API (§129–§137) | 7 | 1 | 1 | **83%** |
| Data modeli (§138–§161) | 11 | 4 | 9 | **54%** |
| Əməliyyat və keyfiyyət (§162–§173) | 3 | 4 | 5 | **42%** |
| Axınlar və qəbul şərtləri (§174–§186) | 6 | 3 | 0 | **83%** |
| Arxitektura yekunu (§187–§192) | 1 | 2 | 1 | **50%** |
| **Cəmi** | **109** | **31** | **43** | **68%** |

## Fəsillər

| № | Fəsil | Vəziyyət | Qeyd |
|---:|---|---|---|
| 1 | Məhsulun məqsədi | sənəd |  |
| 2 | Məhsul vizyonu | sənəd |  |
| 3 | Məhsulun əsas fərqləndirici xüsusiyyətləri | sənəd |  |
| 4 | Əsas istifadəçi qrupları | qismən | CUSTOMER / TECHNICIAN / ADMIN var; Redaktor və Super Admin rolları yoxdur |
| 5 | Cloudflare arxitekturası | yoxdur |  |
| 6 | Cloudflare xidmətlərinin vəzifələri | yoxdur |  |
| 7 | Next.js arxitekturası | hazır |  |
| 8 | Cloudflare D1 | qismən | SQLite lokal işləyir (D1 ilə eyni motor); D1-ə deployment yoxdur |
| 9 | Prisma ORM | hazır |  |
| 10 | D1 read replication strategiyası | yoxdur |  |
| 11 | D1 transaction strategiyası | qismən | Prisma tranzaksiyaları işlənir; D1-ə xas strategiya yoxdur |
| 12 | Cloudflare R2 | yoxdur |  |
| 13 | R2 bucket strukturu | yoxdur |  |
| 14 | Cloudflare Images | yoxdur |  |
| 15 | Cloudflare KV | yoxdur |  |
| 16 | Cloudflare Cache/CDN | yoxdur |  |
| 17 | Cloudflare Queues | yoxdur |  |
| 18 | Cloudflare Workflows | yoxdur |  |
| 19 | Cloudflare Turnstile | yoxdur |  |
| 20 | Cloudflare WAF | yoxdur |  |
| 21 | Workers AI — gələcək mərhələ | yoxdur |  |
| 22 | Vectorize | yoxdur |  |
| 23 | Sayt informasiya arxitekturası | hazır |  |
| 24 | Multi-language URL | hazır |  |
| 25 | Ana səhifə | hazır |  |
| 26 | Hero section | hazır |  |
| 27 | Kateqoriyalar | hazır |  |
| 28 | Homepage Configurator CTA | hazır |  |
| 29 | Featured products | hazır |  |
| 30 | Xidmət bölməsi | hazır |  |
| 31 | Repair CTA | hazır |  |
| 32 | Projects / Portfolio | hazır |  |
| 33 | Brands | hazır |  |
| 34 | Reviews | hazır |  |
| 35 | FAQ | hazır |  |
| 36 | Footer | hazır |  |
| 37 | Məhsul kataloqu | hazır |  |
| 38 | Filter sistemi | hazır |  |
| 39 | Sort | hazır |  |
| 40 | Search | hazır |  |
| 41 | Məhsul detail page | hazır |  |
| 42 | Məhsul səhifəsində məlumatlar | hazır |  |
| 43 | Məhsul tab/section-ları | hazır |  |
| 44 | Product documents | hazır |  |
| 45 | Favorilər | hazır |  |
| 46 | Product comparison | hazır |  |
| 47 | Door Configurator | hazır |  |
| 48 | Configurator mərhələləri | hazır |  |
| 49 | Configurator UI | hazır |  |
| 50 | Configurator preview | hazır |  |
| 51 | Configurator option system | hazır |  |
| 52 | Variant explosion qadağası | hazır |  |
| 53 | Pricing Engine | hazır |  |
| 54 | Price rule | hazır |  |
| 55 | Custom ölçü | hazır |  |
| 56 | Configuration save | hazır |  |
| 57 | Share configuration | hazır |  |
| 58 | Cart | hazır |  |
| 59 | Cart persistence | qismən | Səbət brauzerdə saxlanılır; server tərəfli Cart cədvəli yoxdur |
| 60 | Checkout | hazır |  |
| 61 | Payment architecture | qismən | Provayder abstraksiyası və Payment cədvəli var; real provayder qoşulmayıb |
| 62 | Order numbering | hazır |  |
| 63 | Order status | hazır |  |
| 64 | Order timeline | hazır |  |
| 65 | Order snapshot | hazır |  |
| 66 | Quote Request | hazır |  |
| 67 | Ölçü ustası sifarişi | hazır |  |
| 68 | Measurement status | hazır |  |
| 69 | Repair sistemi | hazır |  |
| 70 | Repair categories | hazır |  |
| 71 | Repair wizard | hazır |  |
| 72 | Repair media | yoxdur | Foto/video yükləmə R2 tələb edir |
| 73 | Repair status | hazır |  |
| 74 | Technician | hazır |  |
| 75 | Technician assignment | hazır |  |
| 76 | Technician job interface | hazır |  |
| 77 | Technician repair completion | hazır |  |
| 78 | Appointment engine | qismən | Appointment modeli və siyahılar var; planlaşdırma interfeysi yoxdur |
| 79 | Appointment conflict | yoxdur | Vaxt toqquşmasının yoxlanışı yoxdur |
| 80 | Installation sistemi | qismən | Quraşdırma sifariş seçimidir; ayrıca iş axını yoxdur |
| 81 | Warranty sistemi | hazır |  |
| 82 | Serial Number | qismən | Serial nömrə saxlanılır; avtomatik generasiya yoxdur |
| 83 | QR sistemi | hazır |  |
| 84 | Service History | qismən | Qapı pasportu hələ mock DoorAsset-dən oxuyur |
| 85 | Customer account | hazır |  |
| 86 | Customer profile | hazır |  |
| 87 | Addresses | hazır |  |
| 88 | Authentication | hazır |  |
| 89 | Password security | hazır |  |
| 90 | Admin panel | hazır |  |
| 91 | Admin sidebar | hazır |  |
| 92 | Admin Dashboard KPI | hazır |  |
| 93 | RBAC | hazır |  |
| 94 | Role matrix | qismən | Matris üç mövcud rolu göstərir; Super Admin və Redaktor yoxdur |
| 95 | Product Admin | qismən | Siyahı bazadandır; məhsul yaratma və redaktə API-si yoxdur |
| 96 | Configurator Admin | qismən | Option dəyərləri bazadan oxunur; redaktə yoxdur |
| 97 | Compatibility engine | hazır |  |
| 98 | Inventory | yoxdur |  |
| 99 | Inventory movement | yoxdur |  |
| 100 | Inventory reservation | yoxdur |  |
| 101 | Low-stock notification | yoxdur |  |
| 102 | Supplier | yoxdur |  |
| 103 | Review sistemi | hazır |  |
| 104 | Projects | qismən | Layihələr statik məzmundur; admin CRUD yoxdur |
| 105 | Blog | qismən | Bloq statik məzmundur; admin CRUD yoxdur |
| 106 | CMS | qismən | ContentPage cədvəli və CRUD var; səhifə mətni hələ statikdir |
| 107 | SEO sistemi | hazır |  |
| 108 | Structured Data | hazır |  |
| 109 | Sitemap | hazır |  |
| 110 | robots.txt | hazır |  |
| 111 | Canonical | hazır |  |
| 112 | Performance tələbləri | hazır |  |
| 113 | Image performance | hazır |  |
| 114 | Mobile-first | hazır |  |
| 115 | Responsive breakpoint strategy | hazır |  |
| 116 | Design System | hazır |  |
| 117 | Typography | hazır |  |
| 118 | Accessibility | hazır |  |
| 119 | Search architecture — MVP | hazır |  |
| 120 | Search Phase 3 | yoxdur | PRD özü bunu üçüncü fazaya saxlayır |
| 121 | Notifications | yoxdur |  |
| 122 | Notification events | yoxdur |  |
| 123 | Notification preference | qismən | Bildiriş seçimləri interfeysdədir; göndəriş yoxdur |
| 124 | Email | yoxdur |  |
| 125 | WhatsApp | yoxdur |  |
| 126 | Analytics event architecture | yoxdur | Səhifə baxışı hadisələri toplanmır |
| 127 | Business KPI | qismən | KPI-lar bazadan hesablanır; hadisə əsaslı metriklər yoxdur |
| 128 | Audit Log | hazır |  |
| 129 | Security principles | hazır |  |
| 130 | Price security | hazır |  |
| 131 | File upload security | yoxdur |  |
| 132 | API conventions | hazır |  |
| 133 | Order API | hazır |  |
| 134 | Service API | hazır |  |
| 135 | Admin API | qismən | Sifariş, müraciət, endirim, məzmun, SEO, rəy və rol API-ləri var; məhsul CRUD yoxdur |
| 136 | API response format | hazır |  |
| 137 | Idempotency | hazır |  |
| 138 | Prisma / D1 əsas data modeli | qismən | Əsas modellər var; kataloq tərcümə və media cədvəlləri yoxdur |
| 139 | User model | hazır |  |
| 140 | Product | qismən | Product cədvəli var; tərcümə, media və spesifikasiya sahələri mock-dadır |
| 141 | Product translations | yoxdur |  |
| 142 | Category | hazır |  |
| 143 | ProductMedia | yoxdur |  |
| 144 | ProductSpecification | yoxdur |  |
| 145 | OptionGroup | qismən | OptionValue cədvəli var; OptionGroup ayrıca cədvəl deyil |
| 146 | OptionValue | hazır |  |
| 147 | ProductOption | yoxdur |  |
| 148 | DoorConfiguration | hazır |  |
| 149 | ConfigurationChoice | qismən | Seçimlər JSON sahədə saxlanılır, ayrıca cədvəl yoxdur |
| 150 | Cart | yoxdur |  |
| 151 | Order | hazır |  |
| 152 | OrderItem | hazır |  |
| 153 | Status history | hazır |  |
| 154 | Payment | hazır |  |
| 155 | RepairRequest | hazır |  |
| 156 | DoorAsset | yoxdur |  |
| 157 | Repair ilə DoorAsset | yoxdur |  |
| 158 | Inventory | yoxdur |  |
| 159 | DB indexing | hazır |  |
| 160 | Soft delete | yoxdur | Soft delete yoxdur — silmə fiziki aparılır |
| 161 | Database migration | hazır |  |
| 162 | Environment strategiyası | qismən | Mühit dəyişənləri işlənir; mərhələli mühit strategiyası yoxdur |
| 163 | Secrets | qismən | Sirlər mühit faylındadır; secret manager yoxdur |
| 164 | CI/CD | yoxdur |  |
| 165 | Quality gates | qismən | typecheck, lint və build var; CI-də məcburi deyil |
| 166 | Testing | yoxdur | Test dəsti yoxdur |
| 167 | Observability | yoxdur |  |
| 168 | Logging | qismən | Xəta jurnalı var; strukturlu logging yoxdur |
| 169 | Request ID | yoxdur |  |
| 170 | Error handling | hazır |  |
| 171 | Backup / Disaster Recovery | yoxdur |  |
| 172 | Privacy | hazır |  |
| 173 | Cookie sistemi | hazır |  |
| 174 | MVP Scope | sənəd |  |
| 175 | Phase 2 | sənəd |  |
| 176 | Phase 3 | sənəd |  |
| 177 | MVP xaricində saxlanılacaq | sənəd |  |
| 178 | Əsas user journey | hazır |  |
| 179 | Repair journey | hazır |  |
| 180 | Quote journey | hazır |  |
| 181 | Success metrics | qismən | Göstəricilər hesablanır; hədəflərlə müqayisə yoxdur |
| 182 | Acceptance Criteria — Catalog | hazır |  |
| 183 | Acceptance Criteria — Configurator | hazır |  |
| 184 | Acceptance Criteria — Order | hazır |  |
| 185 | Acceptance Criteria — Repair | qismən | Media yükləmə şərti qarşılanmır |
| 186 | Acceptance Criteria — Admin | qismən | Məhsul CRUD şərti qarşılanmır |
| 187 | Architecture principles | hazır |  |
| 188 | Tövsiyə edilən repository strukturu | qismən | Struktur uyğundur; monorepo bölgüsü yoxdur |
| 189 | Cloudflare bindings | yoxdur |  |
| 190 | Yekun platforma modeli | qismən | Tətbiq modeli uyğundur; Cloudflare xidmətləri qoşulmayıb |
| 191 | Əsas texniki qərar | sənəd |  |
| 192 | Tövsiyə edilən Cloudflare stack — yekun | sənəd |  |
