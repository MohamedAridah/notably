import CtaButton from "@/app/_components/cta-button";

export default function CallToAction() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Take Your Notes to the Next Level
          </h2>
          <p className="mt-4">
            Fast, local-first, and built for code. Notes that work the way you
            think.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CtaButton size="lg" text="Get Started" />
          </div>
        </div>
      </div>
    </section>
  );
}
