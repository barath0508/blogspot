"use client";

import { useEffect, useState } from "react";

export type ToastMessage = {
  id: number;
  message: string;
  type?: "success" | "info";
};

export const toast = {
  success: (message: string) => {
    window.dispatchEvent(
      new CustomEvent("insightdaily-toast", { detail: { message, type: "success" } })
    );
  },
  info: (message: string) => {
    window.dispatchEvent(
      new CustomEvent("insightdaily-toast", { detail: { message, type: "info" } })
    );
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: CustomEvent<{ message: string; type: "success" | "info" }>) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, ...e.detail }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener("insightdaily-toast", handleToast as EventListener);
    return () => {
      window.removeEventListener("insightdaily-toast", handleToast as EventListener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-up bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 min-w-[200px]"
        >
          {t.type === "success" ? (
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
