import { GenresManager } from "@/components/admin/GenresManager";
import { getGenres } from "@/lib/data/repository/catalog-repository";

export default function AdminGenresPage() {
  return <GenresManager initialGenres={getGenres()} />;
}
