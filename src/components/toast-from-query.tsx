"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type Tone = "success" | "error";

type ToastFromQueryProps = {
  keyName?: string;
  messages: Record<string, { message: string; tone: Tone }>;
};

const ToastFromQueryInner = ({
  keyName = "toast",
  messages,
}: ToastFromQueryProps) => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const key = params.get(keyName);
    if (!key) return;

    const payload = messages[key];
    if (payload) {
      if (payload.tone === "success") toast.success(payload.message);
      else toast.error(payload.message);
    }

    const next = new URLSearchParams(params.toString());
    next.delete(keyName);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [keyName, messages, params, pathname, router]);

  return null;
};

/**
 * Wrapped in Suspense because useSearchParams requires it
 * in Next.js App Router.
 */
export const ToastFromQuery = (props: ToastFromQueryProps) => (
  <Suspense fallback={null}>
    <ToastFromQueryInner {...props} />
  </Suspense>
);
