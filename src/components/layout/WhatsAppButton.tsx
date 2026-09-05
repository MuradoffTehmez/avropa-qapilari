import { MessageCircle } from "lucide-react";
import { brand } from "@/config/brand";

/** WhatsApp əlaqə kanalı. Nömrə boşdursa göstərilmir. */
export function WhatsAppButton() {
  const number = brand.contact.whatsapp.replace(/[^0-9]/g, "");
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ilə yazın"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#1f6b4e] text-paper shadow-lg transition-transform hover:scale-105 lg:bottom-6 lg:right-6 lg:h-13 lg:w-13"
    >
      <MessageCircle size={21} />
    </a>
  );
}
