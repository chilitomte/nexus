import type { GalleryImage } from "@/lib/types";

type PartyGalleryProps = {
  images: GalleryImage[];
};

export function PartyGallery({ images }: PartyGalleryProps) {
  return (
    <section className="glass-panel p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Inspiration for being an entity:
          </h2>
        </div>
      </div>

      {images.length ? (
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-3">
          {images.map((image) => (
            <figure key={image.id} className="gallery-card snap-start">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/12 bg-white/6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 space-y-2">
                <p className="text-lg text-white">{image.alt}</p>
                {image.caption ? (
                  <p className="text-sm leading-7 text-white/65">
                    {image.caption}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-dashed border-white/18 bg-black/18 p-6 text-sm leading-7 text-white/68">
          Upload your curated lookbook photos to the configured Supabase bucket,
          then update the gallery manifest in <code>lib/party-content.ts</code>{" "}
          with the file paths and captions you want to display.
        </div>
      )}
    </section>
  );
}
