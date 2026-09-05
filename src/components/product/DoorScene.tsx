import { DoorVisual } from "./DoorVisual";
import type { SurfaceStyle } from "@/types";

/** Architectural demo illustration; not a photograph of a completed installation. */
export function DoorScene({ color = "#383e42", variant = 0, title = "Qapı dizaynı" }: { color?: string; variant?: number; title?: string }) {
  const styles: SurfaceStyle[] = ["MODERN", "CLASSIC", "MINIMAL", "LOFT", "NEOCLASSIC", "MODERN"];
  return <div role="img" aria-label={title} className="relative h-full min-h-0 w-full overflow-hidden" style={{ background: variant % 2 ? "#ddd5c7" : "#e8e4dc" }}>
    <div className="absolute inset-y-0 left-0 w-[22%]" style={{ background: "repeating-linear-gradient(90deg,#af9274 0 7px,#977b60 7px 9px)" }} />
    <div className="absolute bottom-0 h-[17%] w-full bg-[#bfb6a6]" style={{ clipPath: "polygon(0 35%,100% 0,100% 100%,0 100%)" }} />
    <div className="absolute inset-y-[5%] left-[29%] w-[49%] drop-shadow-xl"><DoorVisual panelHex={color} style={styles[variant % styles.length]} glass={variant % 3 === 2 ? "SATIN" : "NONE"} handle={variant % 2 ? "BRASS" : "BAR"} smartLock={variant === 4} ambient={false} /></div>
    <div className="absolute bottom-[14%] right-[7%] h-[16%] w-[9%] rounded-b-lg bg-[#85715b]" />
    <div className="absolute bottom-[28%] right-[5%] h-[25%] w-[13%] rounded-[50%] bg-[#66725a] shadow-inner" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />
  </div>;
}
