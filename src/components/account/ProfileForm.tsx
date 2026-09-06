"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { toast } from "@/components/ui/overlays";
import { localeNames, locales } from "@/i18n/config";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { useSession } from "@/store/session";

export interface AccountProfile {
  name: string;
  email: string;
  phone: string;
  language: string;
  marketingConsent: boolean;
}

/** Müştəri profili — dəyişikliklər `/api/account/profile`-a yazılır. */
export function ProfileForm({
  dict,
  profile,
}: {
  dict: Dictionary;
  profile: AccountProfile;
}) {
  const setUser = useSession((s) => s.setUser);
  const user = useSession((s) => s.user);

  const [form, setForm] = useState<AccountProfile>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof AccountProfile>(key: K, value: AccountProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const saved = await apiFetch<AccountProfile>("/api/account/profile", {
        method: "PATCH",
        json: {
          name: form.name,
          phone: form.phone,
          language: form.language,
          marketingConsent: form.marketingConsent,
        },
      });

      setForm(saved);
      // Başlıqdakı ad dərhal yenilənsin.
      if (user) setUser({ ...user, name: saved.name });
      toast(dict.accountUi.profileSaved);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { name: error.error.message });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{dict.account.profile}</h2>

      <Card className="p-5">
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={dict.common.name} error={errors.name}>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label={dict.common.email} hint={dict.auth.emailLocked}>
              <Input type="email" value={form.email} readOnly disabled />
            </Field>
            <Field label={dict.common.phone} error={errors.phone}>
              <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label={dict.accountUi.language}>
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
              label={dict.accountUi.marketingConsent}
              description={dict.accountUi.marketingDescription}
              checked={form.marketingConsent}
              onChange={(e) => set("marketingConsent", e.target.checked)}
            />
          </div>

          <Button type="submit" className="mt-5" disabled={saving}>
            {dict.actions.save}
          </Button>
        </form>
      </Card>

      <PasswordCard dict={dict} />
    </div>
  );
}

/** Parol dəyişmə — cari parol tələb olunur (PRD §89). */
function PasswordCard({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ current: "", next: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      await apiFetch("/api/account/password", { method: "POST", json: form });
      setForm({ current: "", next: "" });
      setOpen(false);
      toast(dict.auth.passwordUpdated);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { current: error.error.message });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
        {dict.accountUi.security}
      </h3>

      <div className="flex items-center justify-between border-b border-line pb-3 text-sm text-graphite">
        <span>{dict.accountUi.password}</span>
        <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {dict.accountUi.change}
        </Button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
          <Field label={dict.auth.passwordCurrent} required error={errors.current}>
            <Input
              type="password"
              autoComplete="current-password"
              value={form.current}
              onChange={(e) => {
                setForm((f) => ({ ...f, current: e.target.value }));
                setErrors((x) => ({ ...x, current: "" }));
              }}
            />
          </Field>
          <Field
            label={dict.auth.passwordNew}
            required
            hint={dict.auth.passwordHint}
            error={errors.next}
          >
            <Input
              type="password"
              autoComplete="new-password"
              value={form.next}
              onChange={(e) => {
                setForm((f) => ({ ...f, next: e.target.value }));
                setErrors((x) => ({ ...x, next: "" }));
              }}
            />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {dict.actions.save}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
