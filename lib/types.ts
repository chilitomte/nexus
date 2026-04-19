export type Attendee = {
  id: string;
  name: string;
  createdAt: string;
};

export type GalleryImage = {
  url: string;
  sortOrder: number;
};

export function normalizeGuestName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
