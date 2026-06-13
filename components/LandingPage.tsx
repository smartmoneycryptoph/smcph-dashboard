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
} from "@phosphor-icons/react";

const TELEGRAM_LINK = "https://t.me/smartmoneycryptotraders";
const DASHBOARD_LINK = "/dashboard";

// ── Feature data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Waves,
    title: "Asia Session Screener",
    desc: "Auto-scans CMC top 100 coins every 30 min. Alerts when Asia or London session highs/lows get swept during London and NY.",
    tag: "Pure Data",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: ChartLine,
    title: "Liquidation Heatmap",
    desc: "Plasma-colored heatmap showing where liquidation clusters rest. Yellow = massive magnet. Purple = sparse. BSL/SSL auto-labeled.",
    tag: "Price Magnet",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: Eye,
    title: "Triple Screener",
    desc: "3-layer funnel every 4 hours. Layer A: CMC top 100. Layer B: whale OI or volume spike. Layer C: session sweep confluence.",
    tag: "No AI",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    icon: Brain,
    title: "AI Alpha Brief",
    desc: "Morning brief at 6:30 PM PHT. Synthesizes whale OI, news, macro, and gives 3 high-probability setups with risk/reward.",
    tag: "AI Powered",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Crosshair,
    title: "ICT Top-Down Analysis",
    desc: "Full ICT protocol: 1D bias, 4H structure, 1H entry model, 5M trigger. OB, FVG, BSL/SSL, BOS, ChoCH all annotated.",
    tag: "ICT / SMC",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  {
    icon: Lightning,
    title: "Whale Tracker",
    desc: "Hyperliquid + Coinglass OI monitoring. Alerts on positions above $1M. Cross-referenced with technical levels before signaling.",
    tag: "On-Chain",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-400/10",
  },
];

const COMMANDS = [
  { cmd: "/asia BTC",      desc: "Asia H/L, EQ, PDH/PDL, PWH/PWL + 15m chart" },
  { cmd: "/liqmap BTC",    desc: "Liquidation heatmap, yellow = price magnet" },
  { cmd: "/screen",        desc: "Triple screen: 100 coins -> whale -> sweep" },
  { cmd: "/brief",         desc: "Morning alpha brief + 3 setups to watch" },
  { cmd: "/topdown BTC",   desc: "ICT full top-down multi-timeframe" },
  { cmd: "/whales",        desc: "Hyperliquid + Coinglass whale positioning" },
  { cmd: "/chart BTC 4H",  desc: "Clean chart with EMA, RSI, MACD" },
  { cmd: "/research BTC",  desc: "4-layer deep dive: price + on-chain + web" },
];

const STATS = [
  { value: "100+",   label: "Coins Screened" },
  { value: "24/7",   label: "Monitoring" },
  { value: "3",      label: "Brokers Connected" },
  { value: "0",      label: "Missed Sweeps" },
];

// ── Animations ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

// ── Terminal mockup ───────────────────────────────────────────────────────────

