import AuthHeader from "./_components/header";

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
        className={`w-full max-w-md mx-auto min-h-[${height}] my-auto py-14`}
      >
        {children}
      </div>
    </section>
  );
}
