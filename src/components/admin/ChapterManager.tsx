"use client";

import { useState } from "react";
import { adminApi } from "@/lib/admin/api-client";
import { ChapterImageUploader } from "@/components/admin/ChapterImageUploader";
import { ScheduleField } from "@/components/admin/forms/ScheduleField";
import {
  AdminInput,
  AdminTextarea,
} from "@/components/admin/forms/AdminInput";
import { FormField } from "@/components/admin/forms/FormField";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Chapter } from "@/lib/types/series";
import { cn } from "@/lib/utils/cn";

interface ChapterManagerProps {
  seriesId: string;
  chapters: Chapter[];
  onRefresh: () => void;
}

export function ChapterManager({
  seriesId,
  chapters,
  onRefresh,
}: ChapterManagerProps) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [schedule, setSchedule] = useState<number | null>(null);
  const [order, setOrder] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setIsLocked(false);
    setSchedule(null);
    setOrder(chapters.length);
  };

  const openNew = () => {
    resetForm();
    setEditingId("new");
    setOrder(chapters.length);
    setContent("## Tiêu đề\n\nNội dung chương...");
  };

  const openEdit = async (chapterId: string) => {
    setBusy(true);
    setError(null);
    try {
      const { chapter, content: md } = await adminApi.getChapter(
        seriesId,
        chapterId,
      );
      setEditingId(chapterId);
      setTitle(chapter.title);
      setContent(md);
      setIsLocked(chapter.isLocked ?? false);
      setSchedule(chapter.timestamp ?? null);
      setOrder(chapter.order);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải chương");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        title,
        content,
        isLocked,
        timestamp: schedule,
        order,
      };

      if (editingId === "new") {
        await adminApi.createChapter(seriesId, payload);
      } else if (editingId) {
        await adminApi.updateChapter(seriesId, editingId, payload);
      }

      resetForm();
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi lưu");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (chapterId: string) => {
    if (!confirm("Xóa chương này?")) return;
    setBusy(true);
    try {
      await adminApi.deleteChapter(seriesId, chapterId);
      if (editingId === chapterId) resetForm();
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xóa");
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassCard as="section" className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">📖 Chương ({chapters.length})</h2>
        <Button type="button" variant="primary" onClick={openNew}>
          + Thêm chương
        </Button>
      </div>

      <ul className="mb-4 flex flex-col gap-2">
        {chapters.map((ch) => (
          <li
            key={ch.id}
            className={cn(
              "flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--chap-card-bg)] px-3 py-2",
              editingId === ch.id && "ring-2 ring-[var(--primary)]",
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 text-left font-semibold hover:text-[var(--primary)]"
              onClick={() => void openEdit(ch.id)}
            >
              <span className="opacity-50">#{ch.order + 1}</span> {ch.title}
              {ch.isLocked && " 🔒"}
              {ch.timestamp && ch.timestamp > Date.now() && " ⏳"}
            </button>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                className="px-3 py-1 text-xs"
                onClick={() => void openEdit(ch.id)}
              >
                Sửa
              </Button>
              <Button
                type="button"
                variant="danger"
                className="px-3 py-1 text-xs"
                onClick={() => void remove(ch.id)}
              >
                Xóa
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {editingId !== null && (
        <div className="rounded-xl border border-[var(--glass-border)] bg-white/30 p-4 [data-theme=dark]:bg-black/20">
          <h3 className="mb-3 font-bold text-[var(--primary)]">
            {editingId === "new" ? "Chương mới" : "Sửa chương"}
          </h3>

          <FormField label="Tiêu đề chương">
            <AdminInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Thứ tự (order)">
            <AdminInput
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
            />
          </FormField>

          <label className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            🔒 Chương premium (khóa)
          </label>

          <ScheduleField value={schedule} onChange={setSchedule} />

          <ChapterImageUploader
            seriesId={seriesId}
            onInsert={(md) => setContent((c) => c + md)}
          />

          <FormField label="Nội dung (Markdown)">
            <AdminTextarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="font-mono text-sm"
            />
          </FormField>

          {error && <p className="mb-2 text-sm text-[#e74c3c]">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              disabled={busy}
              onClick={() => void save()}
            >
              {busy ? "..." : "Lưu chương"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Hủy
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
