import dynamic from "next/dynamic";

const CinematicCertifindStory = dynamic(
  () => import("@/components/landing/CinematicCertifindStory"),
  {
    loading: () => (
      <section className="grid min-h-[calc(100svh-4rem)] place-items-center overflow-hidden bg-black px-6 py-16 text-white">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-tight text-cyan-200/80 sm:text-sm">
            CertiFind - From Learning to Legacy
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Every career begins in darkness - with one question: where do I start?
          </h1>
        </div>
      </section>
    ),
  }
);

export default function HomePage() {
  return <CinematicCertifindStory />;
}
