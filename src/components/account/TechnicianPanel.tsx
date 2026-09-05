"use client";

import { useState } from "react";
import { CheckCircle2, Wrench } from "lucide-react";
import { useWorkflow } from "@/store/workflow";
import { ActivityFeed } from "./ActivityFeed";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { createReference } from "@/lib/utils";
import { technicians } from "@/mock/content";

export function TechnicianPanel({ locale }: { locale: string }) {
  const add = useWorkflow((s) => s.add);
  const [note, setNote] = useState("");
  const [parts, setParts] = useState("");
  const [saved, setSaved] = useState(false);

  const technician = technicians[0]?.name ?? "Usta";

  return (
    <div className="container-page max-w-5xl py-8 lg:py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
        Usta kabineti
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        İşlərim və servis qeydləri
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-stone">
        Müraciəti qəbul edin, statusunu yeniləyin və görülmüş işi qeyd edin.
      </p>

      <Button
        variant="secondary"
        className="mt-6"
        onClick={() =>
          add({
            id: createReference("REP"),
            kind: "repairs",
            title: "Menteşə tənzimlənməsi",
            detail: "Yasamal · 10:00–12:00",
            technician,
          })
        }
      >
        <Wrench size={15} /> Yeni iş əlavə et
      </Button>

      <div className="mt-8">
        <ActivityFeed section="all" locale={locale} manage />
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">İşin tamamlanması</h2>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            add({
              id: createReference("SRV"),
              kind: "repairs",
              title: "Servis tamamlama qeydi",
              detail: `Görülən iş: ${note}\nİstifadə olunan hissələr: ${parts}`,
              technician,
            });
            setSaved(true);
            setNote("");
            setParts("");
          }}
        >
          <Field label="Diaqnostika və görülən iş" required>
            <Textarea
              required
              minLength={10}
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Problemin səbəbi, aparılan əməliyyatlar…"
            />
          </Field>

          <Field label="İstifadə edilən ehtiyat hissələr" required>
            <Input
              required
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              placeholder="Yuxarı menteşə bilyəsi, silindr…"
            />
          </Field>

          <Checkbox required label="Müştəri işi qəbul etdi" />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">Servis qeydini saxla</Button>
            {saved && (
              <p role="status" className="flex items-center gap-1.5 text-[13px] text-success">
                <CheckCircle2 size={15} /> Servis tarixçəsinə əlavə edildi.
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
