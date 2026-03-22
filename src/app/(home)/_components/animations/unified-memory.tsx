"use client";

import Image from "next/image";
import { motion } from "motion/react";
import asanaIcon from "@/assets/icons/asana.svg";
import githubIcon from "@/assets/icons/github.svg";
import googleCalendarIcon from "@/assets/icons/googlecalendar.svg";
import zoomIcon from "@/assets/icons/zoom.svg";
import slackIcon from "@/assets/icons/slack.svg";

const TILE_SHADOW =
  "0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)";
const TILE_SHADOW_HOVER =
  "0 0 0 1px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)";
const BUBBLE_SHADOW =
  "0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.07), 0 8px 28px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)";

function IconTile({
  children,
  x,
  y,
  floatDelay,
  elevated,
  enterDelay,
}: {
  children: React.ReactNode;
  x: string;
  y: string;
  floatDelay: number;
  elevated?: boolean;
  enterDelay: number;
}) {
  return (
    <motion.div
      className="absolute flex items-center justify-center bg-white"
      style={{
        width: 68,
        height: 68,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        borderRadius: "var(--radius-xl)",
        boxShadow: elevated ? TILE_SHADOW_HOVER : TILE_SHADOW,
        border: "1px solid var(--border)",
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: enterDelay },
        scale: { duration: 0.5, delay: enterDelay },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
      }}
    >
      {children}
    </motion.div>
  );
}

function SentraMark() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <circle cx="40" cy="12" r="6" fill="var(--brand)" opacity="0.9" />
      <circle cx="68" cy="26" r="5" fill="var(--brand)" opacity="0.6" />
      <circle cx="12" cy="26" r="5" fill="var(--brand)" opacity="0.6" />
      <circle cx="40" cy="40" r="8" fill="var(--brand)" />
      <circle cx="68" cy="54" r="5" fill="var(--brand)" opacity="0.6" />
      <circle cx="12" cy="54" r="5" fill="var(--brand)" opacity="0.6" />
      <circle cx="40" cy="68" r="6" fill="var(--brand)" opacity="0.9" />

      <line x1="40" y1="12" x2="40" y2="40" stroke="var(--brand)" strokeWidth="1.5" opacity="0.18" />
      <line x1="40" y1="40" x2="40" y2="68" stroke="var(--brand)" strokeWidth="1.5" opacity="0.18" />
      <line x1="12" y1="26" x2="40" y2="40" stroke="var(--brand)" strokeWidth="1.5" opacity="0.18" />
      <line x1="68" y1="26" x2="40" y2="40" stroke="var(--brand)" strokeWidth="1.5" opacity="0.18" />
      <line x1="12" y1="54" x2="40" y2="40" stroke="var(--brand)" strokeWidth="1.5" opacity="0.18" />
      <line x1="68" y1="54" x2="40" y2="40" stroke="var(--brand)" strokeWidth="1.5" opacity="0.18" />
      <line x1="40" y1="12" x2="68" y2="26" stroke="var(--brand)" strokeWidth="1" opacity="0.1" />
      <line x1="40" y1="12" x2="12" y2="26" stroke="var(--brand)" strokeWidth="1" opacity="0.1" />
      <line x1="40" y1="68" x2="68" y2="54" stroke="var(--brand)" strokeWidth="1" opacity="0.1" />
      <line x1="40" y1="68" x2="12" y2="54" stroke="var(--brand)" strokeWidth="1" opacity="0.1" />
      <line x1="12" y1="26" x2="12" y2="54" stroke="var(--brand)" strokeWidth="1" opacity="0.08" />
      <line x1="68" y1="26" x2="68" y2="54" stroke="var(--brand)" strokeWidth="1" opacity="0.08" />
    </svg>
  );
}

function DotGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="um-dot-grid" x="10" y="10" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="rgba(0,0,0,0.06)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#um-dot-grid)" />
    </svg>
  );
}

const ICON_POSITIONS = [
  { x: "18%", y: "18%", icon: asanaIcon, alt: "Asana", size: 30 },
  { x: "50%", y: "10%", icon: githubIcon, alt: "GitHub", size: 28 },
  { x: "10%", y: "50%", icon: googleCalendarIcon, alt: "Google Calendar", size: 30 },
  { x: "42%", y: "44%", icon: zoomIcon, alt: "Zoom", size: 30, elevated: true },
  { x: "18%", y: "76%", icon: slackIcon, alt: "Slack", size: 28 },
];

