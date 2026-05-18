"use client";

import { useState } from "react";
import { adminApi } from "@/lib/admin/api-client";
import { AdminInput } from "@/components/admin/forms/AdminInput";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

interface GenresManagerProps {
  initialGenres: string[];
}

export function GenresManager({ initialGenres }: GenresManagerProps) {
  const [genres, setGenres] = useState(initialGenres);
  const [newGenre, setNewGenre] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async (next: string[]) => {
    setSaving(true);
    setMessage(null);
    try {
      const { genres: saved } = await adminApi.saveGenres(next);
      setGenres(saved);
      setMessage("Đã lưu thể loại");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const add = () => {
    const g = newGenre.trim();
    if (!g || genres.includes(g)) return;
    void save([...genres, g]);
    setNewGenre("");
  };

  const remove = (g: string) => {
    void save(genres.filter((x) => x !== g));
  };

  return (
    <GlassCard>
      <h1 className="gradient-title mb-2 text-2xl font-bold">🏷️ Thể loại</h1>
      <p className="mb-4 text-sm opacity-70">
        Danh sách tag dùng khi tạo truyện. Xóa tag sẽ gỡ khỏi truyện hiện có.
      </p>

      <ul className="mb-4 flex flex-wrap gap-2">
        {genres.map((g) => (
          <li
            key={g}
            className="flex items-center gap-1 rounded-full border border-[var(--primary)] bg-[var(--chap-card-bg)] pl-3 pr-1 py-1 text-sm font-bold"
          >
            {g}
            <button
              type="button"
              onClick={() => remove(g)}
              className="rounded-full px-2 text-[#e74c3c] hover:bg-black/10"
              aria-label={`Xóa ${g}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <AdminInput
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          placeholder="Thể loại mới..."
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button type="button" variant="primary" onClick={add} disabled={saving}>
          Thêm
        </Button>
      </div>

      {message && (
        <p className="mt-3 text-sm font-semibold text-[var(--primary)]">{message}</p>
      )}
    </GlassCard>
  );
}
