"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConfigurationSelection } from "@/types";

export type WorkflowRecord = { id: string; kind: string; title: string; date: string; status: string; detail: string; total?: number; technician?: string; history: { status: string; date: string }[] };
export type SavedDesign = { id: string; productSlug: string; productName: string; selection: ConfigurationSelection; total: number; date: string };
interface WorkflowState {
  records: WorkflowRecord[];
  designs: SavedDesign[];
  add: (record: Omit<WorkflowRecord, "date" | "status" | "history">) => void;
  update: (id: string, status: string, technician?: string) => void;
  save: (design: SavedDesign) => void;
}
export const useWorkflow = create<WorkflowState>()(persist((set) => ({
  records: [], designs: [],
  add: (record) => set((s) => ({ records: [{ ...record, date: new Date().toISOString(), status: "new", history: [{ status: "new", date: new Date().toISOString() }] }, ...s.records] })),
  update: (id, status, technician) => set((s) => ({ records: s.records.map((r) => r.id === id ? { ...r, status, technician: technician ?? r.technician, history: [...r.history, { status, date: new Date().toISOString() }] } : r) })),
  save: (design) => set((s) => ({ designs: [design, ...s.designs.filter((d) => d.id !== design.id)] })),
}), { name: "ep-workflows-v1" }));
