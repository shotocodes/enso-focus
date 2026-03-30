import { AmbientSoundType } from "@/types";
import { startYouTubeAmbient, stopYouTubeAmbient, setYouTubeVolume, isYouTubeAvailable } from "./youtube";

let ctx: AudioContext | null = null;
let usingYouTube = false;
let masterGain: GainNode | null = null;
let activeNodes: AudioNode[] = [];
let activeIntervals: ReturnType<typeof setInterval>[] = [];

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.value = 0.3;
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function createNoiseBuffer(audioCtx: AudioContext, seconds: number = 2): AudioBuffer {
  const sr = audioCtx.sampleRate;
  const buf = audioCtx.createBuffer(1, sr * seconds, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function noiseSource(audioCtx: AudioContext): AudioBufferSourceNode {
  const src = audioCtx.createBufferSource();
  src.buffer = createNoiseBuffer(audioCtx);
  src.loop = true;
  return src;
}

function track(node: AudioNode): AudioNode {
  activeNodes.push(node);
  return node;
}

function startThunder(audioCtx: AudioContext, gain: GainNode) {
  // Heavy rain base
  const src = noiseSource(audioCtx);
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2500;
  bp.Q.value = 0.4;
  const rainVol = audioCtx.createGain();
  rainVol.gain.value = 0.7;
  src.connect(bp);
  bp.connect(rainVol);
  rainVol.connect(gain);
  src.start();
  track(src);

  // Rain drips
  const dripIv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 2000 + Math.random() * 2000;
    env.gain.setValueAtTime(0.015, audioCtx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(env);
    env.connect(gain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  }, 150 + Math.random() * 250);
  activeIntervals.push(dripIv);

  // Thunder rumble - low frequency burst every 8-20 seconds
  const thunderIv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const thunder = noiseSource(audioCtx);
    const lp = audioCtx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 150 + Math.random() * 100;
    const env = audioCtx.createGain();
    const start = audioCtx.currentTime;
    env.gain.setValueAtTime(0.001, start);
    env.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.08, start + 0.3);
    env.gain.exponentialRampToValueAtTime(0.001, start + 1.5 + Math.random() * 1.5);
    thunder.connect(lp);
    lp.connect(env);
    env.connect(gain);
    thunder.start();
    thunder.stop(start + 3);
  }, 8000 + Math.random() * 12000);
  activeIntervals.push(thunderIv);
}

function startFire(audioCtx: AudioContext, gain: GainNode) {
  const src = noiseSource(audioCtx);
  const lp = audioCtx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 400;
  src.connect(lp);
  lp.connect(gain);
  src.start();
  track(src);

  const iv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const crackle = noiseSource(audioCtx);
    const bp = audioCtx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3000;
    bp.Q.value = 2;
    const env = audioCtx.createGain();
    env.gain.setValueAtTime(0.04, audioCtx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);
    crackle.connect(bp);
    bp.connect(env);
    env.connect(gain);
    crackle.start();
    crackle.stop(audioCtx.currentTime + 0.02);
  }, 300 + Math.random() * 500);
  activeIntervals.push(iv);
}

function startWhiteNoise(audioCtx: AudioContext, gain: GainNode) {
  const src = noiseSource(audioCtx);
  const vol = audioCtx.createGain();
  vol.gain.value = 0.6;
  src.connect(vol);
  vol.connect(gain);
  src.start();
  track(src);
}

