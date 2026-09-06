import type { Locale } from "@/types";

/** Dil seçicisi üçün sadə bayraq ikonları (3:2 nisbət). */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 16"
      width="20"
      height="14"
      aria-hidden
      className="shrink-0 rounded-[1px] ring-1 ring-inset ring-black/10"
    >
      {children}
    </svg>
  );
}

/** Azərbaycan */
function FlagAZ() {
  return (
    <Frame>
      <rect width="24" height="5.34" fill="#00b5e2" />
      <rect y="5.34" width="24" height="5.33" fill="#e4002b" />
      <rect y="10.67" width="24" height="5.33" fill="#00a651" />
      <circle cx="11.4" cy="8" r="2.5" fill="#fff" />
      <circle cx="12.3" cy="8" r="2.1" fill="#e4002b" />
      <path
        d="M14.6 6.35l.28.83.87.01-.7.52.26.84-.71-.5-.71.5.26-.84-.7-.52.87-.01z"
        fill="#fff"
      />
    </Frame>
  );
}

/** Birləşmiş Krallıq */
function FlagEN() {
  return (
    <Frame>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1.9" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5.3" />
      <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3.2" />
    </Frame>
  );
}

/** Rusiya */
function FlagRU() {
  return (
    <Frame>
      <rect width="24" height="5.34" fill="#fff" />
      <rect y="5.34" width="24" height="5.33" fill="#0039a6" />
      <rect y="10.67" width="24" height="5.33" fill="#d52b1e" />
    </Frame>
  );
}

const flags: Record<Locale, () => React.ReactElement> = {
  az: FlagAZ,
  en: FlagEN,
  ru: FlagRU,
};

export function FlagIcon({ locale }: { locale: Locale }) {
  const Flag = flags[locale];
  return <Flag />;
}
