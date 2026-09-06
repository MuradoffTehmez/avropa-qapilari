/**
 * schema.org blokunu səhifəyə yazır (PRD §108).
 * `null` gələn sxemlər buraxılır — uydurma məlumat yazılmır.
 */
export function JsonLd({ data }: { data: (Record<string, unknown> | null)[] }) {
  const valid = data.filter(Boolean) as Record<string, unknown>[];
  if (valid.length === 0) return null;

  return (
    <>
      {valid.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
