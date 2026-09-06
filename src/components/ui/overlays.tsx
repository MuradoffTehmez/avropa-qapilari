"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDialogFocus, useEscapeKey, useHydrated, useLockBodyScroll } from "@/lib/hooks";
import { useDict } from "@/i18n/provider";

function Portal({ children }: { children: ReactNode }) {
  const mounted = useHydrated();
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  footer,
  widthClass = "w-full sm:max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  widthClass?: string;
}) {
  const dict = useDict();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = useCallback(() => onClose(), [onClose]);
  useEscapeKey(close, open);
  useLockBodyScroll(open);
  useDialogFocus(panelRef, open);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-100">
        <button
          type="button"
          aria-label={dict.actions.close}
          onClick={close}
          className="motion-overlay absolute inset-0 bg-obsidian/45 backdrop-blur-[2px]"
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : dict.actions.menu}
          tabIndex={-1}
          className={cn(
            "absolute flex max-h-[100dvh] flex-col bg-paper shadow-2xl outline-none",
            side === "right" && cn("inset-y-0 right-0 motion-drawer-right", widthClass),
            side === "left" && cn("inset-y-0 left-0 motion-drawer-left", widthClass),
            side === "bottom" && "inset-x-0 bottom-0 max-h-[88dvh] motion-sheet rounded-t-[10px] pb-[env(safe-area-inset-bottom,0px)]",
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4 sm:px-5">
            <h2 id={titleId} className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">{title}</h2>
            <button
              type="button"
              onClick={close}
              aria-label={dict.actions.close}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-stone transition-colors hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

          {footer && <div className="shrink-0 border-t border-line p-4 sm:px-5">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const dict = useDict();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = useCallback(() => onClose(), [onClose]);
  useEscapeKey(close, open);
  useLockBodyScroll(open);
  useDialogFocus(panelRef, open);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-6">
        <button
          type="button"
          aria-label={dict.actions.close}
          onClick={close}
          className="motion-overlay absolute inset-0 bg-obsidian/45 backdrop-blur-[2px]"
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="motion-modal relative flex max-h-[calc(100dvh-env(safe-area-inset-bottom,0px))] w-full max-w-lg flex-col bg-paper pb-[env(safe-area-inset-bottom,0px)] shadow-2xl outline-none sm:max-h-[90dvh]"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
            <h2 id={titleId} className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">{title}</h2>
            <button
              type="button"
              onClick={close}
              aria-label={dict.actions.close}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-stone transition-colors hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
          {footer && <div className="shrink-0 border-t border-line p-4 px-5">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}

/* ------------------------------- Toast --------------------------------- */

let toastQueue: ((msg: string) => void) | null = null;

export function toast(message: string) {
  toastQueue?.(message);
}

export function ToastHost() {
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    toastQueue = (text: string) => {
      const id = Date.now() + Math.random();
      setMessages((m) => [...m, { id, text }]);
      window.setTimeout(() => {
        setMessages((m) => m.filter((x) => x.id !== id));
      }, 3200);
    };
    return () => {
      toastQueue = null;
    };
  }, []);

  if (messages.length === 0) return null;

  return (
    <Portal>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="toast-host pointer-events-none fixed inset-x-0 z-200 flex flex-col items-center gap-2 px-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            role="status"
            className="animate-fade-up rounded-[3px] bg-ink px-4 py-2.5 text-[13px] font-medium text-paper shadow-lg"
          >
            {m.text}
          </div>
        ))}
      </div>
    </Portal>
  );
}
