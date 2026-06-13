"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Treemap, ResponsiveContainer } from "recharts";
import { useLiquidationFeed } from "@/hooks/useLiquidationFeed";

// ── Types ────────────────────────────────────────────────────────────────────

interface Coin {
  name: string;
  value: number;
  longRatio: number; // 0-1, >0.5 = more longs liquidated (red)
}

interface TimeframeStat {
  total: number;
  long: number;
  short: number;
}

interface ExchangeRow {
  name: string;
  liquidations: number;
  long: number;
  short: number;
  longRate: number;
  shortRate: number;
}


// ── Reference Data (treemap — approximate 24h baseline) ──────────────────────

const COINS: Record<string, Coin[]> = {
  "1h": [
    { name: "Others", value: 2800000, longRatio: 0.35 },
    { name: "BTC", value: 1200000, longRatio: 0.68 },
    { name: "ETH", value: 980000, longRatio: 0.32 },
    { name: "SOL", value: 650000, longRatio: 0.55 },
    { name: "XRP", value: 520000, longRatio: 0.42 },
    { name: "DOGE", value: 380000, longRatio: 0.38 },
    { name: "BNB", value: 310000, longRatio: 0.61 },
    { name: "ADA", value: 180000, longRatio: 0.44 },
    { name: "AVAX", value: 160000, longRatio: 0.37 },
    { name: "LINK", value: 140000, longRatio: 0.52 },
    { name: "DOT", value: 110000, longRatio: 0.48 },
    { name: "MATIC", value: 90000, longRatio: 0.33 },
  ],
  "4h": [
    { name: "Others", value: 14480000, longRatio: 0.30 },
    { name: "BTC",    value: 14480000, longRatio: 0.72 },
    { name: "ETH",    value: 12370000, longRatio: 0.28 },
    { name: "SPCX",   value:  8560000, longRatio: 0.45 },
    { name: "VELVET", value:  7390000, longRatio: 0.55 },
    { name: "XYZ",    value:  5980000, longRatio: 0.40 },
    { name: "HYPE",   value:  5670000, longRatio: 0.38 },
    { name: "TRUMP",  value:  5360000, longRatio: 0.62 },
    { name: "BEAT",   value:  5330000, longRatio: 0.35 },
    { name: "ESPORTS",value:  4830000, longRatio: 0.40 },
    { name: "ZEC",    value:  2930000, longRatio: 0.30 },
    { name: "WLD",    value:  2770000, longRatio: 0.45 },
    { name: "TAO",    value:  2700000, longRatio: 0.55 },
    { name: "SIREN",  value:  2550000, longRatio: 0.35 },
    { name: "XPL",    value:  1200000, longRatio: 0.48 },
    { name: "DOGE",   value:   980000, longRatio: 0.40 },
    { name: "STG",    value:   850000, longRatio: 0.37 },
    { name: "ADA",    value:   720000, longRatio: 0.33 },
    { name: "NEAR",   value:   680000, longRatio: 0.44 },
    { name: "BZ",     value:   620000, longRatio: 0.51 },
  ],
  "12h": [
    { name: "Others", value: 18500000, longRatio: 0.32 },
    { name: "BTC",    value: 12200000, longRatio: 0.65 },
    { name: "ETH",    value:  9800000, longRatio: 0.30 },
    { name: "SOL",    value:  6500000, longRatio: 0.48 },
    { name: "XRP",    value:  4200000, longRatio: 0.38 },
    { name: "DOGE",   value:  3100000, longRatio: 0.40 },
    { name: "BNB",    value:  2800000, longRatio: 0.58 },
    { name: "ADA",    value:  1900000, longRatio: 0.35 },
    { name: "AVAX",   value:  1500000, longRatio: 0.33 },
    { name: "LINK",   value:  1200000, longRatio: 0.55 },
    { name: "DOT",    value:   980000, longRatio: 0.44 },
    { name: "NEAR",   value:   820000, longRatio: 0.38 },
    { name: "WLD",    value:   750000, longRatio: 0.42 },
    { name: "TAO",    value:   680000, longRatio: 0.52 },
    { name: "TRX",    value:   590000, longRatio: 0.45 },
  ],
  "24h": [
    { name: "Others", value: 28400000, longRatio: 0.35 },
    { name: "BTC",    value: 22500000, longRatio: 0.62 },
    { name: "ETH",    value: 18800000, longRatio: 0.31 },
    { name: "SOL",    value: 12000000, longRatio: 0.46 },
    { name: "XRP",    value:  8500000, longRatio: 0.40 },
    { name: "DOGE",   value:  6200000, longRatio: 0.38 },
    { name: "BNB",    value:  5800000, longRatio: 0.56 },
    { name: "ADA",    value:  3900000, longRatio: 0.34 },
    { name: "AVAX",   value:  3200000, longRatio: 0.32 },
    { name: "LINK",   value:  2800000, longRatio: 0.54 },
    { name: "DOT",    value:  2100000, longRatio: 0.43 },
    { name: "NEAR",   value:  1800000, longRatio: 0.36 },
    { name: "WLD",    value:  1500000, longRatio: 0.41 },
    { name: "TAO",    value:  1300000, longRatio: 0.50 },
    { name: "TRX",    value:  1100000, longRatio: 0.38 },
    { name: "OP",     value:   950000, longRatio: 0.44 },
    { name: "ARB",    value:   880000, longRatio: 0.39 },
    { name: "ATOM",   value:   760000, longRatio: 0.47 },
    { name: "FTM",    value:   680000, longRatio: 0.35 },
    { name: "SAND",   value:   590000, longRatio: 0.42 },
  ],
};

