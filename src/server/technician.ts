import type { RepairCategoryKey, RepairStatus } from "@/types";
import { db } from "@/server/db";

/**
 * Usta panelinin oxu qatı.
 *
 * Usta yalnız ona təyin edilmiş müraciətləri görür — sorğular
 * `technicianId` ilə məhdudlaşır (PRD §93).
 */

export interface TechnicianJob {
  number: string;
  category: RepairCategoryKey;
  status: RepairStatus;
  description: string;
  address: string;
  customerName: string;
  phone: string;
  scheduledAt: string | null;
  resolution: string | null;
  usedParts: string | null;
  createdAt: string;
}

export interface TechnicianVisit {
  number: string;
  propertyType: string;
  doorCount: number;
  address: string;
  preferredAt: string | null;
  status: string;
}

export interface TechnicianWorkspace {
  id: string;
  name: string;
  completedJobs: number;
  jobs: TechnicianJob[];
  visits: TechnicianVisit[];
  appointments: {
    id: string;
    reference: string;
    type: string;
    date: string;
    startTime: string;
    endTime: string;
    address: string;
    status: string;
  }[];
  orders: {
    id: string;
    number: string;
    status: string;
    total: number;
    createdAt: string;
  }[];
}

/** İstifadəçi hesabına bağlı usta profilini və işlərini qaytarır. */
export async function technicianWorkspace(userId: string): Promise<TechnicianWorkspace | null> {
  const [technician, orders] = await Promise.all([
    db.technician.findFirst({
      where: { userId, archivedAt: null },
      include: {
        repairs: { where: { archivedAt: null }, orderBy: { createdAt: "desc" } },
        measurements: { where: { archivedAt: null }, orderBy: { createdAt: "desc" } },
        appointments: {
          where: { archivedAt: null },
          orderBy: [{ date: "asc" }, { startTime: "asc" }],
        },
      },
    }),
    db.order.findMany({ where: { userId, archivedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!technician) return null;

  return {
    id: technician.id,
    name: technician.name,
    completedJobs: technician.completedJobs,
    jobs: technician.repairs.map((rp) => ({
      number: rp.number,
      category: rp.category as RepairCategoryKey,
      status: rp.status as RepairStatus,
      description: rp.description,
      address: `${rp.city}, ${rp.address}`,
      customerName: rp.name,
      phone: rp.phone,
      scheduledAt: rp.scheduledAt,
      resolution: rp.resolution,
      usedParts: rp.usedParts,
      createdAt: rp.createdAt.toISOString(),
    })),
    visits: technician.measurements.map((m) => ({
      number: m.number,
      propertyType: m.propertyType,
      doorCount: m.doorCount,
      address: `${m.city}, ${m.address}`,
      preferredAt: m.preferredAt,
      status: m.status,
    })),
    appointments: technician.appointments.map((appointment) => ({
      id: appointment.id,
      reference: appointment.reference,
      type: appointment.type,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      address: appointment.address,
      status: appointment.status,
    })),
    orders: orders.map((order) => ({
      id: order.id,
      number: order.number,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
    })),
  };
}
