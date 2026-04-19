import type { GalleryImage } from "@/lib/types";

type PartyGalleryProps = {
  images: GalleryImage[];
};

export function PartyGallery({ images }: PartyGalleryProps) {
  return (
    <section className="glass-panel p-6 sm:p-8">
      {images.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <figure key={image.id} className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/6">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </figure>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-white/18 bg-black/18 p-6 text-sm leading-7 text-white/68">
          Upload images to the configured Supabase bucket and they will appear here automatically.
        </div>
      )}
    </section>
  );
}
