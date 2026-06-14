import { NextResponse } from "next/server";

const TOP = [
  "BTCUSDT","ETHUSDT","SOLUSDT","XRPUSDT","DOGEUSDT",
  "BNBUSDT","ADAUSDT","AVAXUSDT","LINKUSDT","DOTUSDT",
  "NEARUSDT","WLDUSDT","TAOUSDT","ARBUSDT","OPUSDT",
  "TRXUSDT","ATOMUSDT","SANDUSDT","MATICUSDT","INJUSDT",
];

export async function GET() {
  try {
    const res = await fetch("https://fapi.binance.com/fapi/v1/ticker/24hr", {
      next: { revalidate: 30 },
    });
    const all = await res.json() as Array<{
      symbol: string;
      lastPrice: string;
      priceChangePercent: string;
      quoteVolume: string;
      openInterest?: string;
    }>;
    const data = all
      .filter((t) => TOP.includes(t.symbol))
      .map((t) => ({
        symbol: t.symbol.replace("USDT", ""),
        price: parseFloat(t.lastPrice),
        change24h: parseFloat(t.priceChangePercent),
        volume: parseFloat(t.quoteVolume),
      }))
      .sort((a, b) => b.volume - a.volume);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
