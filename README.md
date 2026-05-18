# MirAi Reader (Next.js)

Modern reader UI for MirAi — runs alongside the legacy static site in the parent folder.

## Requirements

- Node.js **18.18+** (recommended 20+)

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Chapter markdown is read from `../chapters/` (repo root).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — continue reading, favorites, purchased preview |
| `/library` | Full library (favorites + continue) |
| `/library/purchased` | Purchased stories (localStorage demo) |
| `/library/history` | Reading history |
| `/series/mirai` | Story detail + chapter list with progress |
| `/series/mirai/read/[chapterId]` | Immersive reader |
| `/admin` | Solo admin dashboard (password protected) |
| `/admin/series` | CRUD series + chapters |
| `/admin/genres` | Manage genre tags |

### Admin login

Default password: `mirai-studio` (override with `ADMIN_PASSWORD` in `.env.local`).

Data is stored in `web/data/` as JSON + markdown (auto-seeded from legacy `mirai-chapters.json` on first run).

## Local storage

All reader data is stored under `mirai_library` in localStorage:

- Continue reading + scroll progress %
- Favorites (series slugs)
- Purchased series/chapters (demo, no real payment)
- Reading history (last 50 entries)

Legacy keys (`mirai_bookmark`, `mirai_continue_*`, `mirai_pos_*`) are synced automatically.

## Build

```bash
npm run build
npm start
```
