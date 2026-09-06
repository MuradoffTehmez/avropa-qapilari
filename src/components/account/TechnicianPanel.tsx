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
import { useDict } from "@/i18n/provider";

export function TechnicianPanel({ locale }: { locale: string }) {
  const dict = useDict();
  const add = useWorkflow((s) => s.add);
  const [note, setNote] = useState("");
  const [parts, setParts] = useState("");
  const [saved, setSaved] = useState(false);

  const technician = technicians[0]?.name ?? dict.accountUi.technician;

  return (
    <div className="container-page max-w-5xl py-8 lg:py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
        {dict.accountUi.technicianWorkspace}
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {dict.accountUi.jobsAndServiceNotes}
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-stone">
        {dict.accountUi.technicianIntro}
      </p>

      <Button
        variant="secondary"
        className="mt-6"
        onClick={() =>
          add({
            id: createReference("REP"),
            kind: "repairs",
            title: dict.accountUi.hingeAdjustment,
            detail: "Yasamal · 10:00–12:00",
            technician,
          })
        }
      >
        <Wrench size={15} /> {dict.accountUi.addJob}
      </Button>

      <div className="mt-8">
        <ActivityFeed section="all" locale={locale} manage />
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">{dict.accountUi.jobCompletion}</h2>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            add({
              id: createReference("SRV"),
              kind: "repairs",
              title: dict.accountUi.serviceCompletionNote,
              detail: `${dict.accountUi.workDone}: ${note}\n${dict.accountUi.usedParts}: ${parts}`,
              technician,
            });
            setSaved(true);
            setNote("");
            setParts("");
          }}
        >
          <Field label={dict.accountUi.diagnosisAndWork} required>
            <Textarea
              required
              minLength={10}
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={dict.accountUi.diagnosisPlaceholder}
            />
          </Field>

          <Field label={dict.accountUi.spareParts} required>
            <Input
              required
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              placeholder={dict.accountUi.sparePartsPlaceholder}
            />
          </Field>

          <Checkbox required label={dict.accountUi.customerAccepted} />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">{dict.accountUi.saveServiceNote}</Button>
            {saved && (
              <p role="status" className="flex items-center gap-1.5 text-[13px] text-success">
                <CheckCircle2 size={15} /> {dict.accountUi.serviceHistoryAdded}
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
