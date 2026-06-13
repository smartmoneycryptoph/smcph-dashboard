"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  TelegramLogo,
  YoutubeLogo,
  InstagramLogo,
  FacebookLogo,
  XLogo,
  TiktokLogo,
  CheckCircle,
  ArrowRight,
  ChartLineUp,
} from "@phosphor-icons/react";

const SOCIALS = [
  {
    id: "telegram",
    label: "Telegram",
    description: "Join our free trading signals group",
    url: "https://t.me/smartmoneycryptotraders",
    icon: TelegramLogo,
    color: "text-sky-400",
    border: "border-sky-500/30 hover:border-sky-400/60",
    bg: "bg-sky-500/5 hover:bg-sky-500/10",
    badge: "bg-sky-500/20 text-sky-400",
    badgeText: "Main",
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Daily market updates and trade setups",
    url: "https://www.facebook.com/smartmoneycryptoph",
    icon: FacebookLogo,
    color: "text-blue-400",
    border: "border-blue-500/30 hover:border-blue-400/60",
    bg: "bg-blue-500/5 hover:bg-blue-500/10",
    badge: null,
    badgeText: null,
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Trade breakdowns, analysis and education",
    url: "https://www.youtube.com/@smartmoneycryptoph",
    icon: YoutubeLogo,
    color: "text-rose-400",
    border: "border-rose-500/30 hover:border-rose-400/60",
    bg: "bg-rose-500/5 hover:bg-rose-500/10",
    badge: null,
    badgeText: null,
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Charts, setups and trade results",
    url: "https://www.instagram.com/smartmoneycryptoph",
    icon: InstagramLogo,
    color: "text-pink-400",
    border: "border-pink-500/30 hover:border-pink-400/60",
    bg: "bg-pink-500/5 hover:bg-pink-500/10",
    badge: null,
    badgeText: null,
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "Short-form trade ideas and market reads",
    url: "https://www.tiktok.com/@smartmoneycryptoph",
    icon: TiktokLogo,
    color: "text-zinc-100",
    border: "border-zinc-500/30 hover:border-zinc-300/60",
    bg: "bg-zinc-500/5 hover:bg-zinc-500/10",
    badge: null,
    badgeText: null,
  },
  {
    id: "x",
    label: "X (Twitter)",
    description: "Real-time alerts and market commentary",
    url: "https://x.com/SMCTradersPH",
    icon: XLogo,
    color: "text-zinc-300",
    border: "border-zinc-600/30 hover:border-zinc-400/60",
    bg: "bg-zinc-500/5 hover:bg-zinc-500/10",
    badge: null,
    badgeText: null,
  },
];

const STORAGE_KEY = "smcph_followed";

export default function FollowGate() {
  const router = useRouter();
  const [clicked, setClicked] = useState<Set<string>>(new Set());
  const [confirmed, setConfirmed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleSocialClick(id: string, url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
    setClicked((prev) => new Set([...prev, id]));
  }

  function handleUnlock() {
    if (!confirmed) return;
    localStorage.setItem(STORAGE_KEY, "1");
    setRedirecting(true);
    setTimeout(() => router.push("/dashboard"), 800);
  }

  const allClicked = SOCIALS.every((s) => clicked.has(s.id));

  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10 max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <ChartLineUp size={22} weight="bold" className="text-violet-400" />
          <span className="text-xs font-mono text-violet-400 tracking-[0.2em] uppercase">
            SmartMoney CryptoPH
          </span>
        </div>
        <h1 className="text-2xl font-mono font-bold text-zinc-50 mb-3 tracking-tight">
          Get Free Access
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Follow us on all platforms to unlock the live trading dashboard and premium signals. Takes 60 seconds.
        </p>
      </motion.div>

      {/* Social cards */}
      <div className="w-full max-w-md space-y-3 mb-8">
        {SOCIALS.map((s, i) => {
          const Icon = s.icon;
          const done = clicked.has(s.id);
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              onClick={() => handleSocialClick(s.id, s.url)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded border transition-all duration-200 ${s.border} ${s.bg} relative overflow-hidden`}
            >
              <Icon size={22} weight="fill" className={s.color} />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-zinc-200">
                    {s.label}
                  </span>
                  {s.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${s.badge}`}>
                      {s.badgeText}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">{s.description}</p>
              </div>
              <AnimatePresence>
                {done ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle size={18} weight="fill" className="text-emerald-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="arrow"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <ArrowRight size={16} className="text-zinc-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Confirm + unlock */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="w-full max-w-md space-y-4"
      >
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              className="sr-only"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              confirmed ? "bg-violet-600 border-violet-600" : "border-zinc-600 group-hover:border-zinc-400"
            }`}>
              {confirmed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-zinc-400 leading-relaxed">
            I have followed SmartMoney CryptoPH on all platforms above and understand this is for educational purposes only, not financial advice.
          </span>
        </label>

        <button
          onClick={handleUnlock}
          disabled={!confirmed || redirecting}
          className={`w-full py-3 rounded font-mono text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
            confirmed && !redirecting
              ? "bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {redirecting ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />
              Unlocking...
            </>
          ) : (
            <>
              Access Dashboard
              <ArrowRight size={15} weight="bold" />
            </>
          )}
        </button>

        {allClicked && !confirmed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[11px] text-amber-400/70 font-mono"
          >
            Check the box above to confirm and unlock
          </motion.p>
        )}
      </motion.div>

      <p className="mt-8 text-[10px] text-zinc-700 font-mono text-center max-w-xs">
        Access is stored on this device. You only need to do this once.
      </p>
    </div>
  );
}
