# DMT Realm Party Portal

A small `Next.js` + `TypeScript` + `Tailwind CSS` app for a magic-link-protected theme party page with:

- an email magic-link entry screen
- a private party information page
- a horizontally scrollable inspiration gallery backed by Supabase Storage
- an RSVP flow tied to the authenticated Supabase user
- the ability for each signed-in guest to edit only their own RSVP
- a comments section at the bottom of the page with newest messages first

## Stack

- `Next.js 16` App Router
- `TypeScript`
- `Tailwind CSS`
- `Supabase` for authentication, database, and storage
- `Vercel`-ready server routes

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_GALLERY_BUCKET`
3. In Supabase SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql).
4. Create a public storage bucket matching `SUPABASE_GALLERY_BUCKET`.
5. Upload your gallery photos to the bucket root.
6. In Supabase Auth URL configuration, add your local and production callback URLs, for example:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
7. Start the app:

```bash
pnpm dev
```

This app does not use `SUPABASE_SERVICE_ROLE_KEY`. The browser and server both work through the publishable key plus the authenticated Supabase session.

## Gallery workflow

The gallery lists every image found in the configured storage bucket and renders them automatically.

## RSVP data model

The `attendees` table stores:

- `id`
- `user_id`
- `name`
- `nickname`
- `comment`
- `normalized_name`
- `created_at`

`name` is the guest's real name and is stored privately, while `nickname` and
`comment` are what show up in the RSVP list. `user_id` is unique so each
signed-in guest can RSVP only once, and `normalized_name` is unique so entity
names are also blocked case-insensitively.

## Comments data model

The `comments` table stores:

- `id`
- `user_id`
- `author_name`
- `body`
- `created_at`

Comments are shown newest first. Posting a comment currently requires that the signed-in user has already RSVP'd, so each message can be shown with the guest's entity name.

## Deployment

Deploy to Vercel and add the same environment variables there.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_GALLERY_BUCKET`

Also add your production `/auth/callback` URL to Supabase Auth redirect settings.

## Where to edit content

- Party copy: `lib/party-content.ts`
- Login page: `app/page.tsx`
- Private party page: `app/party/page.tsx`
- Styling and visual theme: `app/globals.css`
