"use client";

import { motion } from "motion/react";
import {
  ChartLine,
  TelegramLogo,
  Waves,
  Crosshair,
  Brain,
  Eye,
  Lightning,
  ShieldCheck,
  ArrowRight,
  Terminal,
  Globe,
  Gauge,
  CaretRight,
} from "@phosphor-icons/react";

const TELEGRAM_LINK = "https://t.me/smartmoneycryptotraders";
const DASHBOARD_LINK = "/follow";
const COURSE_LINK = "https://course.smartmoneycryptoph.tech";

const FEATURES = [
  {
    icon: Waves,
    title: "Asia Session Screener",
    desc: "Auto-scans CMC top 100 every 30 min. Alerts when Asia/London highs & lows are swept with session confluence.",
    tag: "Pure Data",
    accent: "amber",
  },
  {
    icon: ChartLine,
    title: "Liquidation Heatmap",
    desc: "Plasma-colored heatmap showing liquidation clusters. Yellow = massive magnet. BSL/SSL auto-labeled on chart.",
    tag: "Price Magnet",
    accent: "amber",
  },
  {
    icon: Eye,
    title: "Triple Screener",
    desc: "3-layer funnel every 4 hours. CMC top 100 → whale OI spike → session sweep confluence.",
    tag: "No AI",
    accent: "amber",
  },
  {
    icon: Brain,
    title: "AI Alpha Brief",
    desc: "6:30 PM PHT brief. Synthesizes whale OI, news, macro into 3 high-probability setups with R:R.",
    tag: "AI Powered",
    accent: "amber",
  },
  {
    icon: Crosshair,
    title: "ICT Top-Down Analysis",
    desc: "Full ICT protocol: 1D bias → 4H structure → 1H entry → 5M trigger. OB, FVG, BOS, ChoCH annotated.",
    tag: "ICT / SMC",
    accent: "amber",
  },
  {
    icon: Lightning,
    title: "Whale Tracker",
    desc: "Hyperliquid + Coinglass OI monitoring. Alerts on $1M+ positions, cross-referenced with technical levels.",
    tag: "On-Chain",
    accent: "amber",
  },
];

const COMMANDS = [
  { cmd: "/asia BTC",     desc: "Asia H/L, EQ, PDH/PDL, PWH/PWL + 15m chart" },
  { cmd: "/liqmap BTC",   desc: "Liquidation heatmap — yellow = price magnet" },
  { cmd: "/screen",       desc: "Triple screen: 100 coins → whale → sweep" },
  { cmd: "/brief",        desc: "Morning alpha brief + 3 setups to watch" },
  { cmd: "/topdown BTC",  desc: "ICT full top-down multi-timeframe" },
  { cmd: "/whales",       desc: "Hyperliquid + Coinglass whale positioning" },
  { cmd: "/chart BTC 4H", desc: "Clean chart with EMA, RSI, MACD" },
  { cmd: "/research BTC", desc: "4-layer deep dive: price + on-chain + web" },
];

