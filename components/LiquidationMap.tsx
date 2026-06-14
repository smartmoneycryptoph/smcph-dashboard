"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Treemap, ResponsiveContainer } from "recharts";
import { useLiquidationFeed } from "@/hooks/useLiquidationFeed";
import {
  MagnifyingGlass, X, ArrowUp, ArrowDown, ArrowsDownUp,
  BroadcastSimple, Warning, Spinner,
} from "@phosphor-icons/react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Coin { name: string; value: number; longRatio: number }
interface TimeframeStat { total: number; long: number; short: number }
interface ExchangeRow { name: string; liquidations: number; long: number; short: number; shortRate: number }
interface LivePrice { symbol: string; price: number; change24h: number; volume: number }
interface FngData { value: string; value_classification: string }
type SortCol = "liq" | "long" | "short";
type ExFilter = "All" | "Binance" | "Bybit" | "OKX";

// ── Static Data ───────────────────────────────────────────────────────────────

const COINS: Record<string, Coin[]> = {
  "1h": [
    { name: "Others", value: 2800000, longRatio: 0.35 },
    { name: "BTC",    value: 1200000, longRatio: 0.68 },
    { name: "ETH",    value:  980000, longRatio: 0.32 },
    { name: "SOL",    value:  650000, longRatio: 0.55 },
    { name: "XRP",    value:  520000, longRatio: 0.42 },
    { name: "DOGE",   value:  380000, longRatio: 0.38 },
    { name: "BNB",    value:  310000, longRatio: 0.61 },
    { name: "ADA",    value:  180000, longRatio: 0.44 },
    { name: "AVAX",   value:  160000, longRatio: 0.37 },
    { name: "LINK",   value:  140000, longRatio: 0.52 },
    { name: "DOT",    value:  110000, longRatio: 0.48 },
    { name: "MATIC",  value:   90000, longRatio: 0.33 },
  ],
  "4h": [
    { name: "Others", value: 8500000, longRatio: 0.30 },
    { name: "BTC",    value: 4690000, longRatio: 0.72 },
    { name: "ETH",    value: 3700000, longRatio: 0.28 },
    { name: "SOL",    value: 2100000, longRatio: 0.45 },
    { name: "XRP",    value: 1500000, longRatio: 0.40 },
    { name: "DOGE",   value:  980000, longRatio: 0.38 },
    { name: "BNB",    value:  850000, longRatio: 0.62 },
    { name: "ADA",    value:  720000, longRatio: 0.33 },
    { name: "NEAR",   value:  680000, longRatio: 0.44 },
    { name: "WLD",    value:  540000, longRatio: 0.51 },
    { name: "TAO",    value:  490000, longRatio: 0.55 },
    { name: "AVAX",   value:  420000, longRatio: 0.37 },
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
    { name: "NEAR",   value:   820000, longRatio: 0.38 },
    { name: "TAO",    value:   680000, longRatio: 0.52 },
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
    { name: "NEAR",   value:  1800000, longRatio: 0.36 },
    { name: "TAO",    value:  1300000, longRatio: 0.50 },
    { name: "ARB",    value:   880000, longRatio: 0.39 },
    { name: "OP",     value:   950000, longRatio: 0.44 },
    { name: "ATOM",   value:   760000, longRatio: 0.47 },
  ],
  "48h": [
    { name: "Others", value: 54000000, longRatio: 0.36 },
    { name: "BTC",    value: 42000000, longRatio: 0.60 },
    { name: "ETH",    value: 35000000, longRatio: 0.33 },
    { name: "SOL",    value: 22000000, longRatio: 0.45 },
    { name: "XRP",    value: 16000000, longRatio: 0.38 },
    { name: "DOGE",   value: 12000000, longRatio: 0.40 },
    { name: "BNB",    value: 10000000, longRatio: 0.55 },
    { name: "ADA",    value:  7200000, longRatio: 0.34 },
    { name: "AVAX",   value:  6100000, longRatio: 0.32 },
    { name: "LINK",   value:  5200000, longRatio: 0.52 },
    { name: "NEAR",   value:  3400000, longRatio: 0.37 },
    { name: "TAO",    value:  2500000, longRatio: 0.49 },
  ],
  "3d": [
    { name: "Others", value:  90000000, longRatio: 0.38 },
    { name: "BTC",    value:  78000000, longRatio: 0.58 },
    { name: "ETH",    value:  62000000, longRatio: 0.35 },
    { name: "SOL",    value:  40000000, longRatio: 0.44 },
    { name: "XRP",    value:  28000000, longRatio: 0.40 },
    { name: "DOGE",   value:  21000000, longRatio: 0.42 },
    { name: "BNB",    value:  18000000, longRatio: 0.53 },
    { name: "ADA",    value:  13000000, longRatio: 0.36 },
    { name: "AVAX",   value:  11000000, longRatio: 0.33 },
    { name: "LINK",   value:   9200000, longRatio: 0.51 },
    { name: "ARB",    value:   6800000, longRatio: 0.40 },
    { name: "OP",     value:   5900000, longRatio: 0.43 },
  ],
  "1w": [
    { name: "Others", value: 210000000, longRatio: 0.40 },
    { name: "BTC",    value: 180000000, longRatio: 0.55 },
    { name: "ETH",    value: 145000000, longRatio: 0.37 },
    { name: "SOL",    value:  92000000, longRatio: 0.46 },
    { name: "XRP",    value:  65000000, longRatio: 0.41 },
    { name: "DOGE",   value:  48000000, longRatio: 0.43 },
    { name: "BNB",    value:  42000000, longRatio: 0.52 },
    { name: "ADA",    value:  30000000, longRatio: 0.37 },
    { name: "AVAX",   value:  26000000, longRatio: 0.34 },
    { name: "LINK",   value:  21000000, longRatio: 0.50 },
    { name: "ARB",    value:  16000000, longRatio: 0.41 },
    { name: "TAO",    value:  13000000, longRatio: 0.48 },
    { name: "NEAR",   value:  11000000, longRatio: 0.38 },
    { name: "OP",     value:   9800000, longRatio: 0.44 },
    { name: "INJ",    value:   8200000, longRatio: 0.47 },
  ],
};