function ConnectionLines() {
  const sentraX = 72;
  const sentraY = 42;

  const lines = [
    { from: { x: 18, y: 18 }, label: "Asana" },
    { from: { x: 50, y: 10 }, label: "GitHub" },
    { from: { x: 10, y: 50 }, label: "Calendar" },
    { from: { x: 42, y: 44 }, label: "Zoom" },
    { from: { x: 18, y: 76 }, label: "Slack" },
  ];

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <defs>
        <linearGradient id="um-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes um-dash {
          to { stroke-dashoffset: -12; }
        }
        .um-flow {
          stroke-dasharray: 2.5 4;
          animation: um-dash 3s linear infinite;
        }
      `}</style>

      {lines.map((line, i) => {
        const midX = (line.from.x + sentraX) / 2;
        const midY = (line.from.y + sentraY) / 2;
        const cpX = midX + (sentraY - line.from.y) * 0.15;
        const cpY = midY - (sentraX - line.from.x) * 0.1;

        return (
          <g key={line.label}>
            <path
              d={`M ${line.from.x} ${line.from.y} Q ${cpX} ${cpY} ${sentraX} ${sentraY}`}
              stroke="url(#um-line-grad)"
              strokeWidth="0.5"
              className="um-flow"
              style={{ animationDelay: `${-i * 0.7}s` }}
            />
            <circle r="0.8" fill="var(--brand)" opacity="0.5">
              <animateMotion
                dur={`${3.5 + i * 0.3}s`}
                repeatCount="indefinite"
                path={`M ${line.from.x} ${line.from.y} Q ${cpX} ${cpY} ${sentraX} ${sentraY}`}
                begin={`${i * 0.5}s`}
              />
            </circle>
          </g>
        );
      })}
    </motion.svg>
  );
}

function ChatBubble() {
  return (
    <motion.div
      className="absolute flex flex-col"
      style={{
        right: "4%",
        bottom: "12%",
        width: "52%",
        maxWidth: 260,
        borderRadius: "var(--radius-xl)",
        boxShadow: BUBBLE_SHADOW,
        borderLeft: "2.5px solid var(--brand)",
        background: "white",
        padding: "12px 14px",
      }}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: [0, -3, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.6, delay: 1.4 },
        scale: { duration: 0.6, delay: 1.4 },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
      }}
    >
      <div className="flex items-start gap-2.5 mb-2.5">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white mt-0.5"
          style={{ background: "var(--brand)" }}
        >
          S
        </div>
        <div>
          <p style={{ color: "var(--foreground)", fontSize: 12, lineHeight: 1.5, fontWeight: 400 }}>
            <span style={{ color: "var(--brand)", fontWeight: 600 }}>@Sentra</span>{" "}
            When did we decide to add a feedback widget?
          </p>
        </div>
      </div>
      <div
        className="flex items-start gap-2.5"
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 10,
        }}
      >
        <div
          className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: "rgba(37,99,235,0.1)" }}
        >
          <svg viewBox="0 0 80 80" width="12" height="12">
            <circle cx="40" cy="12" r="4" fill="var(--brand)" />
            <circle cx="40" cy="40" r="5.5" fill="var(--brand)" />
            <circle cx="40" cy="68" r="4" fill="var(--brand)" />
            <circle cx="16" cy="30" r="3" fill="var(--brand)" opacity="0.5" />
            <circle cx="64" cy="30" r="3" fill="var(--brand)" opacity="0.5" />
          </svg>
        </div>
        <div>
          <p style={{ color: "var(--secondary)", fontSize: 11, lineHeight: 1.5, fontWeight: 400 }}>
            In a planning meeting on May 27,{" "}
            <span style={{ color: "var(--brand)", fontWeight: 500 }}>@Marzia</span>{" "}
            mentioned customer feedback about the onboarding flow...
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span style={{ fontSize: 9, color: "#a1a1aa", fontWeight: 500 }}>2m ago</span>
            <span style={{ fontSize: 9, color: "#a1a1aa" }}>·</span>
            <span style={{ fontSize: 9, color: "var(--brand)", fontWeight: 500, opacity: 0.7 }}>View source</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityPill() {
  return (
    <motion.div
      className="absolute flex items-center gap-2"
      style={{
        top: "5%",
        right: "5%",
        padding: "5px 12px",
        borderRadius: 100,
        background: "white",
        boxShadow: TILE_SHADOW,
        border: "1px solid var(--border)",
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.8 }}
    >
      <motion.span
        className="block rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "#22c55e",
        }}
        animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0.4)", "0 0 6px rgba(34,197,94,0.6)", "0 0 0px rgba(34,197,94,0.4)"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span style={{ fontSize: 10, color: "var(--secondary)", fontWeight: 500 }}>
        3 decisions tracked
      </span>
    </motion.div>
  );
}

function SyncLabel() {
  return (
    <motion.div
      className="absolute flex items-center gap-1.5"
      style={{
        left: "56%",
        top: "54%",
        padding: "3px 10px",
        borderRadius: 100,
        background: "rgba(37,99,235,0.06)",
        border: "1px solid rgba(37,99,235,0.12)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.8, 0.5, 0.8] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
    >
      <motion.span
        className="block rounded-full"
        style={{ width: 5, height: 5, background: "var(--brand)", opacity: 0.6 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <span style={{ fontSize: 9, color: "var(--brand)", fontWeight: 500 }}>syncing</span>
    </motion.div>
  );
}

function SourceTag() {
  return (
    <motion.div
      className="absolute"
      style={{
        left: "5%",
        bottom: "5%",
        padding: "4px 10px",
        borderRadius: "var(--radius-md)",
        background: "white",
        boxShadow: TILE_SHADOW,
        border: "1px solid var(--border)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 2.4 }}
    >
      <span style={{ fontSize: 9, color: "var(--muted)", fontWeight: 500, letterSpacing: "0.04em" }}>
        5 SOURCES CONNECTED
      </span>
    </motion.div>
  );
}

export default function UnifiedMemoryAnimation() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 72% 42%, rgba(37,99,235,0.04) 0%, transparent 50%), var(--background)",
      }}
    >
      <DotGrid />
      <ConnectionLines />

      {ICON_POSITIONS.map((pos, i) => (
        <IconTile
          key={pos.alt}
          x={pos.x}
          y={pos.y}
          floatDelay={i * 0.6}
          enterDelay={i * 0.12}
          elevated={pos.elevated}
        >
          <Image src={pos.icon} alt={pos.alt} width={pos.size} height={pos.size} />
        </IconTile>
      ))}

      {/* Sentra mark — right-center focal point */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{
          left: "72%",
          top: "42%",
          transform: "translate(-50%, -50%)",
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: [1, 1.04, 1] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.8 },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            filter:
              "drop-shadow(0 0 16px rgba(37,99,235,0.18)) drop-shadow(0 0 40px rgba(37,99,235,0.08))",
          }}
        >
          <SentraMark />
        </div>
      </motion.div>

      <ChatBubble />
      <ActivityPill />
      <SyncLabel />
      <SourceTag />
    </div>
  );
}
