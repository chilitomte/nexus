import { normalizeGuestName, type Attendee, type Comment, type GalleryImage } from "./types";
import { createClient } from '../utils/server'
import { cookies } from 'next/headers'

type AttendeeInsert = {
  name: string;
  nickname: string;
  comment: string;
};

type AttendeeUpdate = AttendeeInsert;

type DatabaseAttendeeRow = {
  id: string;
  user_id: string;
  name: string;
  nickname: string;
  comment: string;
  created_at: string;
};

type CommentInsert = {
  body: string;
};

type DatabaseCommentRow = {
  id: string;
  user_id: string;
  author_name: string;
  body: string;
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
    nickname: row.nickname,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

function mapComment(row: DatabaseCommentRow): Comment {
  return {
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name,
    body: row.body,
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
    .select("id,user_id,name,nickname,comment,created_at")
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

export async function getComments() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return [] satisfies Comment[];
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id,user_id,author_name,body,created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] satisfies Comment[];
  }

  return data.map(mapComment);
}

export async function createAttendee({ name, nickname, comment }: AttendeeInsert) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (!supabase) {
    return {
      ok: false as const,
      status: 503,
      error: "Supabase is not configured yet.",
    };
  }

  const normalizedName = normalizeGuestName(nickname);
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
      nickname,
      comment,
      normalized_name: normalizedName,
    })
    .select("id,user_id,name,nickname,comment,created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false as const,
        status: 409,
        error: "That entity name is already taken. Choose another one.",
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

export async function updateAttendee({ name, nickname, comment }: AttendeeUpdate) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return {
      ok: false as const,
      status: 503,
      error: "Supabase is not configured yet.",
    };
  }

  const normalizedName = normalizeGuestName(nickname);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false as const,
      status: 401,
      error: "You need to sign in before changing your RSVP.",
    };
  }

  const { data: existingAttendee, error: existingError } = await supabase
    .from("attendees")
    .select("id,nickname")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return {
      ok: false as const,
      status: 500,
      error: "We could not verify your current RSVP status.",
    };
  }

  if (!existingAttendee) {
    return {
      ok: false as const,
      status: 404,
      error: "RSVP before trying to edit your place in the Nexus.",
    };
  }

  const { data, error } = await supabase
    .from("attendees")
    .update({
      name,
      nickname,
      comment,
      normalized_name: normalizedName,
    })
    .eq("user_id", user.id)
    .select("id,user_id,name,nickname,comment,created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false as const,
        status: 409,
        error: "That entity name is already taken. Choose another one.",
      };
    }

    return {
      ok: false as const,
      status: 500,
      error: "The RSVP shimmer shifted before it could be updated.",
    };
  }

  await supabase
    .from("comments")
    .update({ author_name: nickname })
    .eq("user_id", user.id);

  return {
    ok: true as const,
    attendee: mapAttendee(data),
  };
}

export async function createComment({ body }: CommentInsert) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return {
      ok: false as const,
      status: 503,
      error: "Supabase is not configured yet.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false as const,
      status: 401,
      error: "You need to sign in before leaving a message.",
    };
  }

  const { data: attendee, error: attendeeError } = await supabase
    .from("attendees")
    .select("nickname")
    .eq("user_id", user.id)
    .maybeSingle();

  if (attendeeError) {
    return {
      ok: false as const,
      status: 500,
      error: "We could not verify your entity name before posting.",
    };
  }

  if (!attendee) {
    return {
      ok: false as const,
      status: 403,
      error: "RSVP before leaving messages in the Nexus.",
    };
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: user.id,
      author_name: attendee.nickname,
      body,
    })
    .select("id,user_id,author_name,body,created_at")
    .single();

  if (error) {
    return {
      ok: false as const,
      status: 500,
      error: "Your message dissolved before it reached the Nexus.",
    };
  }

  return {
    ok: true as const,
    comment: mapComment(data),
  };
}
