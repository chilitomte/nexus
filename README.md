# DMT Realm Party Portal

A small `Next.js` + `TypeScript` + `Tailwind CSS` app for a password-protected theme party page with:

- a shared-password login screen
- a private party information page
- a horizontally scrollable inspiration gallery backed by Supabase Storage
- an RSVP flow with generated avatars and an attendee wall

## Stack

- `Next.js 16` App Router
- `TypeScript`
- `Tailwind CSS`
- `Supabase` for database + storage
- `Vercel`-ready server routes and proxy protection

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `PARTY_PASSWORD`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_GALLERY_BUCKET`
3. In Supabase SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql).
4. Create a public storage bucket matching `SUPABASE_GALLERY_BUCKET`.
5. Upload your gallery photos to paths matching the entries in `lib/party-content.ts`.
6. Start the app:

```bash
pnpm dev
```

## Gallery workflow

The gallery metadata is intentionally simple for MVP. Update `galleryManifest` inside `lib/party-content.ts` with:

- the storage path
- alt text
- optional caption
- display order

The images themselves live in Supabase Storage. The page converts each path into a public URL at render time.

## RSVP data model

The `attendees` table stores:

- `id`
- `name`
- `normalized_name`
- `avatar_seed`
- `created_at`

`normalized_name` is unique so duplicate names are blocked case-insensitively.

## Deployment

Deploy to Vercel and add the same environment variables there.

- `PARTY_PASSWORD` protects the site
- `SUPABASE_SERVICE_ROLE_KEY` is only used on the server for attendee reads/writes and gallery URL generation

## Where to edit content

- Party copy and gallery manifest: `lib/party-content.ts`
- Login page: `app/page.tsx`
- Private party page: `app/party/page.tsx`
- Styling and visual theme: `app/globals.css`