const STATS: Record<string, TimeframeStat> = {
  "1h":  { total:   5_180_000, long:    985_000, short:  4_200_000 },
  "4h":  { total:  17_680_000, long:  4_690_000, short: 13_000_000 },
  "12h": { total:  43_520_000, long: 17_870_000, short: 25_650_000 },
  "24h": { total: 123_740_000, long: 75_460_000, short: 48_280_000 },
  "48h": { total: 236_000_000, long: 142_000_000, short: 94_000_000 },
  "3d":  { total: 412_000_000, long: 240_000_000, short: 172_000_000 },
  "1w":  { total: 890_000_000, long: 510_000_000, short: 380_000_000 },
};

const EXCHANGE_ROWS: ExchangeRow[] = [
  { name: "All",     liquidations: 17_650_000, long: 4_690_000, short: 12_970_000, shortRate: 0.7345 },
  { name: "Binance", liquidations:  9_180_000, long: 2_550_000, short:  6_630_000, shortRate: 0.7219 },
  { name: "OKX",     liquidations:  3_640_000, long:   980_000, short:  2_660_000, shortRate: 0.7308 },
  { name: "Bybit",   liquidations:  2_880_000, long:   820_000, short:  2_060_000, shortRate: 0.7153 },
  { name: "HTX",     liquidations:  1_290_000, long:   250_000, short:  1_040_000, shortRate: 0.8062 },
  { name: "BitGet",  liquidations:    660_000, long:    90_000, short:    570_000, shortRate: 0.8636 },
];

const TFS = ["1h", "4h", "12h", "24h", "48h", "3d", "1w"] as const;
type TF = (typeof TFS)[number];

