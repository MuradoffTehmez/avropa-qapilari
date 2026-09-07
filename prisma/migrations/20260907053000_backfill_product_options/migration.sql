-- Mövcud məhsulları onların konfiqurator qruplarındakı option-larla bağla.
-- Yeni quraşdırmada cədvəllər seed zamanı doldurulur; bu sorğu mövcud
-- bazanın məlumatını itirmədən yeni əlaqəni hazırlayır.
INSERT OR IGNORE INTO "ProductOption" ("id", "productId", "optionValueId", "enabled")
SELECT
  p."id" || ':' || o."id",
  p."id",
  o."id",
  true
FROM "Product" p
JOIN json_each(p."optionGroups") groups
JOIN "OptionValue" o ON o."groupKey" = groups.value;
