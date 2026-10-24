import React, { useState } from 'react';
import { Shield, ShieldAlert, Key, Eye, EyeOff, Globe2, PhoneCall, CheckCircle2, Volume2, Sparkles } from 'lucide-react';

export function HeaderNav({
  apiKey,
  onApiKeyChange,
  language,
  onLanguageChange,
  callState,
  currentThreatScore
}) {
  const [showKey, setShowKey] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);

  const isCritical = currentThreatScore >= 70;
  const isSuspicious = currentThreatScore >= 35 && currentThreatScore < 70;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 shadow-xl transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl transition-all duration-300 ${
            isCritical
              ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/50 animate-pulse'
              : isSuspicious
              ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
          }`}>
            {isCritical ? <ShieldAlert className="w-6 h-6 animate-bounce" /> : <Shield className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Parivaar Kavach
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> AI Acoustic Scam Shield
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-Time Phone Fraud Prevention & Family Remote Co-Pilot
            </p>
          </div>
        </div>

        {/* Mid-Bar Badges & Configuration */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Gemini API Key Bar */}
          <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all">
            <Key className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="Paste GEMINI_API_KEY (Optional)"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-48 lg:w-56"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-slate-400 hover:text-slate-200 ml-1.5 transition-colors"
              title={showKey ? 'Hide Key' : 'Show Key'}
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            {apiKey ? (
              <span className="ml-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Connected
              </span>
            ) : (
              <span className="ml-2 text-[10px] text-amber-400 font-semibold" title="Using built-in zero-latency acoustic intelligence engine">
                Demo Ready
              </span>
            )}
          </div>

          {/* Language Toggle for Elder Voice Warning */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1">
            <div className="flex items-center gap-1.5 px-2 text-xs text-slate-400 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Elder Warning:</span>
            </div>
            <button
              onClick={() => onLanguageChange('gu')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'gu'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              ગુજરાતી (Gujarati)
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'hi'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>

          {/* Saved Emergency Contact Badge */}
          <div className="flex items-center gap-2 bg-indigo-950/50 border border-indigo-800/50 rounded-lg px-3 py-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-left">
              <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                Emergency Guardian
              </div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                Son (Siddhant) • <span className="text-indigo-200 font-mono">+91 9876543210</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