const STATS: Record<string, TimeframeStat> = {
  "1h":  { total:   5_180_000, long:    984_690, short:   4_200_000 },
  "4h":  { total:  17_680_000, long:  4_690_000, short:  13_000_000 },
  "12h": { total:  43_520_000, long: 17_870_000, short:  25_650_000 },
  "24h": { total: 123_740_000, long: 75_460_000, short:  48_280_000 },
};

const EXCHANGES: ExchangeRow[] = [
  { name: "All",     liquidations: 17_650_000, long: 4_690_000, short: 12_970_000, longRate: 0.2655, shortRate: 0.7345 },
  { name: "Binance", liquidations:  9_180_000, long: 2_550_000, short:  6_630_000, longRate: 0.2778, shortRate: 0.7219 },
  { name: "OKX",     liquidations:  3_640_000, long:   980_000, short:  2_660_000, longRate: 0.2692, shortRate: 0.7308 },
  { name: "Bybit",   liquidations:  2_880_000, long:   820_000, short:  2_060_000, longRate: 0.2847, shortRate: 0.7153 },
  { name: "HTX",     liquidations:  1_290_000, long:   250_000, short:  1_040_000, longRate: 0.1938, shortRate: 0.8062 },
  { name: "BitGet",  liquidations:    660_000, long:    90_000, short:    570_000, longRate: 0.1364, shortRate: 0.8636 },
];

const EXCHANGE_COLORS: Record<string, string> = {
  Binance: "text-amber-400 bg-amber-500/10",
  Bybit:   "text-orange-400 bg-orange-500/10",
  OKX:     "text-sky-400 bg-sky-500/10",
};

const STATUS_DOT: Record<string, string> = {
  live:       "bg-emerald-400",
  connecting: "bg-amber-400 animate-pulse",
  error:      "bg-rose-500",
};

// ── Utils ─────────────────────────────────────────────────────────────────────

