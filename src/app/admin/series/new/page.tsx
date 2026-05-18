"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SeriesForm } from "@/components/admin/SeriesForm";
import { adminApi } from "@/lib/admin/api-client";

export default function NewSeriesPage() {
  const router = useRouter();
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    adminApi.getGenres().then((r) => setGenres(r.genres));
  }, []);

  return (
    <SeriesForm
      availableGenres={genres}
      submitLabel="Tạo truyện"
      onSubmit={async (values) => {
        const { series } = await adminApi.createSeries(values);
        router.push(`/admin/series/${series.id}`);
      }}
    />
  );
}