const EX_FILTERS: ExFilter[] = ["All", "Binance", "Bybit", "OKX"];

const EX_COLORS: Record<string, string> = {
  Binance: "text-amber-400",
  Bybit:   "text-orange-400",
  OKX:     "text-sky-400",
};

// ── Utils ─────────────────────────────────────────────────────────────────────

function fmt$(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)         return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtPrice(p: number): string {
  if (p >= 10_000) return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (p >= 1)      return `$${p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  return `$${p.toFixed(6)}`;
}

function cellColor(longRatio: number): string {
  const isLong = longRatio > 0.5;
  const intensity = Math.min(1, Math.abs(longRatio - 0.5) * 2.8);
  if (isLong) {
    const r = Math.round(127 + intensity * 127);
    const g = Math.round(Math.max(0, 29 - intensity * 11));
    const b = Math.round(29 + intensity * 65);
    return `rgb(${r},${g},${b})`;
  } else {
    const r = Math.round(6 + intensity * 46);
    const g = Math.round(78 + intensity * 133);
    const b = Math.round(59 + intensity * 94);
    return `rgb(${r},${g},${b})`;
  }
}

function fngColor(v: number): string {
  if (v >= 75) return "text-emerald-400";
  if (v >= 55) return "text-lime-400";
  if (v >= 45) return "text-amber-400";
  if (v >= 25) return "text-orange-400";
  return "text-rose-500";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MarketStrip({ prices, fng }: { prices: LivePrice[]; fng: FngData | null }) {
  const top = prices.slice(0, 6);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 py-2 border-b border-zinc-800 text-[11px] font-mono">
      {top.map((p) => (
        <div key={p.symbol} className="flex items-center gap-1.5">
          <span className="text-zinc-300 font-semibold">{p.symbol}</span>
          <span className="tabular-nums text-zinc-400">{fmtPrice(p.price)}</span>
          <span className={`tabular-nums ${p.change24h >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
            {p.change24h >= 0 ? "+" : ""}{p.change24h.toFixed(2)}%
          </span>
        </div>
      ))}
      {fng && (
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-zinc-600">F&G</span>
          <span className={`font-bold tabular-nums ${fngColor(parseInt(fng.value))}`}>
            {fng.value}
          </span>
          <span className="text-zinc-500">{fng.value_classification}</span>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, stat }: { label: string; stat: TimeframeStat }) {
  const longPct = stat.long / stat.total;
  return (
    <div className="p-3 border border-zinc-800 rounded-sm bg-zinc-900/60">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-mono font-bold tabular-nums text-zinc-100">{fmt$(stat.total)}</span>
      </div>
      <div className="flex justify-between text-[10px] font-mono tabular-nums mb-1.5">
        <span className="text-emerald-400">L {fmt$(stat.long)}</span>
        <span className="text-rose-500">S {fmt$(stat.short)}</span>
      </div>
      <div className="h-1 rounded-full bg-zinc-800 overflow-hidden flex">
        <div className="h-full bg-emerald-500/70" style={{ width: `${longPct * 100}%` }} />
        <div className="h-full bg-rose-500/70" style={{ width: `${(1 - longPct) * 100}%` }} />
      </div>
    </div>
  );
}

