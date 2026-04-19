import { normalizeGuestName, type Attendee, type GalleryImage } from "./types";
import { createClient } from '../utils/server'
import { cookies } from 'next/headers'

type AttendeeInsert = {
  name: string;
};

type DatabaseAttendeeRow = {
  id: string;
  name: string;
  created_at: string;
};

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

function getGalleryBucketName() {
  return process.env.SUPABASE_GALLERY_BUCKET?.trim() || "nexus-images";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

function mapAttendee(row: DatabaseAttendeeRow): Attendee {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  };
}

export async function getAttendees() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!supabase) {
    return [] satisfies Attendee[];
  }

  const { data, error } = await supabase
    .from("attendees")
    .select("id,name,created_at")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [] satisfies Attendee[];
  }

  return data.map(mapAttendee);
}

export async function getGalleryImages() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!supabase) {
    return [] satisfies GalleryImage[];
  }

  const bucket = getGalleryBucketName();
  const { data, error } = await supabase.storage
    .from(bucket)
    .list('', { limit: 100 })

  if (error || !data) {
    return [] satisfies GalleryImage[];
  }

  return data
    .map((item, index) => {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(item.name);

      return {
        id: item.id || item.name,
        url: publicUrlData.publicUrl,
        sortOrder: index,
      };
    });
}

export async function createAttendee({ name }: AttendeeInsert) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

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
    })
    .select("id,name,created_at")
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
