import type { OrderStatus, RepairStatus } from "@/types";
import { Badge } from "@/components/ui/primitives";

type Tone = "neutral" | "dark" | "gold" | "success" | "warning" | "danger" | "info" | "outline";

const orderTone: Record<OrderStatus, Tone> = {
  DRAFT: "neutral",
  PENDING_PAYMENT: "warning",
  PAID: "info",
  CONFIRMED: "info",
  PROCESSING: "info",
  MANUFACTURING: "gold",
  READY: "gold",
  SHIPPED: "info",
  DELIVERED: "success",
  INSTALLATION_SCHEDULED: "gold",
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
  SCHEDULED: "gold",
  TECHNICIAN_ASSIGNED: "gold",
  ON_THE_WAY: "gold",
  IN_PROGRESS: "gold",
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
