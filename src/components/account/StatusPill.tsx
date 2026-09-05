import type { OrderStatus, RepairStatus } from "@/types";
import { Badge } from "@/components/ui/primitives";

type Tone = "neutral" | "dark" | "brass" | "success" | "warning" | "danger" | "info" | "outline";

const orderTone: Record<OrderStatus, Tone> = {
  DRAFT: "neutral",
  PENDING_PAYMENT: "warning",
  PAID: "info",
  CONFIRMED: "info",
  PROCESSING: "info",
  MANUFACTURING: "brass",
  READY: "brass",
  SHIPPED: "info",
  DELIVERED: "success",
  INSTALLATION_SCHEDULED: "brass",
  INSTALLED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
  REFUNDED: "neutral",
};

const repairTone: Record<RepairStatus, Tone> = {
  NEW: "info",
  REVIEWING: "info",
  QUOTE_REQUIRED: "warning",
  WAITING_CUSTOMER: "warning",
  SCHEDULED: "brass",
  TECHNICIAN_ASSIGNED: "brass",
  ON_THE_WAY: "brass",
  IN_PROGRESS: "brass",
  WAITING_FOR_PART: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function OrderStatusPill({ status, label }: { status: OrderStatus; label: string }) {
  return <Badge tone={orderTone[status]}>{label}</Badge>;
}

export function RepairStatusPill({ status, label }: { status: RepairStatus; label: string }) {
  return <Badge tone={repairTone[status]}>{label}</Badge>;
}