function CoinDetailPanel({
  coin, live, onClose,
}: {
  coin: Coin | undefined;
  live: LivePrice | undefined;
  onClose: () => void;
}) {
  if (!coin) return null;
  const bg = cellColor(coin.longRatio);
  const longAmt = coin.value * coin.longRatio;
  const shortAmt = coin.value * (1 - coin.longRatio);
  const bias = coin.longRatio > 0.5 ? "LONGS DOMINANT" : "SHORTS DOMINANT";
  const biasColor = coin.longRatio > 0.5 ? "text-rose-400" : "text-emerald-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="border border-zinc-700 rounded-sm bg-zinc-900 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-10 rounded-sm" style={{ background: bg }} />
          <div>
            <h3 className="font-mono font-bold text-lg text-zinc-100">{coin.name} / USDT</h3>
            {live && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="tabular-nums text-zinc-300">{fmtPrice(live.price)}</span>
                <span className={live.change24h >= 0 ? "text-emerald-400" : "text-rose-500"}>
                  {live.change24h >= 0 ? "+" : ""}{live.change24h.toFixed(2)}% 24h
                </span>
                <span className="text-zinc-600">Vol {fmt$(live.volume)}</span>
              </div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1">
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs font-mono">
        <div className="bg-zinc-800/60 rounded p-2.5">
          <div className="text-zinc-500 mb-1">Total Liquidated</div>
          <div className="tabular-nums text-zinc-100 font-bold text-sm">{fmt$(coin.value)}</div>
        </div>
        <div className="bg-rose-500/10 rounded p-2.5">
          <div className="text-rose-400 mb-1">Longs Liquidated</div>
          <div className="tabular-nums text-rose-300 font-bold text-sm">{fmt$(longAmt)}</div>
          <div className="text-zinc-600 text-[10px]">{(coin.longRatio * 100).toFixed(0)}%</div>
        </div>
        <div className="bg-emerald-500/10 rounded p-2.5">
          <div className="text-emerald-400 mb-1">Shorts Liquidated</div>
          <div className="tabular-nums text-emerald-300 font-bold text-sm">{fmt$(shortAmt)}</div>
          <div className="text-zinc-600 text-[10px]">{((1 - coin.longRatio) * 100).toFixed(0)}%</div>
        </div>
      </div>
      <div className={`mt-2 text-[10px] font-mono font-bold tracking-widest ${biasColor}`}>
        {bias}
      </div>
    </motion.div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipState { coin: Coin; x: number; y: number }

function CoinTooltip({ tip, live }: { tip: TooltipState; live: LivePrice | undefined }) {
  return (
    <div
      className="fixed z-50 pointer-events-none bg-zinc-900 border border-zinc-700 rounded-sm px-3 py-2 text-xs font-mono shadow-xl"
      style={{ left: tip.x + 14, top: tip.y - 10 }}
    >
      <div className="font-bold text-zinc-100 mb-0.5">{tip.coin.name}</div>
      <div className="text-zinc-400">{fmt$(tip.coin.value)} liquidated</div>
      {live && (
        <>
          <div className="text-zinc-500 mt-0.5">{fmtPrice(live.price)}</div>
          <div className={live.change24h >= 0 ? "text-emerald-400" : "text-rose-500"}>
            {live.change24h >= 0 ? "+" : ""}{live.change24h.toFixed(2)}% 24h
          </div>
        </>
      )}
      <div className={`mt-0.5 ${tip.coin.longRatio > 0.5 ? "text-rose-400" : "text-emerald-400"}`}>
        {tip.coin.longRatio > 0.5 ? "Longs dominant" : "Shorts dominant"}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LiquidationMap() {
  const [tf, setTf] = useState<TF>("4h");
  const [view, setView] = useState<"symbol" | "exchange">("symbol");
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<ExFilter>("All");
  const [sortCol, setSortCol] = useState<SortCol>("liq");
  const [sortAsc, setSortAsc] = useState(false);
  const [livePrices, setLivePrices] = useState<LivePrice[]>([]);
  const [fng, setFng] = useState<FngData | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { events: feed, stats: feedStats } = useLiquidationFeed(120);

  useEffect(() => {
    const run = () =>
      fetch("/api/prices")
        .then((r) => r.json())
        .then(setLivePrices)
        .catch(() => {});
    run();
    const id = setInterval(run, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/fear-greed")
      .then((r) => r.json())
      .then(setFng)
      .catch(() => {});
  }, []);

  const priceMap = Object.fromEntries(livePrices.map((p) => [p.symbol, p]));

  const allCoins = COINS[tf] ?? COINS["24h"];
  const filteredCoins = search
    ? allCoins.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : allCoins;

  const filteredFeed =
    feedFilter === "All" ? feed : feed.filter((e) => e.exchange === feedFilter);

  const coinDetailData = selectedCoin
    ? allCoins.find((c) => c.name === selectedCoin)
    : undefined;

  const sortedExchanges = [...EXCHANGE_ROWS].sort((a, b) => {
    const key = sortCol === "liq" ? "liquidations" : sortCol;
    return sortAsc ? a[key] - b[key] : b[key] - a[key];
  });

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortAsc((v) => !v);
    else { setSortCol(col); setSortAsc(false); }
  }

  // Cell defined inside to close over state
  function CoinCell({
    x = 0, y = 0, width = 0, height = 0,
    name = "", value = 0, longRatio = 0.5, depth = 0,
  }: {
    x?: number; y?: number; width?: number; height?: number;
    name?: string; value?: number; longRatio?: number; depth?: number;
  }) {
    if (depth !== 1 || width < 4 || height < 4) return null;

    const bg = cellColor(longRatio);
    const live = priceMap[name];
    const isSelected = selectedCoin === name;
    const showText = width > 32 && height > 22;
    const showValue = width > 52 && height > 46;
    const showChange = width > 72 && height > 62 && !!live;
    const nfs = Math.min(14, Math.max(8, Math.min((width - 12) / (name.length * 0.62), height * 0.22)));
    const vfs = Math.max(8, nfs * 0.72);
    const midY = y + height / 2;
    const changeOffset = showChange ? -nfs * 1.1 : showValue ? -nfs * 0.55 : 0;

    return (
      <g
        style={{ cursor: "pointer" }}
        onClick={() => setSelectedCoin(isSelected ? null : name)}
        onMouseMove={(e) =>
          setTooltip({ coin: { name, value, longRatio }, x: e.clientX, y: e.clientY })
        }
        onMouseLeave={() => setTooltip(null)}
      >
        <rect
          x={x + 1} y={y + 1} width={width - 2} height={height - 2}
          fill={bg} rx={3}
          stroke={isSelected ? "rgba(139,92,246,0.9)" : "rgba(9,9,11,0.7)"}
          strokeWidth={isSelected ? 2.5 : 1}
        />
        {showText && (
          <text
            x={x + width / 2} y={midY + changeOffset}
            textAnchor="middle" dominantBaseline="middle"
            fill="white" fontWeight="700" fontSize={nfs}
            fontFamily="'JetBrains Mono', monospace"
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            {name}
          </text>
        )}
        {showValue && (
          <text
            x={x + width / 2}
            y={midY + changeOffset + nfs * 1.1}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.75)" fontSize={vfs}
            fontFamily="'JetBrains Mono', monospace"
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            {fmt$(value)}
          </text>
        )}
        {showChange && live && (
          <text
            x={x + width / 2}
            y={midY + changeOffset + nfs * 2.2}
            textAnchor="middle" dominantBaseline="middle"
            fill={live.change24h >= 0 ? "rgba(52,211,153,0.9)" : "rgba(244,63,94,0.9)"}
            fontSize={vfs * 0.9}
            fontFamily="'JetBrains Mono', monospace"
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            {live.change24h >= 0 ? "+" : ""}{live.change24h.toFixed(1)}%
          </text>
        )}
      </g>
    );
  }

  const SortIcon = ({ col }: { col: SortCol }) => {
    if (sortCol !== col) return <ArrowsDownUp size={10} className="text-zinc-600" />;
    return sortAsc
      ? <ArrowUp size={10} className="text-violet-400" />
      : <ArrowDown size={10} className="text-violet-400" />;
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-4">

      {/* Market Strip */}
      <MarketStrip prices={livePrices} fng={fng} />

      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-[0.15em] uppercase mr-1">
          Liquidation Heatmap
        </span>

        {/* Timeframes */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5 flex-wrap">
          {TFS.map((t) => (
            <button
              key={t}
              onClick={() => { setTf(t); setSelectedCoin(null); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                tf === t
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Symbol / Exchange toggle */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5">
          {(["symbol", "exchange"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-colors ${
                view === v ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Coin search */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 min-w-[140px]">
          <MagnifyingGlass size={12} className="text-zinc-500 shrink-0" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedCoin(null); }}
            placeholder="Filter coin..."
            className="bg-transparent text-[11px] font-mono text-zinc-200 placeholder-zinc-600 outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-zinc-600 hover:text-zinc-300">
              <X size={10} />
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3 text-[9px] font-mono text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: cellColor(0.85) }} />
            <span>Longs liq</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: cellColor(0.15) }} />
            <span>Shorts liq</span>
          </div>
          <span className="text-zinc-700">Click coin for detail</span>
        </div>
      </div>

      {/* Coin Detail Panel */}
      <AnimatePresence>
        {selectedCoin && (
          <CoinDetailPanel
            coin={coinDetailData}
            live={priceMap[selectedCoin]}
            onClose={() => setSelectedCoin(null)}
          />
        )}
      </AnimatePresence>

      {/* Treemap + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <div
          className="h-[360px] border border-zinc-800 rounded-sm overflow-hidden bg-zinc-900/20 relative"
        >
          {filteredCoins.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-600 text-xs font-mono">
              No coins match &ldquo;{search}&rdquo;
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={filteredCoins}
                dataKey="value"
                aspectRatio={16 / 9}
                content={<CoinCell />}
                isAnimationActive={false}
              />
            </ResponsiveContainer>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Total Liquidations
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TFS.slice(0, 4).map((t) => (
              <StatBox key={t} label={t} stat={STATS[t]} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TFS.slice(4).map((t) => (
              <StatBox key={t} label={t} stat={STATS[t]} />
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Table + Real-time Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Exchange Table */}
        <div className="border border-zinc-800 rounded-sm bg-zinc-900/20 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
            <span className="text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-widest">
              Exchange Liquidations
            </span>
            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-600">
              <span>Click column to sort</span>
            </div>
          </div>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-3 py-2 text-left text-zinc-500 font-normal text-[10px] uppercase tracking-wider">Exchange</th>
                {(["liq", "long", "short"] as SortCol[]).map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-3 py-2 text-right text-zinc-500 font-normal text-[10px] uppercase tracking-wider cursor-pointer hover:text-zinc-300 select-none"
                  >
                    <span className="inline-flex items-center gap-1 justify-end">
                      {col === "liq" ? "Total" : col} <SortIcon col={col} />
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2 text-right text-zinc-500 font-normal text-[10px] uppercase tracking-wider">Rate</th>
              </tr>
            </thead>
            <tbody>
              {sortedExchanges.map((ex, i) => (
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
                    {(ex.shortRate * 100).toFixed(2)}% Short
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Real-time Feed */}
        <div className="border border-zinc-800 rounded-sm bg-zinc-900/20 overflow-hidden">
          <div className="flex flex-wrap justify-between items-center px-4 py-3 border-b border-zinc-800 gap-2">
            <span className="text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-widest">
              Real-Time Liquidations
            </span>
            <div className="flex items-center gap-2">
              {/* Exchange filter */}
              <div className="flex gap-0.5">
                {EX_FILTERS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setFeedFilter(ex)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      feedFilter === ex
                        ? "bg-zinc-700 text-zinc-100"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
              {/* Status dots */}
              <div className="flex items-center gap-2">
                {(["Binance", "Bybit", "OKX"] as const).map((ex) => {
                  const key = ex.toLowerCase() as "binance" | "bybit" | "okx";
                  const s = feedStats[key];
                  return (
                    <div key={ex} className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s === "live" ? "bg-emerald-400" :
                        s === "connecting" ? "bg-amber-400 animate-pulse" :
                        "bg-rose-500"
                      }`} />
                      <span className="text-[9px] font-mono text-zinc-600">{ex.slice(0, 3)}</span>
                    </div>
                  );
                })}
                <span className="text-[9px] font-mono text-zinc-700 tabular-nums">
                  {feedStats.totalEvents} evt
                </span>
              </div>
            </div>
          </div>

          {filteredFeed.length === 0 ? (
            <div className="px-4 py-10 flex flex-col items-center gap-2 text-zinc-600">
              <Spinner size={20} className="animate-spin" />
              <span className="text-xs font-mono">Waiting for liquidations...</span>
              <span className="text-[10px] font-mono text-zinc-700">
                {feedStats.binance === "live" ? "Binance connected" : "Connecting to Binance..."}
              </span>
            </div>
          ) : (
            <div className="overflow-auto max-h-[340px]">
              <table className="w-full text-xs font-mono">
                <thead className="sticky top-0 bg-zinc-950">
                  <tr className="border-b border-zinc-800">
                    {["Symbol", "Price", "Value", "Time"].map((h) => (
                      <th
                        key={h}
                        className={`px-3 py-2 text-zinc-500 font-normal text-[10px] uppercase tracking-wider ${
                          h === "Symbol" ? "text-left" : "text-right"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filteredFeed.slice(0, 20).map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{
                          opacity: 0,
                          backgroundColor:
                            item.side === "LONG" ? "rgba(244,63,94,0.18)" : "rgba(52,211,153,0.15)",
                        }}
                        animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9 }}
                        className="border-b border-zinc-800/50"
                      >
                        <td className="px-3 py-2">
                          <span
                            className={`font-semibold ${
                              item.side === "LONG" ? "text-rose-400" : "text-emerald-400"
                            }`}
                          >
                            {item.symbol.replace("USDT", "")}
                          </span>
                          <span
                            className={`ml-1 text-[9px] px-1 py-0.5 rounded ${
                              item.side === "LONG"
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-emerald-500/20 text-emerald-400"
                            }`}
                          >
                            {item.side}
                          </span>
                          <span className={`ml-1 text-[9px] ${EX_COLORS[item.exchange] ?? "text-zinc-500"}`}>
                            {item.exchange.slice(0, 3).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-zinc-400">
                          {item.price >= 1000
                            ? `$${item.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                            : `$${item.price.toFixed(4)}`}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-zinc-200 font-semibold">
                          {fmt$(item.value)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-zinc-600 text-[10px]">
                          {item.time}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Live price table */}
      {livePrices.length > 0 && (
        <div className="border border-zinc-800 rounded-sm bg-zinc-900/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
            <span className="text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-widest">
              Live Prices
            </span>
            <span className="text-[10px] font-mono text-zinc-600 flex items-center gap-1">
              <BroadcastSimple size={10} className="text-emerald-400" /> Live via Binance Futures
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Symbol", "Price", "24H", "Volume"].map((h) => (
                    <th
                      key={h}
                      className={`px-3 py-2 text-zinc-500 font-normal text-[10px] uppercase tracking-wider ${
                        h === "Symbol" ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {livePrices.map((p) => (
                  <tr
                    key={p.symbol}
                    onClick={() => {
                      const coin = allCoins.find((c) => c.name === p.symbol);
                      if (coin) setSelectedCoin(p.symbol);
                    }}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-2.5 text-zinc-200 font-semibold">{p.symbol}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-300">{fmtPrice(p.price)}</td>
                    <td className={`px-3 py-2.5 text-right tabular-nums font-semibold ${
                      p.change24h >= 0 ? "text-emerald-400" : "text-rose-500"
                    }`}>
                      {p.change24h >= 0 ? "+" : ""}{p.change24h.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-zinc-500">{fmt$(p.volume)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && <CoinTooltip tip={tooltip} live={priceMap[tooltip.coin.name]} />}
    </div>
  );
}
