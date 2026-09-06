"use client";

import { useEffect } from "react";

import { az } from "@/i18n/dictionaries/az";

/**
 * Kök layout özü uğursuz olduqda işə düşür — öz `<html>` və `<body>`
 * elementlərini render etməlidir, ona görə burada Tailwind sinifləri
 * yerinə inline stil işlənir (qlobal CSS yüklənməmiş ola bilər).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="az">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#ffffff",
          color: "#101f33",
          fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", sans-serif',
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
          {az.errors.somethingWrong}
        </h1>
        <p style={{ margin: 0, maxWidth: "28rem", lineHeight: 1.6, color: "#71809a" }}>
          {az.errors.somethingWrongText}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1rem",
            minHeight: "2.75rem",
            padding: "0 1.25rem",
            border: "1px solid #101f33",
            borderRadius: 3,
            background: "#101f33",
            color: "#ffffff",
            font: "inherit",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {az.errors.tryAgain}
        </button>
      </body>
    </html>
  );
}
