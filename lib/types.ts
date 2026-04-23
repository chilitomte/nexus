export type Attendee = {
  id: string;
  userId: string;
  name: string;
  nickname: string;
  comment: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  userId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export function normalizeGuestName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
