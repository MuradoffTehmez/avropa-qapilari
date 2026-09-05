"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import { Button } from "@/components/ui/Button";
import { Card, Notice } from "@/components/ui/primitives";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { toast } from "@/components/ui/overlays";
import { accountUser } from "@/mock/account";
import { localeNames, locales } from "@/i18n/config";

/** müştəri profili. */
export function ProfileForm({ dict }: { dict: Dictionary }) {
  const [form, setForm] = useState({
    name: accountUser.name,
    surname: accountUser.surname,
    email: accountUser.email,
    phone: accountUser.phone,
    language: accountUser.language,
    marketingConsent: accountUser.marketingConsent,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{dict.account.profile}</h2>

      <Card className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast("Profil yadda saxlanıldı");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={dict.common.name}>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label={dict.common.surname}>
              <Input value={form.surname} onChange={(e) => set("surname", e.target.value)} />
            </Field>
            <Field label={dict.common.email}>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label={dict.common.phone}>
              <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Dil">
              <Select value={form.language} onChange={(e) => set("language", e.target.value)}>
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {localeNames[l]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <Checkbox
              label="Marketinq bildirişlərinə razıyam"
              description="Endirimlər, yeni modellər və kampaniyalar"
              checked={form.marketingConsent}
              onChange={(e) => set("marketingConsent", e.target.checked)}
            />
          </div>

          <Button type="submit" className="mt-5">
            {dict.actions.save}
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
          Təhlükəsizlik
        </h3>
        <div className="space-y-3 text-sm text-graphite">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span>Şifrə</span>
            <Button variant="ghost" size="sm">
              Dəyiş
            </Button>
          </div>
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span>Aktiv sessiyalar</span>
            <span className="text-[13px] text-stone">1 cihaz</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hesabın silinməsi</span>
            <Button variant="ghost" size="sm" className="text-danger">
              {dict.actions.remove}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
