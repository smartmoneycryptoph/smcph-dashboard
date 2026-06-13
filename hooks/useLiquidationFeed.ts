"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface LiqEvent {
  id: string;
  symbol: string;
  price: number;
  value: number;
  time: string;
  side: "LONG" | "SHORT";
  exchange: "Binance" | "Bybit" | "OKX";
}

export interface FeedStats {
  binance: "connecting" | "live" | "error";
  bybit: "connecting" | "live" | "error";
  okx: "connecting" | "live" | "error";
  totalEvents: number;
}

const BYBIT_SYMBOLS = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT",
  "BNBUSDT", "ADAUSDT", "AVAXUSDT", "LINKUSDT", "DOTUSDT",
  "NEARUSDT", "WLDUSDT", "TAOUSDT", "ARBUSDT", "OPUSDT",
];

function useReconnectingWs(
  url: string,
  onMessage: (data: unknown) => void,
  onOpen?: (ws: WebSocket) => void,
  onStatusChange?: (status: "connecting" | "live" | "error") => void,
) {
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deadRef = useRef(false);

  useEffect(() => {
    deadRef.current = false;

    function connect() {
      if (deadRef.current) return;
      onStatusChange?.("connecting");
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        onStatusChange?.("live");
        onOpen?.(ws);
      };
      ws.onmessage = (e) => {
        try { onMessage(JSON.parse(e.data)); } catch {}
      };
      ws.onerror = () => {
        onStatusChange?.("error");
      };
      ws.onclose = () => {
        if (!deadRef.current) {
          timerRef.current = setTimeout(connect, 4000);
        }
      };
    }

    connect();

    return () => {
      deadRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
    };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useLiquidationFeed(maxItems = 60) {
  const [events, setEvents] = useState<LiqEvent[]>([]);
  const [stats, setStats] = useState<FeedStats>({
    binance: "connecting",
    bybit: "connecting",
    okx: "connecting",
    totalEvents: 0,
  });
  const counterRef = useRef(0);

  const addEvent = useCallback((event: Omit<LiqEvent, "id">) => {
    if (event.value < 500) return; // filter dust
    const id = `${event.exchange}-${Date.now()}-${++counterRef.current}`;
    setEvents((prev) => [{ ...event, id }, ...prev].slice(0, maxItems));
    setStats((s) => ({ ...s, totalEvents: s.totalEvents + 1 }));
  }, [maxItems]);

  // ── Binance ───────────────────────────────────────────────────────────────
  useReconnectingWs(
    "wss://fstream.binance.com/ws/!forceOrder@arr",
    (data: unknown) => {
      const d = data as { o?: { s: string; S: string; ap: string; p: string; q: string; T: number } };
      const o = d?.o;
      if (!o) return;
      const price = parseFloat(o.ap || o.p);
      const qty = parseFloat(o.q);
      addEvent({
        symbol: o.s,
        price,
        value: qty * price,
        time: new Date(o.T).toTimeString().slice(0, 8),
        side: o.S === "SELL" ? "LONG" : "SHORT",
        exchange: "Binance",
      });
    },
    undefined,
    (status) => setStats((s) => ({ ...s, binance: status })),
  );

  // ── Bybit ─────────────────────────────────────────────────────────────────
  useReconnectingWs(
    "wss://stream.bybit.com/v5/public/linear",
    (data: unknown) => {
      const d = data as { topic?: string; data?: { symbol: string; side: string; price: string; size: string; updatedTime: number } };
      if (!d.topic?.startsWith("liquidation.") || !d.data) return;
      const o = d.data;
      const price = parseFloat(o.price);
      const qty = parseFloat(o.size);
      addEvent({
        symbol: o.symbol,
        price,
        value: qty * price,
        time: new Date(o.updatedTime).toTimeString().slice(0, 8),
        side: o.side === "Buy" ? "SHORT" : "LONG",
        exchange: "Bybit",
      });
    },
    (ws) => {
      ws.send(JSON.stringify({
        op: "subscribe",
        args: BYBIT_SYMBOLS.map((s) => `liquidation.${s}`),
      }));
    },
    (status) => setStats((s) => ({ ...s, bybit: status })),
  );

  // ── OKX ───────────────────────────────────────────────────────────────────
  useReconnectingWs(
    "wss://ws.okx.com:8443/ws/v5/public",
    (data: unknown) => {
      const d = data as {
        arg?: { channel: string };
        data?: Array<{ instId: string; details: Array<{ side: string; bkPx: string; sz: string; ts: string }> }>;
      };
      if (d.arg?.channel !== "liquidation-orders" || !d.data) return;
      for (const item of d.data) {
        const sym = item.instId.replace(/-USDT-SWAP$/, "USDT").replace(/-/g, "");
        for (const det of item.details ?? []) {
          const price = parseFloat(det.bkPx);
          const qty = parseFloat(det.sz);
          addEvent({
            symbol: sym,
            price,
            value: qty * price,
            time: new Date(parseInt(det.ts)).toTimeString().slice(0, 8),
            side: det.side === "buy" ? "SHORT" : "LONG",
            exchange: "OKX",
          });
        }
      }
    },
    (ws) => {
      ws.send(JSON.stringify({
        op: "subscribe",
        args: [{ channel: "liquidation-orders", instType: "SWAP" }],
      }));
    },
    (status) => setStats((s) => ({ ...s, okx: status })),
  );

  return { events, stats };
}
