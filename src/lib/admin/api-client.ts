async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = (await res.json()) as T & { error?: string };

  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error ?? `Request failed (${res.status})`,
    );
  }

  return data;
}

export const adminApi = {
  login(password: string) {
    return request<{ ok: boolean }>("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  logout() {
    return request<{ ok: boolean }>("/api/admin/auth", { method: "DELETE" });
  },

  checkAuth() {
    return request<{ authenticated: boolean }>("/api/admin/auth");
  },

  listSeries() {
    return request<{
      series: Array<{
        id: string;
        slug: string;
        title: string;
        chapterCount: number;
        lockedCount: number;
        status: string;
        coverUrl: string;
      }>;
    }>("/api/admin/series");
  },

  getSeries(id: string) {
    return request<{
      series: import("@/lib/types/series").Series;
      chapters: import("@/lib/types/series").Chapter[];
    }>(`/api/admin/series/${id}`);
  },

  createSeries(body: unknown) {
    return request<{ series: import("@/lib/types/series").Series }>(
      "/api/admin/series",
      { method: "POST", body: JSON.stringify(body) },
    );
  },

  updateSeries(id: string, body: unknown) {
    return request<{ series: import("@/lib/types/series").Series }>(
      `/api/admin/series/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
    );
  },

  deleteSeries(id: string) {
    return request<{ ok: boolean }>(`/api/admin/series/${id}`, {
      method: "DELETE",
    });
  },

  createChapter(seriesId: string, body: unknown) {
    return request<{ chapter: import("@/lib/types/catalog").ChapterRecord }>(
      `/api/admin/series/${seriesId}/chapters`,
      { method: "POST", body: JSON.stringify(body) },
    );
  },

  getChapter(seriesId: string, chapterId: string) {
    return request<{
      chapter: import("@/lib/types/catalog").ChapterRecord;
      content: string;
    }>(`/api/admin/series/${seriesId}/chapters/${chapterId}`);
  },

  updateChapter(seriesId: string, chapterId: string, body: unknown) {
    return request<{ chapter: import("@/lib/types/catalog").ChapterRecord }>(
      `/api/admin/series/${seriesId}/chapters/${chapterId}`,
      { method: "PATCH", body: JSON.stringify(body) },
    );
  },

  deleteChapter(seriesId: string, chapterId: string) {
    return request<{ ok: boolean }>(
      `/api/admin/series/${seriesId}/chapters/${chapterId}`,
      { method: "DELETE" },
    );
  },

  getGenres() {
    return request<{ genres: string[] }>("/api/admin/genres");
  },

  saveGenres(genres: string[]) {
    return request<{ genres: string[] }>("/api/admin/genres", {
      method: "PUT",
      body: JSON.stringify({ genres }),
    });
  },

  async uploadCover(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data as { url: string };
  },
};
