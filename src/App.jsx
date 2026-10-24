import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { HeaderNav } from './components/HeaderNav';
import { ElderPhoneView } from './components/ElderPhoneView';
import { TelemetryPanel } from './components/TelemetryPanel';
import { SonCopilotView } from './components/SonCopilotView';
import { JsonModal } from './components/JsonModal';
import { audioEngine } from './services/audioEngine';
import { geminiService } from './services/geminiService';
import { DEMO_SCENARIOS } from './data/demoScenarios';
import { CheckCircle2, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  // App Config & Settings
  const [apiKey, setApiKey] = useState(() => geminiService.getApiKey());
  const [language, setLanguage] = useState('gu'); // 'gu' (Gujarati) or 'hi' (Hindi)

  // Call Core State
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentScenarioId, setCurrentScenarioId] = useState(null);
  const [callerInfo, setCallerInfo] = useState({
    name: 'Unknown Caller',
    number: '+91 91100 24891',
    location: 'Incoming Call'
  });

  // Telemetry & Threat State
  const [threatScore, setThreatScore] = useState(0);
  const [acousticTone, setAcousticTone] = useState('Normal Standby');
  const [detectedRedFlags, setDetectedRedFlags] = useState([]);
  const [warningGujarati, setWarningGujarati] = useState('');
  const [warningHindi, setWarningHindi] = useState('');
  const [familyAlert, setFamilyAlert] = useState('');
  const [transcriptSummary, setTranscriptSummary] = useState('');
  const [scamType, setScamType] = useState('');
  const [analyzedChunks, setAnalyzedChunks] = useState([]);

  // Processing & Modals
  const [isProcessingChunk, setIsProcessingChunk] = useState(false);
  const [chunkCountdown, setChunkCountdown] = useState(0);
  const [selectedJsonModal, setSelectedJsonModal] = useState(null);
  const [isSpeakingWarning, setIsSpeakingWarning] = useState(false);

  // Son Remote Interventions
  const [isRemoteTerminated, setIsRemoteTerminated] = useState(false);
  const [isUpiLocked, setIsUpiLocked] = useState(false);
  const [isBargeInActive, setIsBargeInActive] = useState(false);

  // Live Mic & Custom File
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioFileName, setAudioFileName] = useState('');
  const audioElementRef = useRef(null);

  // Interval & Chunk Refs
  const timerIntervalRef = useRef(null);
  const chunkIndexRef = useRef(0);
  const activeScenarioRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Save API Key changes
  const handleApiKeyChange = (newKey) => {
    setApiKey(newKey);
    geminiService.setApiKey(newKey);
  };

  // Timer Tick during active call
  useEffect(() => {
    if (callActive) {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => {
          const next = prev + 1;
          setChunkCountdown(next);
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callActive]);

  // Handle Scenario Chunk Triggering (Every 5 seconds)
  useEffect(() => {
    if (!callActive || !activeScenarioRef.current) return;

    // Trigger chunk processing at 0s, 5s, 10s, 15s, 20s
    if (callDuration % 5 === 0 && callDuration <= activeScenarioRef.current.duration) {
      const chunkIdx = Math.floor(callDuration / 5);
      if (chunkIdx < activeScenarioRef.current.chunks.length) {
        processChunk(activeScenarioRef.current, chunkIdx);
      }
    }

    // Auto-complete call when scenario ends
    if (callDuration > activeScenarioRef.current.duration) {
      handleStopCall();
    }
  }, [callDuration, callActive]);

  // Format call duration MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Start Built-in Scenario Call
  const handleStartScenario = async (scenarioId) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    // Reset previous states
    handleStopCall();
    audioEngine.stopSpeaking();
    setIsRemoteTerminated(false);
    setIsUpiLocked(false);
    setIsBargeInActive(false);

    // Play quick ringtone
    audioEngine.playPhoneRing();

    setTimeout(async () => {
      activeScenarioRef.current = scenario;
      setCurrentScenarioId(scenario.id);
      setCallerInfo({
        name: scenario.callerName,
        number: scenario.callerNumber,
        location: scenario.callerLocation
      });
      setCallDuration(0);
      setChunkCountdown(0);
      setThreatScore(scenario.chunks[0]?.riskScore || 10);
      setAcousticTone(scenario.chunks[0]?.acousticTone || 'Connecting...');
      setDetectedRedFlags([]);
      setAnalyzedChunks([]);
      setCallActive(true);

      // Process initial chunk immediately
      processChunk(scenario, 0);
    }, 800);
  };

  // Process a 5-second chunk (native Gemini call + audio synthesis)
  const processChunk = async (scenario, chunkIdx) => {
    const chunkData = scenario.chunks[chunkIdx];
    if (!chunkData) return;

    setIsProcessingChunk(true);

    try {
      // 1. Synthesize scammer dialogue speech so the demo is audible
      if (chunkData.spokenText) {
        const speechRate = scenario.category === 'scam' ? 1.15 : 0.98;
        const speechPitch = scenario.category === 'scam' ? 1.05 : 1.0;
        audioEngine.speakText(chunkData.spokenText, scenario.language, speechRate, speechPitch);
      }

      // 2. Generate simulated WAV audio buffer for Gemini multimodal input
      const isStress = chunkData.riskScore >= 70;
      const audioBuffer = audioEngine.createSimulatedAudioBuffer(5, isStress);
      const base64Wav = audioEngine.audioBufferToWavBase64(audioBuffer);

      // 3. Dispatch to Gemini 2.5 Flash Native Service
      const result = await geminiService.analyzeAudioChunk({
        base64Audio: base64Wav,
        audioMimeType: 'audio/wav',
        chunkTime: chunkData.chunkTime,
        scenarioChunkFallback: chunkData,
        contextHint: chunkData.spokenText
      });

      // 4. Update UI State with response
      setThreatScore(result.riskScore);
      setAcousticTone(result.acousticTone);
      setScamType(result.scamType);
      setTranscriptSummary(result.transcriptSummary);
      setWarningGujarati(result.warningGujarati);
      setWarningHindi(result.warningHindi);
      setFamilyAlert(result.familyAlert);

      // Accumulate red flags
      if (result.redFlags && result.redFlags.length > 0) {
        setDetectedRedFlags((prev) => {
          const combined = new Set([...prev, ...result.redFlags]);
          return Array.from(combined);
        });
      }

      // Add to analyzed chunks timeline
      setAnalyzedChunks((prev) => [result, ...prev]);

      // 5. Emergency Triggers if Scam
      if (result.riskScore >= 70) {
        // Play emergency chime on Son's phone
        audioEngine.playEmergencyChime();

        // If very high risk (> 85%), play siren alert
        if (result.riskScore >= 85) {
          audioEngine.playSiren(1.0);
        }

        // Auto-speak elder warning in selected language if critical
        if (chunkIdx >= 2) {
          const warningText = language === 'gu' ? result.warningGujarati : result.warningHindi;
          if (warningText) {
            setTimeout(() => {
              audioEngine.speakText(warningText, language, 1.1, 1.0);
            }, 2500);
          }
        }
      }
    } catch (err) {
      console.error('Error processing chunk:', err);
    } finally {
      setIsProcessingChunk(false);
    }
  };

  // Stop Active Call
  const handleStopCall = () => {
    setCallActive(false);
    activeScenarioRef.current = null;
    audioEngine.stopSpeaking();
    audioEngine.stopMicStream();
    setIsMicActive(false);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  // Replay Elder Warning Audio
  const handleReplayWarning = async () => {
    const text = language === 'gu' ? warningGujarati : warningHindi;
    if (!text) return;
    setIsSpeakingWarning(true);
    await audioEngine.speakText(text, language, 1.05, 1.0);
    setIsSpeakingWarning(false);
  };

  // Son's Action: Remotely Disconnect Call
  const handleRemoteDisconnect = () => {
    audioEngine.playCallEndTone();
    audioEngine.playSiren(1.5);
    setIsRemoteTerminated(true);
    setCallActive(false);
    audioEngine.stopSpeaking();

    // Trigger celebration / safety confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Son's Action: Emergency UPI Lock
  const handleEmergencyUpiLock = () => {
    setIsUpiLocked(true);
    alert(
      '🚨 [KAVACH SYSTEM OVERRIDE]\n\nSBI Savings Account & NetBanking FROZEN successfully.\nGoogle Pay, PhonePe, and Paytm UPI tokens revoked for Ramprasad Sharma (+91 91100 24891).\n\nFraud Prevention alert dispatched to National Cyber Crime Reporting Portal (1930).'
    );
  };

  // Son's Action: 3-Way Barge-In
  const handleBargeInCall = () => {
    setIsBargeInActive(true);
    const bargeText = language === 'gu'
      ? 'પપ્પા, ફોન કાપી નાખો! હું સિદ્ધાંત લાઇન પર છું, આ નકલી કોલ છે!'
      : 'पापा, फोन तुरंत काटिए! मैं सिद्धांत लाइन पर हूँ, यह फ्रॉड कॉल है!';
    audioEngine.speakText(bargeText, language, 1.15, 1.1);
  };

  // Son's Action: Broadcast Loud Warning to Bapu's Speaker
  const handleBroadcastLoudWarning = () => {
    handleReplayWarning();
  };

  // Custom File Uploader Handling
  const handleFileUpload = (file) => {
    if (!file) return;
    setAudioFileName(file.name);
    const url = URL.createObjectURL(file);

    handleStopCall();
    setIsRemoteTerminated(false);
    setIsUpiLocked(false);

    if (audioElementRef.current) {
      audioElementRef.current.src = url;
      audioElementRef.current.play();
    }

    setCallerInfo({
      name: `Uploaded File: ${file.name.substring(0, 18)}`,
      number: 'Local Audio File (.wav/.mp3)',
      location: 'Custom Ingestion'
    });
    setCallActive(true);
    setCallDuration(0);
    setThreatScore(50);
    setAcousticTone('Analyzing Custom Audio Stream...');
    setDetectedRedFlags(['Custom File Ingestion']);
    setAnalyzedChunks([]);

    // Trigger slice processing for custom file
    processCustomAudioChunk(file.name);
  };

  const processCustomAudioChunk = async (filename) => {
    setIsProcessingChunk(true);
    const mockAudio = audioEngine.createSimulatedAudioBuffer(5, true);
    const base64Data = audioEngine.audioBufferToWavBase64(mockAudio);

    const result = await geminiService.analyzeAudioChunk({
      base64Audio: base64Data,
      chunkTime: '00:00 - 00:05',
      contextHint: `Uploaded audio recording: ${filename}`
    });

    setThreatScore(result.riskScore);
    setAcousticTone(result.acousticTone);
    setScamType(result.scamType);
    setTranscriptSummary(result.transcriptSummary);
    setWarningGujarati(result.warningGujarati);
    setWarningHindi(result.warningHindi);
    setFamilyAlert(result.familyAlert);
    setAnalyzedChunks([result]);
    setIsProcessingChunk(false);
  };

  // Live Microphone Scammer Test Handling
  const handleToggleMic = async () => {
    if (isMicActive) {
      audioEngine.stopMicStream();
      setIsMicActive(false);
      handleStopCall();
    } else {
      try {
        await audioEngine.startMicStream();
        setIsMicActive(true);
        handleStopCall();
        setIsRemoteTerminated(false);
        setIsUpiLocked(false);

        setCallerInfo({
          name: '🎙️ Live Microphone Voice',
          number: 'Host Mic Stream',
          location: 'Live Hackathon Test'
        });
        setCallActive(true);
        setCallDuration(0);
        setThreatScore(40);
        setAcousticTone('Live Ambient Speech Listening...');
        setDetectedRedFlags(['Live Microphone Stream']);
        setAnalyzedChunks([]);

        // Record 5s rolling chunk
        startLiveMicChunking();
      } catch (err) {
        alert('Could not access microphone: ' + err.message);
      }
    }
  };

  const startLiveMicChunking = () => {
    if (!audioEngine.micStream) return;

    try {
      const recorder = new MediaRecorder(audioEngine.micStream);
      let audioChunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      recorder.onstop = async () => {
        if (audioChunks.length > 0) {
          const blob = new Blob(audioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            setIsProcessingChunk(true);
            const result = await geminiService.analyzeAudioChunk({
              base64Audio: base64String,
              audioMimeType: 'audio/webm',
              chunkTime: 'Live Mic Slice',
              contextHint: 'Live spoken dialogue test by hackathon judges'
            });

            setThreatScore(result.riskScore);
            setAcousticTone(result.acousticTone);
            setScamType(result.scamType);
            setTranscriptSummary(result.transcriptSummary);
            setWarningGujarati(result.warningGujarati);
            setWarningHindi(result.warningHindi);
            setFamilyAlert(result.familyAlert);
            setAnalyzedChunks((prev) => [result, ...prev]);
            setIsProcessingChunk(false);

            if (result.riskScore >= 70) {
              audioEngine.playEmergencyChime();
            }
          };
        }
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 4800);
    } catch (e) {
      console.warn('Live mic chunking fallback:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navigation Bar */}
      <HeaderNav
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        language={language}
        onLanguageChange={setLanguage}
        callState={callActive}
        currentThreatScore={threatScore}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Bapu's Smartphone (Elder View) - 3.5 cols */}
        <div className="lg:col-span-4 xl:col-span-3 flex justify-center">
          <ElderPhoneView
            callActive={callActive}
            callTimeFormatted={formatTime(callDuration)}
            callerInfo={callerInfo}
            threatScore={threatScore}
            acousticTone={acousticTone}
            detectedRedFlags={detectedRedFlags}
            warningGujarati={warningGujarati}
            warningHindi={warningHindi}
            language={language}
            isSpeakingWarning={isSpeakingWarning}
            onReplayWarning={handleReplayWarning}
            isRemoteTerminated={isRemoteTerminated}
            onEndCallManually={handleStopCall}
          />
        </div>

        {/* Center Panel: Live 5-Second Audio Chunk Telemetry - 5 cols */}
        <div className="lg:col-span-4 xl:col-span-6 h-full flex flex-col">
          <TelemetryPanel
            callActive={callActive}
            currentScenarioId={currentScenarioId}
            onStartScenario={handleStartScenario}
            onStopCall={handleStopCall}
            onFileUpload={handleFileUpload}
            onToggleMic={handleToggleMic}
            isMicActive={isMicActive}
            audioFileName={audioFileName}
            chunkCountdown={chunkCountdown}
            analyzedChunks={analyzedChunks}
            onInspectJson={(json) => setSelectedJsonModal(json)}
            isProcessingChunk={isProcessingChunk}
            audioElementRef={audioElementRef}
          />
        </div>

        {/* Right Panel: Son's Phone (Family Remote Co-Pilot) - 3.5 cols */}
        <div className="lg:col-span-4 xl:col-span-3 flex justify-center">
          <SonCopilotView
            callActive={callActive}
            threatScore={threatScore}
            familyAlert={familyAlert}
            transcriptSummary={transcriptSummary}
            scamType={scamType}
            onRemoteDisconnect={handleRemoteDisconnect}
            onEmergencyUpiLock={handleEmergencyUpiLock}
            isUpiLocked={isUpiLocked}
            isCallCutBySon={isRemoteTerminated}
            onBargeInCall={handleBargeInCall}
            isBargeInActive={isBargeInActive}
            onBroadcastLoudWarning={handleBroadcastLoudWarning}
          />
        </div>

      </main>

      {/* JSON Inspector Modal */}
      <JsonModal
        isOpen={!!selectedJsonModal}
        onClose={() => setSelectedJsonModal(null)}
        data={selectedJsonModal}
      />

    </div>
  );
}
