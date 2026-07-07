import { motion } from "framer-motion";

/**
 * Continuous ECG heartbeat "lifeline" — an SVG polyline sweeping across
 * the screen with a glowing scan dot at its head. Pure decorative.
 */
export function ECGLifeline({ className = "" }: { className?: string }) {
  // One heartbeat segment repeated horizontally
  const beat =
    "0,50 60,50 70,50 78,20 86,80 94,35 102,50 160,50 170,50 178,20 186,80 194,35 202,50 260,50 270,50 278,20 286,80 294,35 302,50 360,50";

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      {/* soft gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.58_0.22_25_/_0.12),_transparent_70%)]" />

      <svg
        viewBox="0 0 720 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="ecg-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.58 0.22 25)" stopOpacity="0" />
            <stop offset="30%" stopColor="oklch(0.58 0.22 25)" stopOpacity="1" />
            <stop offset="70%" stopColor="oklch(0.52 0.20 250)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.55 0.24 340)" stopOpacity="0" />
          </linearGradient>
          <filter id="ecg-glow">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* baseline */}
        <line
          x1="0"
          y1="50"
          x2="720"
          y2="50"
          stroke="oklch(0.55 0.02 260 / 0.15)"
          strokeWidth="0.5"
        />

        {/* gliding heartbeat track (2x width so it loops seamlessly) */}
        <g className="ecg-track" style={{ width: "200%" }}>
          <polyline
            points={beat}
            fill="none"
            stroke="url(#ecg-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ecg-glow)"
          />
          <polyline
            points={beat.replace(/(\d+),/g, (_m, n) => `${Number(n) + 360},`)}
            fill="none"
            stroke="url(#ecg-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ecg-glow)"
          />
        </g>
      </svg>

      {/* pulse dot */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-glow"
        animate={{ x: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ left: 0 }}
      />
    </div>
  );
}
