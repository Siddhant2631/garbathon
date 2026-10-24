/**
 * Web Audio Engine & Synthesizer for Parivaar Kavach
 * Handles AudioContext, AnalyserNode for waveforms, sound effects,
 * WAV base64 encoding for Gemini, and Web Speech Synthesis.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.micStream = null;
    this.mediaRecorder = null;
    this.isMicActive = false;
    this.isSpeaking = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  getFrequencyData() {
    if (!this.analyser) {
      return new Uint8Array(32).fill(10);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // Play realistic Indian phone ringtone (400Hz + 450Hz modulation)
  playPhoneRing() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(400, now);
      osc2.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.setValueAtTime(0.12, now + 0.8);
      gain.gain.linearRampToValueAtTime(0, now + 0.9);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.0);
      osc2.stop(now + 1.0);
    } catch (e) {
      console.warn('Ring audio error:', e);
    }
  }

  // Play emergency alert chime on Son's phone
  playEmergencyChime() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Emergency chime error:', e);
    }
  }

  // Play siren sound when call risk > 80%
  playSiren(durationSeconds = 1.2) {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(950, now + durationSeconds * 0.5);
      osc.frequency.linearRampToValueAtTime(600, now + durationSeconds);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

      osc.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + durationSeconds);
    } catch (e) {
      console.warn('Siren audio error:', e);
    }
  }

  // Call disconnected tone (3 short beeps)
  playCallEndTone() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + i * 0.18;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.12);
      }
    } catch (e) {
      console.warn('Call end tone error:', e);
    }
  }

  // Synthesize Scammer or Warning speech using Web Speech API
  speakText(text, lang = 'hi', rate = 1.05, pitch = 1.0) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Select matching voice
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;

      if (lang === 'gu') {
        selectedVoice = voices.find(v => v.lang.includes('gu') || v.lang.includes('GU'));
      }
      if (!selectedVoice && (lang === 'hi' || lang === 'gu')) {
        selectedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi-IN'));
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  // Start live microphone stream for judge tests
  async startMicStream() {
    this.init();
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const micSource = this.ctx.createMediaStreamSource(this.micStream);
      micSource.connect(this.analyser);
      this.isMicActive = true;
      return this.micStream;
    } catch (err) {
      console.error('Microphone access denied:', err);
      throw err;
    }
  }

  stopMicStream() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    this.isMicActive = false;
  }

  // Convert an AudioBuffer to standard 16-bit PCM WAV base64 string
  audioBufferToWavBase64(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels = [];
    let sampleRate = buffer.sampleRate;
    let offset = 0;
    let pos = 0;

    function setUint16(data) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // RIFF chunk descriptor
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // FMT sub-chunk
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // subchunk1size (16 for PCM)
    setUint16(1); // audio format (1 = PCM)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample

    // data sub-chunk
    setUint32(0x61746164); // "data" chunk
    setUint32(length - pos - 4); // chunk length

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    // Convert ArrayBuffer to Base64
    let binary = '';
    const bytes = new Uint8Array(out.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Generate synthetic 5-second acoustic wave buffer for simulation
  createSimulatedAudioBuffer(durationSec = 5, isHighStress = false) {
    this.init();
    const sampleRate = 16000;
    const frameCount = sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    const baseFreq = isHighStress ? 280 : 160;
    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const pitchMod = isHighStress ? Math.sin(t * 12) * 40 : Math.sin(t * 3) * 10;
      const noise = (Math.random() - 0.5) * (isHighStress ? 0.08 : 0.02);
      const voice = Math.sin(2 * Math.PI * (baseFreq + pitchMod) * t);
      const envelope = Math.sin((t / durationSec) * Math.PI);
      data[i] = (voice * 0.4 + noise) * envelope;
    }
    return buffer;
  }
}

export const audioEngine = new AudioEngine();