function fmt$(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(2)}%`;
}

function cellColor(longRatio: number): string {
  const isLong = longRatio > 0.5;
  const intensity = Math.min(1, Math.abs(longRatio - 0.5) * 2.8);

  if (isLong) {
    // rose range: #7f1d1d (weak) -> #f43f5e (strong)
    const r = Math.round(127 + intensity * 127);
    const g = Math.round(29  - intensity * 11);
    const b = Math.round(29  + intensity * 65);
    return `rgb(${r},${Math.max(0,g)},${b})`;
  } else {
    // emerald range: #064e3b (weak) -> #34d399 (strong)
    const r = Math.round(6   + intensity * 46);
    const g = Math.round(78  + intensity * 133);
    const b = Math.round(59  + intensity * 94);
    return `rgb(${r},${g},${b})`;
  }
}

// ── Treemap cell ──────────────────────────────────────────────────────────────

interface CellProps {
  x?: number; y?: number; width?: number; height?: number;
  name?: string; value?: number; longRatio?: number; depth?: number;
}

function Cell({ x = 0, y = 0, width = 0, height = 0, name = "", value = 0, longRatio = 0.5, depth = 0 }: CellProps) {
  if (depth !== 1 || width < 4 || height < 4) return null;

  const bg = cellColor(longRatio);
  const pad = 6;
  const showText = width > 32 && height > 22;
  const showValue = width > 52 && height > 46;
  const nameFontSize = Math.min(15, Math.max(8, Math.min((width - pad * 2) / (name.length * 0.62), height * 0.22)));
  const valFontSize = Math.max(8, nameFontSize * 0.72);
  const midY = y + height / 2;

  return (
    <g>
      <rect
        x={x + 1} y={y + 1}
        width={width - 2} height={height - 2}
        fill={bg} rx={3}
        stroke="rgba(9,9,11,0.7)" strokeWidth={1}
      />
      {showText && (
        <text
          x={x + width / 2}
          y={midY - (showValue ? nameFontSize * 0.55 : 0)}
          textAnchor="middle" dominantBaseline="middle"
          fill="white" fontWeight="700" fontSize={nameFontSize}
          fontFamily="'JetBrains Mono', monospace"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
      {showValue && (
        <text
          x={x + width / 2}
          y={midY + nameFontSize * 0.95}
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.78)" fontSize={valFontSize}
          fontFamily="'JetBrains Mono', monospace"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {fmt$(value)}
        </text>
      )}
    </g>
  );
}

// ── Stat box ──────────────────────────────────────────────────────────────────

function StatBox({ label, stat }: { label: string; stat: TimeframeStat }) {
  const longPct = stat.long / stat.total;
  const shortPct = stat.short / stat.total;

  return (
    <div className="p-3 border border-zinc-800 rounded-sm bg-zinc-900/60">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label} Rekt</span>
        <span className="text-sm font-mono font-bold tabular-nums text-zinc-100">{fmt$(stat.total)}</span>
      </div>
      <div className="flex justify-between text-[11px] font-mono tabular-nums mb-2">
        <span className="text-emerald-400">Long  {fmt$(stat.long)}</span>
        <span className="text-rose-500">Short {fmt$(stat.short)}</span>
      </div>
      {/* Bar */}
      <div className="h-1 rounded-full bg-zinc-800 overflow-hidden flex">
        <div className="h-full bg-emerald-500/70" style={{ width: `${longPct * 100}%` }} />
        <div className="h-full bg-rose-500/70"    style={{ width: `${shortPct * 100}%` }} />
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm" style={{ background: cellColor(0.85) }} />
        <span>Longs liquidated (price down)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm" style={{ background: cellColor(0.15) }} />
        <span>Shorts liquidated (price up)</span>
      </div>
      <div className="text-zinc-600">Size = total liq. value</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const TFS = ["1h", "4h", "12h", "24h"] as const;
type TF = (typeof TFS)[number];

export default function LiquidationMap() {
  const [tf, setTf] = useState<TF>("4h");
  const [view, setView] = useState<"symbol" | "exchange">("symbol");
  const { events: feed, stats: feedStats } = useLiquidationFeed(60);

  const coins = COINS[tf];
  const stats = STATS;

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xs font-mono font-bold text-zinc-300 tracking-[0.15em] uppercase">
          Liquidation Heatmap
        </h1>

        {/* Timeframe */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5">
          {TFS.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors duration-150 ${
                tf === t
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Symbol / Exchange */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5">
          {(["symbol", "exchange"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-mono rounded capitalize transition-colors duration-150 ${
                view === v
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <Legend />
        </div>
      </div>

      {/* ── Heatmap + Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* Treemap */}
        <div
          className="h-[360px] border border-zinc-800 rounded-sm overflow-hidden bg-zinc-900/20"
          style={{ position: "relative" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={coins}
              dataKey="value"
              aspectRatio={16 / 9}
              content={<Cell />}
              isAnimationActive={false}
            />
          </ResponsiveContainer>
        </div>

        {/* Stats panel */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Total Liquidations
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TFS.map((t) => (
              <StatBox key={t} label={t} stat={stats[t]} />
            ))}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono leading-relaxed pt-1 border-t border-zinc-800">
            In the past 24h, 83,252 traders were liquidated totalling $123.74M.
            Largest single order: Binance ETHUSDT $1.71M.
          </p>
        </div>
      </div>

      {/* ── Exchange Table + Realtime Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Exchange Liquidations */}
        <div className="border border-zinc-800 rounded-sm bg-zinc-900/20 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
            <span className="text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-widest">
              Exchange Liquidations
            </span>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
              <span className="bg-zinc-800 px-2 py-0.5 rounded">All</span>
              <span className="bg-zinc-800 px-2 py-0.5 rounded">{tf}</span>
            </div>
          </div>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Exchange", "Liq.", "Long", "Short", "Rate"].map((h) => (
                  <th key={h} className={`px-3 py-2 text-zinc-500 font-normal text-[10px] uppercase tracking-wider ${h === "Exchange" ? "text-left" : "text-right"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXCHANGES.map((ex, i) => (
                <tr
                  key={ex.name}
                  className={`border-b border-zinc-800/50 transition-colors ${
                    i === 0 ? "bg-zinc-800/40" : "hover:bg-zinc-800/25"
                  }`}
                >
                  <td className="px-3 py-2.5 text-zinc-200 font-semibold">{ex.name}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-zinc-300">{fmt$(ex.liquidations)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-emerald-400">{fmt$(ex.long)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-rose-500">{fmt$(ex.short)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-rose-400 text-[10px]">
                    {fmtPct(ex.shortRate)} Short
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Real-time Feed */}
        <div className="border border-zinc-800 rounded-sm bg-zinc-900/20 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
            <span className="text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-widest">
              Real-Time Liquidations
            </span>
            <div className="flex items-center gap-3">
              {(["Binance", "Bybit", "OKX"] as const).map((ex) => (
                <div key={ex} className="flex items-center gap-1 text-[9px] font-mono text-zinc-500">
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[feedStats[ex.toLowerCase() as "binance" | "bybit" | "okx"]]}`} />
                  {ex}
                </div>
              ))}
              <span className="text-[9px] font-mono text-zinc-600 tabular-nums">
                {feedStats.totalEvents} events
              </span>
            </div>
          </div>
          {feed.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-600 text-xs font-mono">
              Connecting to exchanges...
            </div>
          ) : (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Symbol", "Price", "Value", "Time"].map((h) => (
                  <th key={h} className={`px-3 py-2 text-zinc-500 font-normal text-[10px] uppercase tracking-wider ${h === "Symbol" ? "text-left" : "text-right"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {feed.slice(0, 12).map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, backgroundColor: item.side === "LONG" ? "rgba(244,63,94,0.18)" : "rgba(52,211,153,0.15)" }}
                    animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9 }}
                    className="border-b border-zinc-800/50"
                  >
                    <td className="px-3 py-2.5">
                      <span className={`font-semibold ${item.side === "LONG" ? "text-rose-400" : "text-emerald-400"}`}>
                        {item.symbol.replace("USDT", "")}
                      </span>
                      <span className={`ml-1 text-[9px] px-1 py-0.5 rounded ${
                        item.side === "LONG" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>{item.side}</span>
                      <span className={`ml-1 text-[9px] px-1 py-0.5 rounded ${EXCHANGE_COLORS[item.exchange]}`}>
                        {item.exchange.slice(0, 3).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-400">
                      ${item.price >= 1000 ? item.price.toLocaleString("en-US", { maximumFractionDigits: 0 }) : item.price.toFixed(4)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-200 font-semibold">
                      {fmt$(item.value)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-600 text-[10px]">
                      {item.time}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}
