export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh [--secondary:var(--marketing-secondary)]">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col border-x border-border">
        <div className="absolute left-6 top-0 z-10 block h-full w-px border-l border-border pointer-events-none" />
        <div className="absolute right-6 top-0 z-10 block h-full w-px border-r border-border pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
