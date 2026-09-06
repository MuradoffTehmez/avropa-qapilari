"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Görünən sahəyə daxil olanda bir dəfə yumşaq keçid edir.
 * JS işləməsə məzmun ilkin olaraq görünür; gizlənmə yalnız effect-dən sonra başlayır.
 */
export function Reveal({ className, children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.dataset.revealVisible = "true";
      return;
    }

    element.dataset.revealReady = "true";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.dataset.revealVisible = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
