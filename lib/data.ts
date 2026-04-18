import { createClient } from "@supabase/supabase-js";
import { galleryManifest } from "./party-content";
import { normalizeGuestName, type Attendee, type GalleryImage } from "./types";

type AttendeeInsert = {
  name: string;
  avatarSeed: string;
};

type DatabaseAttendeeRow = {
  id: string;
  name: string;
  avatar_seed: string;
  created_at: string;
};

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

function getGalleryBucketName() {
  return process.env.SUPABASE_GALLERY_BUCKET?.trim() || "party-lookbook";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

function getSupabaseAdminClient() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function mapAttendee(row: DatabaseAttendeeRow): Attendee {
  return {
    id: row.id,
    name: row.name,
    avatarSeed: row.avatar_seed,
    createdAt: row.created_at,
  };
}

export async function getAttendees() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [] satisfies Attendee[];
  }

  const { data, error } = await supabase
    .from("attendees")
    .select("id,name,avatar_seed,created_at")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [] satisfies Attendee[];
  }

  return data.map(mapAttendee);
}

export async function getGalleryImages() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [] satisfies GalleryImage[];
  }

  const bucket = getGalleryBucketName();

  return galleryManifest.map((entry) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(entry.path);

    return {
      id: entry.id,
      url: data.publicUrl,
      alt: entry.alt,
      caption: entry.caption,
      sortOrder: entry.sortOrder,
    };
  });
}

export async function createAttendee({ name, avatarSeed }: AttendeeInsert) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: false as const,
      status: 503,
      error: "Supabase is not configured yet.",
    };
  }

  const normalizedName = normalizeGuestName(name);

  const { data, error } = await supabase
    .from("attendees")
    .insert({
      name,
      normalized_name: normalizedName,
      avatar_seed: avatarSeed,
    })
    .select("id,name,avatar_seed,created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false as const,
        status: 409,
        error: "That name has already RSVP'd. Choose a different name variation if needed.",
      };
    }

    return {
      ok: false as const,
      status: 500,
      error: "The RSVP pulse faded before it reached the database.",
    };
  }

  return {
    ok: true as const,
    attendee: mapAttendee(data),
  };
}
