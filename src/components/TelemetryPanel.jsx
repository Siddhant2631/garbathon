import React, { useRef } from 'react';
import {
  Play, Square, Mic, Upload, Activity, ShieldCheck,
  AlertTriangle, Flame, Clock, Radio, Volume2, FileAudio,
  Code, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

export function TelemetryPanel({
  callActive,
  currentScenarioId,
  onStartScenario,
  onStopCall,
  onFileUpload,
  onToggleMic,
  isMicActive,
  audioFileName,
  chunkCountdown,
  analyzedChunks = [],
  onInspectJson,
  isProcessingChunk,
  audioElementRef
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-3xl border border-slate-800 p-4 lg:p-5 shadow-2xl backdrop-blur-md">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Live Acoustic Telemetry & Control Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            5-second rolling audio chunk ingestion & Gemini 2.5 Flash multimodal stream
          </p>
        </div>

        {/* Live Processing Pulse */}
        <div className="flex items-center gap-2">
          {callActive ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Analyzing Stream</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-mono">System Standby</span>
          )}
        </div>
      </div>

      {/* Control Section: 3 Demo Buttons + File Upload + Live Mic */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            1-Click Demo Scenarios (Zero-Setup)
          </span>
          {callActive && (
            <button
              onClick={onStopCall}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/50 flex items-center gap-1 transition"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop Call
            </button>
          )}
        </div>

        {/* 3 Built-In Playable Call Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DEMO_SCENARIOS.map((scenario) => {
            const isPlayingThis = callActive && currentScenarioId === scenario.id;
            const isScam = scenario.category === 'scam';

            return (
              <button
                key={scenario.id}
                onClick={() => onStartScenario(scenario.id)}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isPlayingThis
                    ? 'bg-indigo-600/25 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isScam
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {isScam ? 'Scam Demo' : 'Genuine Demo'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {scenario.language === 'gu' ? 'Gujarati' : 'Hindi'}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-100 flex items-center gap-1 mt-0.5">
                  <Play className={`w-3.5 h-3.5 shrink-0 ${isPlayingThis ? 'text-indigo-400 fill-current animate-pulse' : 'text-slate-400'}`} />
                  <span className="line-clamp-1">{scenario.shortTitle}</span>
                </div>

                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-tight">
                  {scenario.callerName}
                </p>

                {isPlayingThis && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Inputs: File Upload & Live Mic */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Custom File Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*,.wav,.mp3,.m4a"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">
              {audioFileName ? `File: ${audioFileName}` : 'Upload Custom .wav / .mp3'}
            </span>
          </button>

          {/* Live Mic Scammer Test Button */}
          <button
            onClick={onToggleMic}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
              isMicActive
                ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-400 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isMicActive ? 'Stop Mic Recording' : '🎙️ Live Mic Scammer Test'}</span>
          </button>
        </div>

        {/* Hidden or Minimal Audio player when custom audio file is playing */}
        <audio ref={audioElementRef} className="hidden" controls />
      </div>

      {/* 5-Second Rolling Buffer Countdown Progress Bar */}
      <div className="bg-slate-950/90 rounded-2xl p-3 border border-slate-800 mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            5-Second Acoustic Window
          </span>
          <span className="font-mono text-xs text-indigo-300 font-bold">
            {callActive ? `${(5 - (chunkCountdown % 5)).toFixed(1)}s / 5.0s window` : 'Ready'}
          </span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 rounded-full ${
              isProcessingChunk
                ? 'bg-amber-400 animate-pulse'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}
            style={{
              width: callActive ? `${((5 - (chunkCountdown % 5)) / 5) * 100}%` : '0%'
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500 font-mono">
          <span>Processed Chunks: {analyzedChunks.length}</span>
          <span>{isProcessingChunk ? '⚡ Ingesting in Gemini 2.5 Flash...' : 'Next chunk buffered'}</span>
        </div>
      </div>

      {/* Live Scrolling Timeline of 5-Second Audio Chunks */}
      <div className="flex-1 flex flex-col min-h-[300px] overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Live Chunk Stream ({analyzedChunks.length})
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Reverse Chronological</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {analyzedChunks.length === 0 ? (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
              <Activity className="w-10 h-10 text-slate-700 mb-2 stroke-1" />
              <h4 className="text-sm font-bold text-slate-400">
                Acoustic Stream Idle
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Click any of the 3 built-in demo scenarios above, upload a .wav audio file, or click <strong>Live Mic Test</strong> to speak as a scammer.
              </p>
            </div>
          ) : (
            analyzedChunks.map((chunk, idx) => {
              const isHigh = chunk.riskScore >= 70;
              const isMid = chunk.riskScore >= 35 && chunk.riskScore < 70;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-3.5 border transition-all duration-300 ${
                    isHigh
                      ? 'bg-red-950/30 border-red-500/50 shadow-md ring-1 ring-red-500/20'
                      : isMid
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  {/* Top Bar of Chunk Card */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
                        {chunk.chunkTime}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                        isHigh
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : isMid
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {chunk.riskScore}% Risk
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onInspectJson(chunk.rawJson || chunk)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-slate-700 transition"
                      title="Inspect full JSON response from Gemini"
                    >
                      <Code className="w-3 h-3 text-indigo-400" />
                      <span>Inspect JSON</span>
                    </button>
                  </div>

                  {/* Classification & Acoustic Tone */}
                  <div className="mb-2">
                    <div className="text-xs font-bold text-slate-200">
                      {chunk.scamType}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{chunk.acousticTone}</span>
                    </div>
                  </div>

                  {/* Transcript of what caller just said */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-200 mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Caller Speech Intercept:
                    </span>
                    <p className="italic font-medium leading-relaxed">
                      "{chunk.transcriptSummary}"
                    </p>
                  </div>

                  {/* Red Flags Tags */}
                  {chunk.redFlags && chunk.redFlags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {chunk.redFlags.map((flag, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-500/15 text-red-300 border border-red-500/30"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engine Source Badge */}
                  <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                      {chunk.source || 'Gemini 2.5 Flash'}
                    </span>
                    <span className="font-mono text-slate-400 font-semibold">Latency: ~280ms</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
