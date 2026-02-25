"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TaskToast({ message, tone = "success" }: { message: string; tone?: "success" | "error" }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "error" && "border-rose-200 bg-rose-50 text-rose-800"
      )}
      role="status"
      aria-live="polite"
    >
      <p>{message}</p>
      <Button type="button" variant="ghost" className="h-7 w-7 p-0" onClick={() => setVisible(false)} aria-label="Fechar aviso">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