function TerminalMockup() {
  const lines = [
    { t: 200,  text: "$ /asia BTC",                   color: "text-violet-400" },
    { t: 600,  text: "BTCUSDT  14:32 PHT | London",   color: "text-zinc-300" },
    { t: 800,  text: "PWH    $107,200  +1.22%  [ERL]", color: "text-amber-400" },
    { t: 900,  text: "Asia H $105,940  +0.08%  [ERL] SWEPT 07:30", color: "text-rose-400" },
    { t: 1000, text: "=== NOW  $105,855  [BULL]",      color: "text-emerald-400" },
    { t: 1100, text: "EQ     $105,210  -0.61%  [IRL]", color: "text-zinc-400" },
    { t: 1200, text: "Asia L $104,480  -1.30%  [ERL]", color: "text-sky-400" },
    { t: 1400, text: "$ /liqmap BTC 1h",               color: "text-violet-400" },
    { t: 1800, text: "Generating heatmap...",           color: "text-zinc-500" },
    { t: 2200, text: "Chart sent. BSL: $107,200 | SSL: $104,480", color: "text-emerald-400" },
  ];

  return (
    <div className="relative w-full max-w-xl font-mono text-xs rounded border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-2xl shadow-violet-500/10">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-800 bg-zinc-950">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-zinc-600 text-[10px]">SmartMoneyCryptoPH Bot</span>
      </div>
      {/* Lines */}
      <div className="p-4 space-y-1.5 min-h-[220px]">
        {lines.map((ln, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ln.t / 1000, duration: 0.3 }}
            className={`leading-relaxed ${ln.color}`}
          >
            {ln.text}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block w-1.5 h-3.5 bg-violet-400 align-middle"
        />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="font-mono text-sm font-bold text-zinc-100 tracking-wider">SMCPH</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-500">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
            <a href="#commands" className="hover:text-zinc-200 transition-colors">Commands</a>
            <a href={DASHBOARD_LINK} className="hover:text-zinc-200 transition-colors">Dashboard</a>
          </div>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold rounded transition-colors"
          >
            <TelegramLogo weight="fill" size={14} />
            Join Channel
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-[11px] font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Now - Telegram Bot
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-mono text-4xl md:text-5xl font-bold leading-tight tracking-tight"
            >
              Institutional-Grade
              <br />
              <span className="text-violet-400">Trading Intelligence</span>
              <br />
              in Telegram
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-zinc-400 text-sm leading-relaxed max-w-[52ch] font-mono"
            >
              ICT + Smart Money Concepts. Asia session sweeps, liquidation heatmaps,
              whale positioning, AI alpha briefs - all delivered directly to your
              Telegram, 24/7, no charts app needed.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-mono font-semibold rounded transition-colors"
              >
                <TelegramLogo weight="fill" size={16} />
                Join Free Channel
              </a>
              <a
                href={DASHBOARD_LINK}
                className="flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-mono rounded transition-colors"
              >
                <Gauge size={16} />
                Live Dashboard
                <ArrowRight size={14} />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-6 pt-2">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-mono text-xl font-bold text-violet-400 tabular-nums">{value}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:flex justify-center"
          >
            <TerminalMockup />
          </motion.div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-zinc-800/60" />

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14"
        >
          <span className="text-[11px] font-mono text-violet-400 uppercase tracking-widest">What You Get</span>
          <h2 className="mt-2 font-mono text-2xl md:text-3xl font-bold tracking-tight">
            Every Edge. One Bot.
          </h2>
          <p className="mt-3 text-sm text-zinc-400 font-mono max-w-[55ch]">
            No subscriptions, no dashboards, no extra apps. Everything runs in Telegram
            and lands in your chat when it matters.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FEATURES.map(({ icon: Icon, title, desc, tag, color, bg }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="p-5 border border-zinc-800 rounded-sm bg-zinc-900/40 hover:border-zinc-700 transition-colors group"
            >
              <div className={`inline-flex p-2 rounded ${bg} mb-4`}>
                <Icon size={18} className={color} weight="duotone" />
              </div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-mono text-sm font-semibold text-zinc-100">{title}</h3>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${bg} ${color} whitespace-nowrap`}>{tag}</span>
              </div>
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-zinc-800/60" />

      {/* ── Commands ── */}
      <section id="commands" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14"
        >
          <span className="text-[11px] font-mono text-violet-400 uppercase tracking-widest">Commands</span>
          <h2 className="mt-2 font-mono text-2xl md:text-3xl font-bold tracking-tight">
            Type. Get Alpha.
          </h2>
          <p className="mt-3 text-sm text-zinc-400 font-mono max-w-[55ch]">
            Or just ask anything in plain language. The AI brain synthesizes data
            from Hyperliquid, Binance, CMC, and Coinglass automatically.
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
              className="flex items-start gap-4 p-4 border border-zinc-800/60 rounded-sm bg-zinc-900/20 hover:bg-zinc-900/60 hover:border-zinc-700 transition-colors"
            >
              <Terminal size={14} className="text-violet-400 mt-0.5 shrink-0" />
              <div>
                <code className="text-sm font-mono font-bold text-violet-300">{cmd}</code>
                <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-zinc-800/60" />

      {/* ── How it works ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14"
        >
          <span className="text-[11px] font-mono text-violet-400 uppercase tracking-widest">How It Works</span>
          <h2 className="mt-2 font-mono text-2xl md:text-3xl font-bold tracking-tight">
            Three Steps
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              step: "01",
              icon: TelegramLogo,
              title: "Join the Channel",
              desc: "Free access. The bot posts automated briefs, sweep alerts, and whale moves directly into the group.",
            },
            {
              step: "02",
              icon: Globe,
              title: "Get Live Alerts",
              desc: "Asia session sweeps, liquidation cluster updates, whale positioning changes - all push to your phone automatically.",
            },
            {
              step: "03",
              icon: ShieldCheck,
              title: "Trade with Confluence",
              desc: "Combine the ICT levels, liq heatmap, and whale data to find high-probability setups with clear entries and invalidations.",
            },
          ].map(({ step, icon: Icon, title, desc }) => (
            <motion.div key={step} variants={fadeUp} className="relative">
              <div className="font-mono text-6xl font-black text-zinc-800 select-none mb-4">{step}</div>
              <Icon size={22} className="text-violet-400 mb-3" weight="duotone" />
              <h3 className="font-mono text-sm font-bold text-zinc-100 mb-2">{title}</h3>
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center border border-zinc-800 rounded-sm p-12 bg-zinc-900/30"
        >
          <span className="text-[11px] font-mono text-violet-400 uppercase tracking-widest">Free Access</span>
          <h2 className="mt-4 font-mono text-2xl md:text-3xl font-bold tracking-tight">
            Start Trading Smarter
          </h2>
          <p className="mt-4 text-sm text-zinc-400 font-mono leading-relaxed max-w-[50ch] mx-auto">
            Join the SmartMoneyCryptoPH community. ICT methodology, real data,
            no noise. Free to join.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-mono font-semibold rounded transition-colors"
            >
              <TelegramLogo weight="fill" size={16} />
              Join Telegram Channel
            </a>
            <a
              href={DASHBOARD_LINK}
              className="flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-mono rounded transition-colors"
            >
              Open Live Dashboard
              <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/60 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span className="font-mono text-xs font-bold text-zinc-400">SMCPH</span>
            <span className="text-zinc-700 text-xs font-mono">SmartMoneyCryptoPH</span>
          </div>
          <p className="text-[11px] text-zinc-600 font-mono text-center">
            For educational purposes only. Not financial advice. Trading carries risk.
          </p>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-violet-400 transition-colors"
          >
            <TelegramLogo size={13} />
            Telegram
          </a>
        </div>
      </footer>
    </div>
  );
}
