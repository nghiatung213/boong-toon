"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/providers/AuthProvider";
import type { AppNotification } from "@/lib/types/notification";
import { cn } from "@/lib/utils/cn";

export function NotificationBell() {
  const { user, unreadCount, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const load = useCallback(async () => {
    if (!user) return;
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = (await res.json()) as { notifications: AppNotification[] };
    setItems(data.notifications);
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && user) void load();
  }, [open, user, load]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !ref.current?.contains(target) &&
        !(target instanceof Element && target.closest("[data-notification-panel]"))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const safeInset = 8;
      const panelWidth = Math.min(320, window.innerWidth - safeInset * 2);
      const isMobile = window.innerWidth < 640;

      const right = isMobile
        ? safeInset
        : Math.max(safeInset, window.innerWidth - rect.right);

      setPanelStyle({
        position: "fixed",
        top: Math.min(rect.bottom + 8, window.innerHeight - 48),
        right,
        width: panelWidth,
        maxWidth: `calc(100vw - ${safeInset * 2}px)`,
        zIndex: 250,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  if (!user) return null;

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    void load();
    void refresh();
  };

  const panel = open ? (
    <>
      <div
        className="fixed inset-0 z-[199] bg-black/20 sm:hidden"
        aria-hidden
        onClick={() => setOpen(false)}
      />
      <div
        data-notification-panel
        style={panelStyle}
        className={cn(
          "overflow-hidden rounded-2xl border border-[var(--glass-border)]",
          "bg-[var(--glass)] shadow-[var(--shadow)] backdrop-blur-xl",
          "max-h-[min(70vh,28rem)]",
        )}
        role="dialog"
        aria-label="Thông báo"
      >
        <div className="border-b border-[var(--glass-border)] px-4 py-3 font-bold">
          Thông báo
        </div>
        <ul className="max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain">
          {items.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm opacity-60">
              Chưa có thông báo
            </li>
          ) : (
            items.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "border-b border-[var(--glass-border)] px-4 py-3 last:border-0",
                  !n.read && "bg-[var(--primary)]/10",
                )}
              >
                <p className="break-words text-sm font-bold leading-snug">
                  {n.title}
                </p>
                <p className="mt-1 break-words text-xs leading-relaxed opacity-80">
                  {n.message}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {n.href && (
                    <Link
                      href={n.href}
                      className="shrink-0 text-xs font-bold text-[var(--primary)]"
                      onClick={() => {
                        void markRead(n.id);
                        setOpen(false);
                      }}
                    >
                      Xem →
                    </Link>
                  )}
                  {!n.read && (
                    <button
                      type="button"
                      className="shrink-0 text-xs opacity-60 hover:opacity-100"
                      onClick={() => void markRead(n.id)}
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  ) : null;

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="relative rounded-full p-2 text-lg transition hover:bg-white/10"
        aria-label="Thông báo"
        aria-expanded={open}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {mounted && panel && typeof window !== "undefined"
        ? createPortal(panel, document.body)
        : null}
    </div>
  );
}
