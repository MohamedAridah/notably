import AuthHeader from "./_components/header";

export const metadata = {
  title: {
    default: "Join Notably",
    template: "%s - Notably",
  },
  description:
    "Access your Notably account to capture, organize, and link your notes, code snippets, and personal insights seamlessly.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const height = `calc(100vh - 4rem)`; // 4rem is the height of the header
  return (
    <section className="flex flex-col min-h-dvh">
      <AuthHeader />
      <div
        className={`w-full max-w-md md:max-w-lg mx-auto min-h-[${height}] my-auto py-14`}
      >
        {children}
      </div>
    </section>
  );
}