function startBirds(audioCtx: AudioContext, gain: GainNode) {
  // Very soft wind bed
  const src = noiseSource(audioCtx);
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 600;
  bp.Q.value = 0.2;
  const vol = audioCtx.createGain();
  vol.gain.value = 0.15;
  src.connect(bp);
  bp.connect(vol);
  vol.connect(gain);
  src.start();
  track(src);

  // Bird song patterns - multiple species
  const patterns = [
    { freqs: [2400, 2800, 2400], dur: 0.06, gap: 0.07, vol: 0.04 },  // Quick chirp
    { freqs: [1800, 2200, 2600, 2200], dur: 0.1, gap: 0.08, vol: 0.03 },  // Warble
    { freqs: [3200, 3000], dur: 0.08, gap: 0.12, vol: 0.025 },  // Tweet
    { freqs: [1600, 2000, 1800, 2200, 2000], dur: 0.07, gap: 0.06, vol: 0.035 },  // Trill
  ];

  const iv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const baseTime = audioCtx.currentTime;

    pattern.freqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq + (Math.random() - 0.5) * 200;
      const start = baseTime + i * (pattern.dur + pattern.gap);
      env.gain.setValueAtTime(pattern.vol, start);
      env.gain.exponentialRampToValueAtTime(0.001, start + pattern.dur);
      osc.connect(env);
      env.connect(gain);
      osc.start(start);
      osc.stop(start + pattern.dur + 0.01);
    });
  }, 1500 + Math.random() * 3000);
  activeIntervals.push(iv);

  // Distant cuckoo-like call
  const cuckooIv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const notes = [1200, 900];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = audioCtx.currentTime + i * 0.35;
      env.gain.setValueAtTime(0.02, start);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(env);
      env.connect(gain);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  }, 6000 + Math.random() * 8000);
  activeIntervals.push(cuckooIv);
}

function startWaves(audioCtx: AudioContext, gain: GainNode) {
  const src = noiseSource(audioCtx);
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 500;
  bp.Q.value = 0.3;

  // LFO for rising/falling
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0;
  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.1;
  lfo.connect(lfoGain.gain);
  lfo.start();
  track(lfo);

  src.connect(bp);
  bp.connect(lfoGain);
  lfoGain.connect(gain);
  src.start();
  track(src);
}

function startBreakSound(audioCtx: AudioContext, gain: GainNode) {
  const notes = [523, 659, 784, 880];
  let idx = 0;
  const iv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = notes[idx % notes.length];
    env.gain.setValueAtTime(0.06, audioCtx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc.connect(env);
    env.connect(gain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
    idx++;
  }, 600);
  activeIntervals.push(iv);
}

function startGeneratedFallback(type: AmbientSoundType | "break", volume: number) {
  const audioCtx = getCtx();
  if (!audioCtx || !masterGain) return;
  masterGain.gain.value = Math.max(0, Math.min(1, volume));

  switch (type) {
    case "thunder": startThunder(audioCtx, masterGain); break;
    case "fire": startFire(audioCtx, masterGain); break;
    case "whitenoise": startWhiteNoise(audioCtx, masterGain); break;
    case "birds": startBirds(audioCtx, masterGain); break;
    case "waves": startWaves(audioCtx, masterGain); break;
    case "break": startBreakSound(audioCtx, masterGain); break;
  }
}

// Track current request to avoid race conditions
let currentRequestId = 0;

export async function startAmbient(type: AmbientSoundType | "break", volume: number): Promise<void> {
  stopAmbient();
  const requestId = ++currentRequestId;

  // Break sound is always generated
  if (type === "break") {
    startGeneratedFallback(type, volume);
    return;
  }

  // Step 1: Immediately play Web Audio generated sound (instant feedback)
  startGeneratedFallback(type, volume);

  // Step 2: Load YouTube in background, swap when ready
  if (isYouTubeAvailable()) {
    try {
      const success = await startYouTubeAmbient(type, volume);
      // Check if still the same request (user didn't switch again)
      if (success && currentRequestId === requestId) {
        // YouTube ready — stop Web Audio, use YouTube
        stopWebAudioNodes();
        usingYouTube = true;
      }
    } catch {
      // Keep using Web Audio — already playing
    }
  }
}

function stopWebAudioNodes(): void {
  for (const iv of activeIntervals) clearInterval(iv);
  activeIntervals = [];
  for (const node of activeNodes) {
    try {
      if ("stop" in node && typeof (node as AudioBufferSourceNode).stop === "function") {
        (node as AudioBufferSourceNode).stop();
      }
      node.disconnect();
    } catch { /* already stopped */ }
  }
  activeNodes = [];
}

export function stopAmbient(): void {
  currentRequestId++;
  // Stop YouTube
  if (usingYouTube) {
    stopYouTubeAmbient();
    usingYouTube = false;
  }
  // Stop Web Audio
  stopWebAudioNodes();
}

export function setAmbientVolume(volume: number): void {
  const v = Math.max(0, Math.min(1, volume));
  if (usingYouTube) {
    setYouTubeVolume(v);
  }
  if (masterGain) {
    masterGain.gain.value = v;
  }
}
