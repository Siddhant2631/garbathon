import React, { useState } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, PhoneOff, PhoneForwarded,
  Lock, Volume2, AlertOctagon, BellRing, Smartphone,
  Radio, CheckCircle2, ArrowRight, UserCheck, CreditCard, Sparkles
} from 'lucide-react';

export function SonCopilotView({
  callActive,
  threatScore = 0,
  familyAlert = '',
  transcriptSummary = '',
  scamType = '',
  onRemoteDisconnect,
  onEmergencyUpiLock,
  isUpiLocked = false,
  isCallCutBySon = false,
  onBargeInCall,
  isBargeInActive = false,
  onBroadcastLoudWarning
}) {
  const isCritical = threatScore >= 70;
  const isSuspicious = threatScore >= 35 && threatScore < 70;

  return (
    <div className="flex flex-col items-center">
      {/* Panel Title & Label */}
      <div className="mb-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            isCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'
          }`} />
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
            Son's Phone
          </h2>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
            Family Remote Co-Pilot
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Emergency Contact: Siddhant (+91 9876543210)
        </p>
      </div>

      {/* Realistic Mobile Frame */}
      <div className={`relative w-[340px] sm:w-[370px] h-[720px] rounded-[48px] p-3.5 bg-slate-950 border-4 transition-all duration-500 overflow-hidden ${
        isCritical
          ? 'border-red-600 ring-4 ring-red-500/50 phone-shadow-son-alert animate-flash-screen'
          : 'border-emerald-600/80 phone-shadow-son-safe'
      }`}>
        
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-indigo-950" />
        </div>

        {/* OLED Screen Content Container */}
        <div className={`relative w-full h-full rounded-[38px] transition-colors duration-500 p-4 flex flex-col justify-between overflow-y-auto text-slate-100 border border-slate-800 ${
          isCritical
            ? 'bg-gradient-to-b from-red-950/80 via-slate-950 to-slate-950'
            : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'
        }`}>
          
          {/* Top Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-2 pt-2 select-none">
            <span className="font-mono">11:42</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-300">5G</span>
              <span className="text-[10px]">88%</span>
            </div>
          </div>

          {/* Co-Pilot Header */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${
                isCritical
                  ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/50'
                  : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
              }`}>
                {isCritical ? <BellRing className="w-5 h-5 animate-bounce" /> : <Shield className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">
                  Remote Co-Pilot Active
                </h3>
                <p className="text-[10px] text-slate-400">
                  Linked to Bapu's Device (Ramprasad)
                </p>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isCritical
                ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {isCritical ? 'ALERT RED' : 'ALL SAFE'}
            </span>
          </div>

          {/* Main Body: Calm State OR Flashing Emergency State */}
          {!isCritical ? (
            /* SAFE GUARDIAN MONITORING STATE */
            <div className="my-auto flex flex-col items-center text-center px-2 py-4">
              <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-4">
                <ShieldCheck className="w-12 h-12 text-emerald-400" />
                <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping" />
              </div>

              <h4 className="text-base font-bold text-emerald-300">
                Monitoring Bapu's Call Safety
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Acoustic Shield is running in the background. If a scammer attempts coercion, this phone will immediately flash with remote override controls.
              </p>

              {/* Protected Accounts Card */}
              <div className="w-full mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Protected Accounts & Safeguards
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                      SBI Pension Account
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px] font-semibold">Active & Protected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                      UPI (Google Pay / PhonePe)
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px] font-semibold">Remote Freeze Ready</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* URGENT SCAM EMERGENCY FLASH STATE */
            <div className="my-auto space-y-3">
              
              {/* Emergency Banner */}
              <div className="p-3.5 rounded-2xl bg-red-600 text-white shadow-xl ring-2 ring-red-400/50 animate-bounce">
                <div className="flex items-center gap-2 mb-1">
                  <AlertOctagon className="w-5 h-5 text-white" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    CRITICAL EMERGENCY ALERT
                  </span>
                </div>
                <p className="text-xs font-bold leading-snug">
                  {familyAlert || 'URGENT: Your father is on a suspected Digital Arrest scam call (92% Risk). Caller is demanding money under police threat.'}
                </p>
              </div>

              {/* Threat Classification & Live Intercept */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-red-500/40 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-red-400">
                    Detected Threat Vector:
                  </span>
                  <span className="text-xs font-bold text-red-300 font-mono">
                    {threatScore}% Confidence
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100">
                  {scamType || 'Digital Arrest Extortion Scheme'}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Live Audio Intercept:
                  </span>
                  <p className="italic mt-0.5 line-clamp-2">
                    "{transcriptSummary || 'Caller threatening immediate physical arrest unless funds transferred.'}"
                  </p>
                </div>
              </div>

              {/* Family Co-Pilot Remote Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                  Remote Co-Pilot Intervention Controls
                </div>

                {/* 1. Remotely Disconnect Call */}
                <button
                  type="button"
                  onClick={onRemoteDisconnect}
                  disabled={isCallCutBySon || !callActive}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isCallCutBySon
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-400 animate-pulse'
                  }`}
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>
                    {isCallCutBySon ? '✓ Call Remotely Disconnected' : '🚨 Remotely Disconnect Bapu\'s Call'}
                  </span>
                </button>

                {/* 2. Emergency UPI / NetBanking Lock */}
                <button
                  type="button"
                  onClick={onEmergencyUpiLock}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isUpiLocked
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isUpiLocked ? '✓ UPI & SBI Accounts Frozen' : '🔒 Emergency UPI & NetBanking Lock'}
                  </span>
                </button>

                {/* 3. Call Bapu Now / Barge-In */}
                <button
                  type="button"
                  onClick={onBargeInCall}
                  className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                    isBargeInActive
                      ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border-indigo-500/40'
                  }`}
                >
                  <PhoneForwarded className="w-3.5 h-3.5" />
                  <span>
                    {isBargeInActive ? '✓ 3-Way Conference Active' : '📞 Call Bapu Now / 3-Way Barge-In'}
                  </span>
                </button>

                {/* 4. Broadcast Loud Warning to Bapu's Speaker */}
                <button
                  type="button"
                  onClick={onBroadcastLoudWarning}
                  className="w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>📢 Broadcast Loud Voice Warning to Bapu</span>
                </button>
              </div>

            </div>
          )}

          {/* Bottom Security Footer */}
          <div className="pt-2 border-t border-slate-900 text-center">
            <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Parivaar Kavach Family Network • End-to-End Encrypted
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
