import { normalizeGuestName, type Attendee, type GalleryImage } from "./types";
import { createClient } from '../utils/server'
import { cookies } from 'next/headers'

type AttendeeInsert = {
  name: string;
  identity: string;
};

type DatabaseAttendeeRow = {
  id: string;
  user_id: string;
  name: string;
  identity: string;
  created_at: string;
};

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

function getGalleryBucketName() {
  return process.env.SUPABASE_GALLERY_BUCKET?.trim() || "nexus-images";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl());
}

function mapAttendee(row: DatabaseAttendeeRow): Attendee {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    identity: row.identity,
    createdAt: row.created_at,
  };
}

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function getAttendees() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!supabase) {
    return [] satisfies Attendee[];
  }

  const { data, error } = await supabase
    .from("attendees")
    .select("id,user_id,name,identity,created_at")
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

export async function createAttendee({ name, identity }: AttendeeInsert) {
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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false as const,
      status: 401,
      error: "You need to sign in before joining the Nexus.",
    };
  }

  const { data: existingAttendee, error: existingError } = await supabase
    .from("attendees")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return {
      ok: false as const,
      status: 500,
      error: "We could not verify your current RSVP status.",
    };
  }

  if (existingAttendee) {
    return {
      ok: false as const,
      status: 409,
      error: "You have already been loaded into the Nexus.",
    };
  }

  const { data, error } = await supabase
    .from("attendees")
    .insert({
      user_id: user.id,
      name,
      identity,
      normalized_name: normalizedName,
    })
    .select("id,user_id,name,identity,created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false as const,
        status: 409,
        error: "That spirit name is already taken. Choose another one.",
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
