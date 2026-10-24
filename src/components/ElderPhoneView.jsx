import React from 'react';
import {
  PhoneOff, Mic, MicOff, Volume2, Grid, AlertOctagon,
  ShieldAlert, ShieldCheck, Wifi, Battery, Signal, User,
  VolumeX, Lock, Sparkles, AlertTriangle
} from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { ThreatMeter } from './ThreatMeter';

export function ElderPhoneView({
  callActive,
  callTimeFormatted,
  callerInfo,
  threatScore,
  acousticTone,
  detectedRedFlags = [],
  warningGujarati = '',
  warningHindi = '',
  language = 'gu',
  isSpeakingWarning = false,
  onReplayWarning,
  isRemoteTerminated = false,
  onEndCallManually
}) {
  const isCritical = threatScore >= 70;
  const isSuspicious = threatScore >= 35 && threatScore < 70;

  // Choose warning by selected language
  const activeWarning = language === 'gu'
    ? (warningGujarati || 'પપ્પા, કૉલ સુરક્ષિત છે. સાવચેત રહો.')
    : (warningHindi || 'पापा, कॉल सुरक्षित है। सावधान रहिए।');

  const allRedFlagOptions = [
    { id: 'police', label: '🚨 Fake Police/CBI', match: ['Authority Claim (CBI/Police)', 'Fake Police', 'Police', 'CBI'] },
    { id: 'arrest', label: '⚠️ Digital Arrest Threat', match: ['Threat of Arrest', 'Digital Arrest', 'Isolation Demand (Digital Arrest)'] },
    { id: 'urgency', label: '⚡ Extreme Urgency', match: ['Extreme Urgency', 'Urgency', 'Urgency Signal'] },
    { id: 'money', label: '💸 OTP/Money Demand', match: ['OTP/Money Demand', 'Money Demand', 'Financial Extortion'] },
    { id: 'vocal', label: '🎙️ Vocal Intimidation', match: ['Vocal Intimidation', 'Intimidation', 'Vocal Aggression'] },
    { id: 'kyc', label: '🔒 Fake Bank KYC', match: ['Fake Bank KYC', 'Bank Impersonation', 'Account Block Threat'] }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Panel Title & Label */}
      <div className="mb-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
            Bapu's Smartphone
          </h2>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
            Elder View
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Live call receiver protected by Acoustic Shield
        </p>
      </div>

      {/* Realistic Mobile Frame */}
      <div className={`relative w-[340px] sm:w-[370px] h-[720px] rounded-[48px] p-3.5 bg-slate-950 border-4 transition-all duration-500 overflow-hidden phone-shadow-elder ${
        isRemoteTerminated
          ? 'border-indigo-500 ring-4 ring-indigo-500/30'
          : isCritical
          ? 'border-red-600 ring-4 ring-red-600/40'
          : isSuspicious
          ? 'border-amber-500 ring-2 ring-amber-500/30'
          : 'border-slate-700'
      }`}>
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-indigo-950" />
        </div>

        {/* OLED Screen Content Container */}
        <div className="relative w-full h-full rounded-[38px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 flex flex-col justify-between overflow-y-auto text-slate-100 border border-slate-800">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-2 pt-2 select-none">
            <span className="font-mono">11:42</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-300">5G</span>
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">94%</span>
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Caller Header & Profile */}
          <div className="flex flex-col items-center mt-3">
            <div className={`relative w-16 h-16 rounded-full p-1 flex items-center justify-center transition-all ${
              isCritical
                ? 'bg-red-500/30 ring-4 ring-red-500 animate-pulse'
                : isSuspicious
                ? 'bg-amber-500/20 ring-2 ring-amber-500'
                : 'bg-slate-800 ring-2 ring-slate-700'
            }`}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {isCritical ? (
                  <AlertOctagon className="w-8 h-8 text-red-500 animate-bounce" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              {callActive && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-[9px] font-bold text-slate-950 px-1.5 py-0.2 rounded-full">
                  LIVE
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-100 mt-2 text-center leading-tight">
              {callerInfo.name || 'Unknown Caller'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {callerInfo.number || '+91 91234 56789'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {callActive ? callTimeFormatted : '00:00 (Call Idle)'}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Shield Active
              </span>
            </div>
          </div>

          {/* Waveform Visualizer */}
          <div className="my-1">
            <WaveformVisualizer isActive={callActive} riskScore={threatScore} isSpeaking={callActive} />
          </div>

          {/* Threat Meter */}
          <div className="my-1">
            <ThreatMeter score={threatScore} acousticTone={acousticTone} />
          </div>

          {/* Dynamic Red Flag Badges */}
          <div className="my-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
              <span>Acoustic & Semantic Red Flags</span>
              <span className="text-[9px] font-mono text-slate-500">Live AI Detection</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allRedFlagOptions.map((flag) => {
                const isTriggered = detectedRedFlags.some(f =>
                  flag.match.some(m => f.toLowerCase().includes(m.toLowerCase()))
                );

                return (
                  <span
                    key={flag.id}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all duration-300 ${
                      isTriggered
                        ? 'bg-red-500/25 border-red-500/80 text-red-200 ring-1 ring-red-400 animate-pulse shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-600 opacity-60'
                    }`}
                  >
                    {flag.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Elder Voice Warning Banner (Large Text for Bapu) */}
          <div className={`rounded-2xl p-3 border transition-all duration-300 my-1 ${
            isCritical
              ? 'bg-red-950/70 border-red-500/80 ring-2 ring-red-500/50 shadow-md'
              : isSuspicious
              ? 'bg-amber-950/60 border-amber-500/60'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isCritical ? 'text-red-300 font-extrabold animate-pulse' : 'text-slate-300'
              }`}>
                <Volume2 className="w-3.5 h-3.5" />
                {language === 'gu' ? 'દાદા / પપ્પા માટે સુરક્ષા સંદેશ' : 'पापा के लिए सुरक्षा चेतावनी'}
              </span>

              {callActive && (
                <button
                  type="button"
                  onClick={onReplayWarning}
                  className="px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1 transition-all"
                  title="Speak warning aloud"
                >
                  <Volume2 className="w-3 h-3 text-amber-300" />
                  {isSpeakingWarning ? 'બોલી રહ્યું છે...' : 'સાંભળો (Replay)'}
                </button>
              )}
            </div>

            <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
              isCritical ? 'text-red-100 font-bold' : isSuspicious ? 'text-amber-200' : 'text-slate-300'
            }`}>
              {activeWarning}
            </p>
          </div>

          {/* Call Controls */}
          <div className="grid grid-cols-4 gap-2 pt-2 mt-auto">
            <button className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition">
              <Mic className="w-4 h-4" />
              <span className="text-[9px] mt-1 font-medium">Mute</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition">
              <Grid className="w-4 h-4" />
              <span className="text-[9px] mt-1 font-medium">Keypad</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition">
              <Volume2 className="w-4 h-4" />
              <span className="text-[9px] mt-1 font-medium">Speaker</span>
            </button>
            <button
              onClick={onEndCallManually}
              disabled={!callActive}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition ${
                callActive
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <PhoneOff className="w-4 h-4" />
              <span className="text-[9px] mt-1 font-bold">End Call</span>
            </button>
          </div>

          {/* Remote Disconnect Overlay (When Son disconnects remotely) */}
          {isRemoteTerminated && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md rounded-[38px] z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Kavach Shield Override
              </span>
              <h4 className="text-lg font-black text-white leading-snug">
                CALL TERMINATED BY SON'S REMOTE CO-PILOT
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                તમારા દીકરા સિદ્ધાંતે આ શંકાસ્પદ ફ્રોડ કૉલ તાત્કાલિક કાપી નાખ્યો છે અને તમારું ખાતું સુરક્ષિત કર્યું છે.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 w-full text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">Protected:</span> Zero money transferred. Emergency Contact notified.
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
