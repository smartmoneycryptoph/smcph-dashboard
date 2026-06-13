export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="sticky top-0 z-50 h-16 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm flex items-center px-6 gap-6">
        <a href="/" className="font-mono text-sm font-bold text-violet-400 tracking-wider hover:text-violet-300 transition-colors">
          SMCPH
        </a>
        <div className="flex gap-1">
          {[
            { href: "/dashboard", label: "LIQUIDATIONS" },
            { href: "/positions", label: "POSITIONS" },
            { href: "/pnl",       label: "PNL" },
            { href: "/whales",    label: "WHALES" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-zinc-500">LIVE</span>
        </div>
      </nav>
      <main className="min-h-[calc(100dvh-64px)] p-4 md:p-6">
        {children}
      </main>
    </>
  );
}
