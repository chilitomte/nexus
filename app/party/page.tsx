import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { PartyDetails } from "@/components/party-details";
import { PartyGallery } from "@/components/party-gallery";
import { RsvpSection } from "@/components/rsvp-section";
import { getSessionStatus } from "@/lib/auth";
import { getAttendees, getGalleryImages, isSupabaseConfigured } from "@/lib/data";
import { partyContent } from "@/lib/party-content";
import { CoCreation } from "@/components/co-creation";

export const dynamic = "force-dynamic";

export default async function PartyPage() {
  const isAuthenticated = await getSessionStatus();

  if (!isAuthenticated) {
    redirect("/");
  }

  const [attendees, galleryImages] = await Promise.all([
    getAttendees(),
    getGalleryImages(),
  ]);

  return (
    <main className="relative isolate overflow-hidden px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8">
        <header className="glass-panel flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="space-y-3">
                <h1 className="hero-title text-center text-5xl sm:text-6xl">
                  {partyContent.title}
                </h1>
                <p className="max-w-3xl whitespace-pre-line text-lg leading-8 text-white/78">
                  {partyContent.intro}
                </p>
              </div>
            </div>
            
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {partyContent.highlights.map((highlight) => (
              <article key={highlight.label} className="aurora-card">
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">
                  {highlight.label}
                </p>
                <p className="mt-4 text-xl text-white">{highlight.value}</p>
              </article>
            ))}
          </div>
        </header>
        
        <PartyGallery images={galleryImages} />
        <PartyDetails />
        <CoCreation />
      </div>
      
      <div className="fractal-ring fractal-ring-top" />
      <div className="fractal-ring fractal-ring-bottom" />
      <div className="grid-burst grid-burst-large" />
      <LogoutButton />
    </main>
  );
}
