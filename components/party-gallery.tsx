import type { GalleryImage } from "@/lib/types";

type PartyGalleryProps = {
  images: GalleryImage[];
};

export function PartyGallery({ images }: PartyGalleryProps) {
  return (
    <section
      className="glass-panel mx-auto w-full p-6 sm:p-8"
      style={{ maxWidth: 820 }}
    >
      <h2 className="mt-5 text-3xl font-semibold text-white">
          Insipiration on being a magical entity
        </h2> 
        <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-3">
          {images.map((image) => (
            <figure
              key={image.id}
              className="flex-none snap-start"
            >
              <div className="overflow-hidden rounded-[2rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  className="h-[20rem] w-auto rounded-[2rem] object-contain sm:h-[24rem]"
                />
              </div>
            </figure>
          ))}
        </div>
    </section>
  );
}
