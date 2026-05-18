import { GenresManager } from "@/components/admin/GenresManager";
import { getGenres } from "@/lib/data/repository/catalog-repository";

export default async function AdminGenresPage() {
  const genres = await getGenres();
  return <GenresManager initialGenres={genres} />;
}
