"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChapterManager } from "@/components/admin/ChapterManager";
import { SeriesForm } from "@/components/admin/SeriesForm";
import { adminApi } from "@/lib/admin/api-client";
import type { Chapter, Series } from "@/lib/types/series";
import { Button } from "@/components/ui/Button";

export default function EditSeriesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [series, setSeries] = useState<Series | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [seriesRes, genresRes] = await Promise.all([
      adminApi.getSeries(id),
      adminApi.getGenres(),
    ]);
    setSeries(seriesRes.series);
    setChapters(seriesRes.chapters);
    setGenres(genresRes.genres);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !series) {
    return <p className="opacity-60">Đang tải...</p>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button href={`/series/${series.slug}`} variant="outline">
          👁 Xem trên site
        </Button>
      </div>

      <SeriesForm
        initial={series}
        availableGenres={genres}
        submitLabel="Cập nhật truyện"
        onSubmit={async (values) => {
          const { series: updated } = await adminApi.updateSeries(id, values);
          setSeries(updated);
        }}
        onDelete={async () => {
          await adminApi.deleteSeries(id);
          router.push("/admin/series");
        }}
      />

      <ChapterManager
        seriesId={id}
        chapters={chapters}
        onRefresh={() => void load()}
      />
    </>
  );
}
