import CtaButton from "@/components/utils/cta-button";
import { useTranslations } from "next-intl";

export default function CallToAction() {
  const t = useTranslations("HomePage.CallToAction");

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4">{t("subTitle")}</p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <CtaButton size="lg" text={t("buttonText")} />
          </div>
        </div>
      </div>
    </section>
  );
}
