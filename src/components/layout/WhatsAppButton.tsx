import { MessageCircle } from "lucide-react";
import { brand } from "@/config/brand";

/** PRD §125 — WhatsApp əlaqə kanalı. */
export function WhatsAppButton() {
  const number = brand.contact.whatsapp.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ilə yazın"
      className="fixed bottom-20 right-4 z-80 flex h-12 w-12 items-center justify-center rounded-full bg-[#25573f] text-paper shadow-lg transition-transform hover:scale-105 sm:bottom-24 sm:right-6 sm:h-13 sm:w-13"
    >
      <MessageCircle size={21} />
    </a>
  );
}
