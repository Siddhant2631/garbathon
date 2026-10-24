import React, { useEffect, useState, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';

export function WaveformVisualizer({ isActive, riskScore = 0, isSpeaking = false }) {
  const [frequencies, setFrequencies] = useState(() => new Array(24).fill(8));
  const animFrameRef = useRef(null);

  useEffect(() => {
    let phase = 0;

    const render = () => {
      if (isActive) {
        // Try to get real audio analyser data first
        const realData = audioEngine.getFrequencyData();
        let hasRealAudio = false;

        const nextFreqs = [];
        const isCritical = riskScore >= 70;
        const isSuspicious = riskScore >= 35 && riskScore < 70;

        for (let i = 0; i < 24; i++) {
          const sample = realData[i] || 0;
          if (sample > 15) hasRealAudio = true;

          if (hasRealAudio) {
            nextFreqs.push(Math.max(6, Math.min(54, sample * 0.45)));
          } else {
            // Organic acoustic simulation waveform
            const wave1 = Math.sin(phase + i * 0.35);
            const wave2 = Math.cos(phase * 1.5 + i * 0.2);
            const intensity = isCritical ? 1.6 : isSuspicious ? 1.1 : 0.6;
            const height = Math.abs(wave1 * wave2) * 36 * intensity + 6;
            nextFreqs.push(Math.round(height));
          }
        }

        phase += isCritical ? 0.25 : 0.12;
        setFrequencies(nextFreqs);
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        setFrequencies(new Array(24).fill(6));
      }
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, riskScore, isSpeaking]);

  const getColorClass = () => {
    if (riskScore >= 70) return 'from-red-500 via-rose-500 to-amber-500';
    if (riskScore >= 35) return 'from-amber-400 via-orange-500 to-yellow-400';
    return 'from-emerald-400 via-teal-400 to-cyan-400';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <div className="h-14 w-full flex items-center justify-center gap-1.5 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
        {frequencies.map((height, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-75 bg-gradient-to-t ${getColorClass()}`}
            style={{
              height: `${Math.max(6, Math.min(50, height))}px`,
              opacity: isActive ? (0.4 + (height / 50) * 0.6) : 0.2
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between w-full px-2 mt-1.5 text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? (riskScore >= 70 ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse') : 'bg-slate-600'}`} />
          {isActive ? (isSpeaking ? 'Acoustic Voice Energy Active' : 'Real-time Audio Stream') : 'Acoustic Stream Idle'}
        </span>
        <span>{isActive ? 'Sampling: 16 kHz / 5s chunk' : 'Standby'}</span>
      </div>
    </div>
  );
}
