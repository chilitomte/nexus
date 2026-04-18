import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSessionStatus } from "@/lib/auth";

export default async function HomePage() {
  const isAuthenticated = await getSessionStatus();

  if (isAuthenticated) {
    redirect("/party");
  }

  return (
    <main className="relative isolate overflow-hidden px-5 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center gap-8">
        <h1 className="hero-title text-center text-[2.7rem] sm:text-6xl">
          Welcome to the visionary realm
        </h1>
        <section className="w-full">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
