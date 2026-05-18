import { notFound } from "next/navigation";
import { PurchaseClient } from "@/app/series/[slug]/purchase/PurchaseClient";
import { getSeriesBySlug } from "@/lib/data/catalog";

interface PurchasePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);
  if (!series) notFound();
  return <PurchaseClient series={series} />;
}
