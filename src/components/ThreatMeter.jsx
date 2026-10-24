import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Flame } from 'lucide-react';

export function ThreatMeter({ score = 0, acousticTone = '' }) {
  // Score clamped 0 to 100
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine status tier
  let statusText = 'SAFE CALL';
  let statusColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
  let icon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;

  if (clampedScore >= 70) {
    statusText = 'CRITICAL SCAM DETECTED';
    statusColor = 'text-red-400';
    badgeBg = 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse';
    icon = <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />;
  } else if (clampedScore >= 35) {
    statusText = 'SUSPICIOUS PATTERN';
    statusColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/20 border-amber-500/40 text-amber-300';
    icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
  }

  // Calculate needle rotation (-90deg to +90deg)
  const needleRotation = -90 + (clampedScore / 100) * 180;

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-red-400" />
          AI Threat Meter
        </span>
        <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${badgeBg}`}>
          {icon}
          <span>{statusText}</span>
        </div>
      </div>

      {/* SVG Semi-Circle Speedometer Gauge */}
      <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Safe Green Zone Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 70 38"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Suspicious Yellow Zone Arc */}
          <path
            d="M 70 38 A 80 80 0 0 1 130 38"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
            opacity="0.85"
          />
          {/* Critical Red Zone Arc */}
          <path
            d="M 130 38 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Needle / Pointer */}
          <g transform={`rotate(${needleRotation}, 100, 100)`} className="needle-transition">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="7" fill="#ffffff" />
            <circle cx="100" cy="100" r="3.5" fill="#ef4444" />
          </g>
        </svg>

        {/* Center Score Readout */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className="flex items-baseline gap-0.5">
            <span className={`text-3xl font-black tracking-tight ${statusColor}`}>
              {clampedScore}
            </span>
            <span className="text-xs font-semibold text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-tight">Risk Probability</span>
        </div>
      </div>

      {/* Acoustic Tone Pill */}
      {acousticTone && (
        <div className="mt-2 text-center w-full bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1">
          <span className="text-[10px] text-slate-400 font-medium">Acoustic Tone: </span>
          <span className="text-xs font-semibold text-slate-200">{acousticTone}</span>
        </div>
      )}
    </div>
  );
}
