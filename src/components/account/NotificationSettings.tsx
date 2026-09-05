"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Bell } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { formatDateTime } from "@/lib/utils";
import { notifications } from "@/mock/account";
import { useWorkflow } from "@/store/workflow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Toggle } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface PrefsState {
  read: string[];
  channels: Record<string, boolean>;
  mark: (ids: string[]) => void;
  toggle: (key: string) => void;
}

const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      read: [],
      channels: {
        "Sifariş bildirişləri": true,
        "Servis bildirişləri": true,
        "Marketinq": false,
        "SMS": false,
      },
      mark: (ids) => set((s) => ({ read: [...new Set([...s.read, ...ids])] })),
      toggle: (key) => set((s) => ({ channels: { ...s.channels, [key]: !s.channels[key] } })),
    }),
    { name: "ep-notifications-v1" },
  ),
);

export function NotificationSettings() {
  const prefs = usePrefs();
  const hydrated = useHydrated();
  const records = useWorkflow((s) => s.records);

  if (!hydrated) return null;

  const items = [
    ...records.map((r) => ({
      id: r.id,
      title: `${r.title}: ${r.status}`,
      body: r.id,
      date: r.date,
    })),
    ...notifications.map((n) => ({ id: n.id, title: n.title, body: n.body, date: n.date })),
  ];

  const unread = items.filter((i) => !prefs.read.includes(i.id)).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Bildirişlər
          {unread > 0 && (
            <span className="ml-2 rounded-full bg-gold-500 px-2 py-0.5 align-middle text-[11px] font-semibold text-paper">
              {unread}
            </span>
          )}
        </h2>
        {unread > 0 && (
          <Button variant="secondary" size="sm" onClick={() => prefs.mark(items.map((i) => i.id))}>
            Hamısını oxunmuş et
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((n) => {
          const read = prefs.read.includes(n.id);
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => prefs.mark([n.id])}
              className={cn(
                "flex w-full items-start gap-3 border border-line p-4 text-left transition-colors",
                read ? "bg-paper" : "border-l-2 border-l-gold-400 bg-gold-50/50",
              )}
            >
              <Bell size={16} className="mt-0.5 shrink-0 text-gold-500" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-medium text-ink">{n.title}</span>
                <span className="mt-0.5 block text-[13px] text-stone">{n.body}</span>
                <span className="mt-1.5 block text-[11.5px] text-mist">
                  {formatDateTime(n.date)} · {read ? "Oxunub" : "Yeni"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
          Bildiriş kanalları
        </h3>
        <div className="space-y-3">
          {Object.entries(prefs.channels).map(([key, enabled]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0"
            >
              <Toggle checked={enabled} onChange={() => prefs.toggle(key)} label={key} />
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