const STATS = [
  { value: "100+", label: "Coins Screened" },
  { value: "24/7", label: "Monitoring" },
  { value: "3",    label: "Brokers Wired" },
  { value: "Free", label: "To Join" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

function TerminalMockup() {
  const lines = [
    { t: 200,  text: "$ /asia BTC",                           color: "text-amber-400" },
    { t: 600,  text: "BTCUSDT  14:32 PHT | London Session",   color: "text-zinc-300" },
    { t: 800,  text: "PWH    $107,200  +1.22%  [ERL]",        color: "text-amber-300" },
    { t: 900,  text: "Asia H $105,940  SWEPT 07:30  [ERL]",   color: "text-rose-400" },
    { t: 1000, text: "=== NOW  $105,855  [BULLISH BOS]",      color: "text-emerald-400" },
    { t: 1100, text: "EQ     $105,210  -0.61%  [IRL]",        color: "text-zinc-500" },
    { t: 1200, text: "Asia L $104,480  -1.30%  [ERL]",        color: "text-sky-400" },
    { t: 1500, text: "$ /liqmap BTC 1h",                      color: "text-amber-400" },
    { t: 1900, text: "Generating heatmap...",                  color: "text-zinc-600" },
    { t: 2300, text: "BSL: $107,200  SSL: $104,480  sent.",   color: "text-emerald-400" },
  ];

  return (
    <div className="relative w-full max-w-xl font-mono text-xs rounded-xl border border-amber-500/20 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-amber-500/5">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 via-transparent to-transparent pointer-events-none" />
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/60 bg-black/40">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-zinc-600 text-[10px] tracking-wider">SmartMoneyCryptoPH Terminal</span>
        <span className="ml-auto flex items-center gap-1 text-[9px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="p-5 space-y-2 min-h-[240px]">
        {lines.map((ln, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ln.t / 1000, duration: 0.25 }}
            className={`leading-relaxed tracking-wide ${ln.color}`}
          >
            {ln.text}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block w-1.5 h-3.5 bg-amber-400 align-middle"
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#080808] text-zinc-50 overflow-x-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-500/4 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-600/3 rounded-full blur-[100px]" />
      </div>

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/40 bg-black/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <span className="text-amber-400 font-mono text-[10px] font-black">S</span>
            </div>
            <span className="font-mono text-sm font-bold text-zinc-100 tracking-wider">SMCPH</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-mono text-zinc-500">
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#commands" className="hover:text-amber-400 transition-colors">Commands</a>
            <a href={COURSE_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">G.O.L.D.</a>
            <a href={DASHBOARD_LINK} className="hover:text-amber-400 transition-colors">Dashboard</a>
          </div>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25"
          >
            <TelegramLogo weight="fill" size={13} />
            Join Free
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7">

            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 text-amber-400 text-[11px] font-mono uppercase tracking-widest backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Bot Active
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-mono text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              <span className="text-zinc-100">Institutional</span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Trading Intelligence
              </span>
              <br />
              <span className="text-zinc-400 text-3xl md:text-4xl font-bold">in your Telegram</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-zinc-400 text-sm leading-relaxed max-w-[50ch] font-mono">
              ICT + Smart Money Concepts. Asia session sweeps, liquidation heatmaps,
              whale positioning, AI alpha briefs - delivered 24/7, no charts app needed.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-mono font-bold rounded-lg transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                <TelegramLogo weight="fill" size={16} />
                Join Free Channel
              </a>
              <a
                href={DASHBOARD_LINK}
                className="flex items-center gap-2 px-6 py-3 border border-zinc-700/60 hover:border-amber-500/40 bg-zinc-900/40 hover:bg-amber-500/5 backdrop-blur-sm text-zinc-300 hover:text-amber-400 text-sm font-mono rounded-lg transition-all duration-200"
              >
                <Gauge size={15} />
                Live Dashboard
                <ArrowRight size={13} />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-8 pt-2">
              {STATS.map(({ value, label }) => (
                <div key={label} className="space-y-0.5">
                  <div className="font-mono text-2xl font-black text-amber-400 tabular-nums">{value}</div>
                  <div className="text-[11px] text-zinc-600 font-mono">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex justify-center"
          >
            <TerminalMockup />
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <span className="text-[11px] font-mono text-amber-400/70 uppercase tracking-[0.2em]">What You Get</span>
            <h2 className="mt-3 font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Every Edge. One Bot.
            </h2>
            <p className="mt-3 text-sm text-zinc-500 font-mono max-w-[55ch]">
              No subscriptions, no extra apps. Everything runs in Telegram and lands in your chat when it matters.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {FEATURES.map(({ icon: Icon, title, desc, tag }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group relative p-5 rounded-xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm hover:border-amber-500/30 hover:bg-amber-500/3 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/4 group-hover:to-transparent transition-all duration-500 pointer-events-none rounded-xl" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Icon size={16} className="text-amber-400" weight="duotone" />
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/8 text-amber-400/70 uppercase tracking-wider">
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-mono text-sm font-semibold text-zinc-100 mb-2">{title}</h3>
                  <p className="text-xs text-zinc-500 font-mono leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Commands ── */}
      <section id="commands" className="relative py-24 px-6 border-t border-zinc-800/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <span className="text-[11px] font-mono text-amber-400/70 uppercase tracking-[0.2em]">Commands</span>
            <h2 className="mt-3 font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Type. Get Alpha.
            </h2>
            <p className="mt-3 text-sm text-zinc-500 font-mono max-w-[55ch]">
              Or ask anything in plain language. The AI synthesizes Hyperliquid, Binance, CMC, and Coinglass automatically.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {COMMANDS.map(({ cmd, desc }) => (
              <motion.div
                key={cmd}
                variants={fadeUp}
                className="group flex items-center gap-4 p-4 rounded-lg border border-zinc-800/40 bg-zinc-900/20 hover:border-amber-500/25 hover:bg-amber-500/3 backdrop-blur-sm transition-all duration-200"
              >
                <CaretRight size={12} className="text-amber-500/60 group-hover:text-amber-400 transition-colors shrink-0" />
                <div className="flex-1 min-w-0">
                  <code className="text-sm font-mono font-bold text-amber-300 group-hover:text-amber-200 transition-colors">{cmd}</code>
                  <p className="text-[11px] text-zinc-600 font-mono mt-0.5 truncate">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative py-24 px-6 border-t border-zinc-800/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <span className="text-[11px] font-mono text-amber-400/70 uppercase tracking-[0.2em]">How It Works</span>
            <h2 className="mt-3 font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">Three Steps</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { step: "01", icon: TelegramLogo, title: "Join the Channel", desc: "Free access. The bot posts automated briefs, sweep alerts, and whale moves directly into the group." },
              { step: "02", icon: Globe,         title: "Get Live Alerts",  desc: "Asia session sweeps, liquidation cluster updates, whale positioning - all push to your phone automatically." },
              { step: "03", icon: ShieldCheck,   title: "Trade with Confluence", desc: "Combine ICT levels, liq heatmap, and whale data for high-probability setups with clear entries and invalidations." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="relative p-6 rounded-xl border border-zinc-800/40 bg-zinc-900/20 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute top-4 right-4 font-mono text-5xl font-black text-zinc-900 select-none leading-none">{step}</div>
                <div className="relative">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 inline-flex mb-4">
                    <Icon size={18} className="text-amber-400" weight="duotone" />
                  </div>
                  <h3 className="font-mono text-sm font-bold text-zinc-100 mb-2">{title}</h3>
                  <p className="text-xs text-zinc-500 font-mono leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── G.O.L.D. Framework ── */}
      <section className="relative py-24 px-6 border-t border-zinc-800/40">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/2 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="text-[11px] font-mono text-amber-400/70 uppercase tracking-[0.2em]">Free Education</span>
              <h2 className="mt-4 font-mono text-3xl md:text-4xl font-black tracking-tight">
                Master the{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  G.O.L.D.
                </span>{" "}
                <span className="text-zinc-100">Framework</span>
              </h2>
              <p className="mt-4 text-sm text-zinc-500 font-mono leading-relaxed max-w-[50ch]">
                The institutional trading system built for Filipino crypto futures traders.
                Read the market like a whale - Grand Flow, Origin Zone, Liquidity Hunt, Discipline Entry.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                {[
                  { label: "Grand Flow",       desc: "HTF bias identification" },
                  { label: "Origin Zone",      desc: "Institutional entry mapping" },
                  { label: "Liquidity Hunt",   desc: "Session-based timing" },
                  { label: "Discipline Entry", desc: "Execution confirmation" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg border border-amber-500/15 bg-amber-500/4 backdrop-blur-sm">
                    <div className="text-xs font-mono font-bold text-amber-400">{item.label}</div>
                    <div className="text-[10px] font-mono text-zinc-600 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={COURSE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-mono font-bold rounded-lg transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
                >
                  Begin Your Training
                  <ArrowRight size={14} weight="bold" />
                </a>
                <a
                  href={COURSE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-zinc-700/60 hover:border-amber-500/40 bg-zinc-900/30 hover:bg-amber-500/5 backdrop-blur-sm text-zinc-400 hover:text-amber-400 text-sm font-mono rounded-lg transition-all duration-200"
                >
                  Learn the Framework
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/15 bg-zinc-900/30 backdrop-blur-md p-6 space-y-3">
              <div className="text-[10px] font-mono text-amber-400/50 uppercase tracking-[0.2em] mb-5">SMC Toolkit Included</div>
              {[
                "Break of Structure (BOS)",
                "Fair Value Gaps (FVG)",
                "Order Blocks (OB)",
                "Inducement + Liquidity Sweep",
                "NY Open Kill Zone (8-11 PM PHT)",
                "Minimum 1:3 Risk-Reward",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs font-mono text-zinc-400 py-1.5 border-b border-zinc-800/60 last:border-0">
                  <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                  {item}
                </div>
              ))}
              <div className="pt-3 text-[10px] font-mono text-zinc-700">
                Tuned for Philippine Standard Time trading windows
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-6 border-t border-zinc-800/40">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/3 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <div className="p-12 rounded-2xl border border-amber-500/15 bg-zinc-900/40 backdrop-blur-xl shadow-2xl shadow-black/50">
            <span className="text-[11px] font-mono text-amber-400/70 uppercase tracking-[0.2em]">Free Access - Join Now</span>
            <h2 className="mt-4 font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Start Trading Smarter
            </h2>
            <p className="mt-4 text-sm text-zinc-500 font-mono leading-relaxed max-w-[46ch] mx-auto">
              ICT methodology, real data, no noise. Free to join. No subscriptions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-mono font-bold rounded-lg transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                <TelegramLogo weight="fill" size={16} />
                Join Telegram Channel
              </a>
              <a
                href={DASHBOARD_LINK}
                className="flex items-center gap-2 px-6 py-3.5 border border-zinc-700/60 hover:border-amber-500/40 bg-zinc-900/30 hover:bg-amber-500/5 backdrop-blur-sm text-zinc-400 hover:text-amber-400 text-sm font-mono rounded-lg transition-all duration-200"
              >
                Open Live Dashboard
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/40 py-8 px-6 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-400 font-mono text-[9px] font-black">S</span>
            </div>
            <span className="font-mono text-xs font-bold text-zinc-500">SMCPH</span>
            <span className="text-zinc-700 text-xs font-mono">SmartMoneyCryptoPH</span>
          </div>
          <p className="text-[11px] text-zinc-700 font-mono text-center">
            Educational purposes only. Not financial advice. Trading carries risk.
          </p>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-amber-400 transition-colors"
          >
            <TelegramLogo size={13} />
            t.me/smartmoneycryptotraders
          </a>
        </div>
      </footer>
    </div>
  );
}
