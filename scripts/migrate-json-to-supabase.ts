/**
 * One-time migration: JSON files → Supabase PostgreSQL
 *
 * Usage:
 *   cd web
 *   npx tsx scripts/migrate-json-to-supabase.ts
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);
const dataDir = path.join(process.cwd(), "data");

async function main() {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(dataDir, "catalog.json"), "utf-8"),
  );

  for (const genre of catalog.genres as string[]) {
    await supabase.from("genres").upsert({ name: genre }, { onConflict: "name" });
  }

  for (const s of catalog.series) {
    await supabase.from("series").upsert({
      id: s.id,
      slug: s.slug,
      title: s.title,
      type: s.type,
      synopsis: s.synopsis,
      cover_url: s.coverUrl,
      genres: s.genres,
      status: s.status,
      tagline: s.tagline ?? null,
      is_premium: s.isPremium ?? false,
      price: s.price ?? 0,
    });
  }

  const chaptersDir = path.join(dataDir, "chapters");
  for (const file of fs.readdirSync(chaptersDir)) {
    if (!file.endsWith(".json")) continue;
    const seriesId = file.replace(".json", "");
    const chapters = JSON.parse(
      fs.readFileSync(path.join(chaptersDir, file), "utf-8"),
    );

    for (const ch of chapters) {
      const contentPath = path.join(
        dataDir,
        "content",
        seriesId,
        `${ch.id}.md`,
      );
      let markdown: string | null = null;
      if (fs.existsSync(contentPath)) {
        markdown = fs.readFileSync(contentPath, "utf-8");
      }

      await supabase.from("chapters").upsert({
        id: ch.id,
        series_id: seriesId,
        title: ch.title,
        file_path: ch.file,
        content_markdown: markdown,
        sort_order: ch.order,
        is_locked: ch.isLocked ?? false,
        published_at: ch.timestamp
          ? new Date(ch.timestamp).toISOString()
          : null,
      });
    }
  }

  const users = JSON.parse(
    fs.readFileSync(path.join(dataDir, "users.json"), "utf-8"),
  );
  console.warn(
    `Skipping ${users.length} JSON users — recreate via Supabase Auth signup or import via dashboard.`,
  );

  const purchases = JSON.parse(
    fs.readFileSync(path.join(dataDir, "purchase-requests.json"), "utf-8"),
  );
  for (const p of purchases) {
    await supabase.from("purchase_requests").upsert({
      id: p.id,
      user_id: p.userId,
      username: p.username,
      email: p.email,
      series_id: p.seriesId,
      series_slug: p.seriesSlug,
      series_title: p.seriesTitle,
      transfer_note: p.transferNote,
      status: p.status,
      admin_note: p.adminNote ?? null,
      created_at: new Date(p.createdAt).toISOString(),
      reviewed_at: p.reviewedAt
        ? new Date(p.reviewedAt).toISOString()
        : null,
    });
  }

  const entitlements = JSON.parse(
    fs.readFileSync(path.join(dataDir, "entitlements.json"), "utf-8"),
  );
  for (const e of entitlements) {
    await supabase.from("entitlements").upsert({
      user_id: e.userId,
      series_id: e.seriesId,
      series_slug: e.seriesSlug,
      purchase_request_id: e.purchaseRequestId,
      approved_at: new Date(e.approvedAt).toISOString(),
    });
  }

  console.log("Migration complete.");
}

main().catch(console.error);
