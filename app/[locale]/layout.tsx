import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Tajawal } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { isLocaleRtl, routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "@/app/globals.css";
import { setRequestLocale } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Notably . Think Better",
  description:
    "Supercharge your workflow with Notably — the smartest way to capture, organize, and link dev notes, code snippets, and technical insights",
  authors: [
    { name: "Mohamed Aridah", url: "https://github.com/MohamedAridah" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const isRtl = isLocaleRtl(locale);
  const fontClass = isRtl ? tajawal.className : inter.className;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className={`${fontClass} antialiased`}>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster dir={isRtl ? "rtl" : "ltr"} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
