"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { LogoMark } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

type Mode = "login" | "register" | "reset";

const modes: { id: Mode; label: string }[] = [
  { id: "login", label: "Giriş" },
  { id: "register", label: "Qeydiyyat" },
  { id: "reset", label: "Şifrəni bərpa et" },
];

export function AuthPanel({ locale }: { locale: string }) {
  const [mode, setMode] = useState<Mode>("login");
  const [done, setDone] = useState(false);

  const active = modes.find((m) => m.id === mode)!;

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
      {/* Sol tərəf — dəyər təklifi */}
      <div className="order-2 lg:order-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
          Şəxsi kabinet
        </p>
        <h1 className="mt-4 text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.5rem]">
          Qapınızla bağlı hər şey, bir yerdə.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone">
          Sifarişləri izləyin, saxladığınız dizaynları açın, zəmanətə baxın və servis
          müraciətlərini idarə edin.
        </p>

        <ul className="mt-8 space-y-3">
          {[
            "Sifariş və çatdırılma statusu",
            "Saxlanmış konfiqurasiyalar",
            "Zəmanət və servis tarixçəsi",
            "Ölçü və təmir görüşləri",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-graphite">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ tərəf — forma */}
      <Card className="order-1 p-5 sm:p-7 lg:order-2">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark size={30} />
          <div>
            <p className="text-[15px] font-semibold text-ink">{active.label}</p>
            <p className="text-xs text-stone">EuroPorta hesabı</p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Giriş rejimi"
          className="mb-6 grid grid-cols-3 gap-1 border border-line p-1"
        >
          {modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setDone(false);
              }}
              className={cn(
                "px-2 py-2 text-[12px] font-medium leading-tight transition-colors sm:text-[13px]",
                mode === m.id ? "bg-ink text-paper" : "text-graphite hover:bg-bone",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {done ? (
          <div role="status" className="py-2">
            <CheckCircle2 size={34} className="text-success" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              {mode === "reset" ? "Bərpa addımı tamamlandı" : "Hesaba keçid hazırdır"}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-stone">
              {mode === "reset"
                ? "Serverlə əlaqə qurulduqdan sonra e-poçtunuza bərpa linki göndəriləcək."
                : "Kabinetdə sifarişlərinizi, dizaynlarınızı və servis müraciətlərinizi görə bilərsiniz."}
            </p>
            <Link
              href={`/${locale}/hesab`}
              className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-gold-600 underline-offset-4 hover:underline"
            >
              Kabinetə keç <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            {mode === "register" && (
              <Field label="Ad və soyad" required>
                <Input required autoComplete="name" placeholder="Ad Soyad" />
              </Field>
            )}

            <Field label="E-poçt" required>
              <Input required type="email" autoComplete="email" placeholder="ad@example.com" />
            </Field>

            {mode !== "reset" && (
              <Field label="Şifrə" required hint="Ən azı 8 simvol.">
                <Input
                  required
                  type="password"
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </Field>
            )}

            {mode === "register" && (
              <Checkbox
                required
                label={
                  <>
                    <Link
                      href={`/${locale}/legal/terms`}
                      className="underline underline-offset-2"
                    >
                      İstifadə şərtləri
                    </Link>{" "}
                    ilə razıyam
                  </>
                }
              />
            )}

            <Button type="submit" size="lg" full>
              {active.label}
            </Button>

            <p className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-stone">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold-500" />
              Şifrələr yalnız serverdə hash formasında saxlanılır və heç vaxt açıq mətn kimi
              göndərilmir.
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
