import { AmbientSoundType } from "@/types";

// --- Static MP3 playback (primary) ---
const SOUND_FILES: Record<AmbientSoundType, string> = {
  thunder: "/sounds/thunder.mp3",
  fire: "/sounds/fire.mp3",
  cafe: "/sounds/cafe.mp3",
  birds: "/sounds/birds.mp3",
  waves: "/sounds/waves.mp3",
};

let audioEl: HTMLAudioElement | null = null;
let usingStatic = false;

// --- Web Audio fallback ---
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeNodes: AudioNode[] = [];
let activeIntervals: ReturnType<typeof setInterval>[] = [];
let currentRequestId = 0;

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
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function noiseSource(audioCtx: AudioContext): AudioBufferSourceNode {
  const src = audioCtx.createBufferSource();
  src.buffer = createNoiseBuffer(audioCtx);
  src.loop = true;
  return src;
}

function track(node: AudioNode): AudioNode { activeNodes.push(node); return node; }

// --- Generated sound implementations (fallback) ---
function startThunder(c: AudioContext, g: GainNode) {
  const src = noiseSource(c); const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2500; bp.Q.value = 0.4;
  const vol = c.createGain(); vol.gain.value = 0.7; src.connect(bp); bp.connect(vol); vol.connect(g); src.start(); track(src);
  activeIntervals.push(setInterval(() => { if (!ctx || !masterGain) return;
    const o = c.createOscillator(); const e = c.createGain(); o.type = "sine"; o.frequency.value = 2000 + Math.random() * 2000;
    e.gain.setValueAtTime(0.015, c.currentTime); e.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.03);
    o.connect(e); e.connect(g); o.start(); o.stop(c.currentTime + 0.03);
  }, 150 + Math.random() * 250));
  activeIntervals.push(setInterval(() => { if (!ctx || !masterGain) return;
    const t = noiseSource(c); const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 150 + Math.random() * 100;
    const e = c.createGain(); const s = c.currentTime; e.gain.setValueAtTime(0.001, s); e.gain.linearRampToValueAtTime(0.12, s + 0.3);
    e.gain.exponentialRampToValueAtTime(0.001, s + 2); t.connect(lp); lp.connect(e); e.connect(g); t.start(); t.stop(s + 3);
  }, 8000 + Math.random() * 12000));
}

function startFire(c: AudioContext, g: GainNode) {
  const src = noiseSource(c); const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 400;
  src.connect(lp); lp.connect(g); src.start(); track(src);
  activeIntervals.push(setInterval(() => { if (!ctx || !masterGain) return;
    const cr = noiseSource(c); const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 3000; bp.Q.value = 2;
    const e = c.createGain(); e.gain.setValueAtTime(0.04, c.currentTime); e.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.02);
    cr.connect(bp); bp.connect(e); e.connect(g); cr.start(); cr.stop(c.currentTime + 0.02);
  }, 300 + Math.random() * 500));
}

function startWhiteNoise(c: AudioContext, g: GainNode) {
  const src = noiseSource(c); const v = c.createGain(); v.gain.value = 0.6; src.connect(v); v.connect(g); src.start(); track(src);
}

function startBirds(c: AudioContext, g: GainNode) {
  const src = noiseSource(c); const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 600; bp.Q.value = 0.2;
  const v = c.createGain(); v.gain.value = 0.15; src.connect(bp); bp.connect(v); v.connect(g); src.start(); track(src);
  const patterns = [
    { freqs: [2400, 2800, 2400], dur: 0.06, gap: 0.07, vol: 0.04 },
    { freqs: [1800, 2200, 2600, 2200], dur: 0.1, gap: 0.08, vol: 0.03 },
    { freqs: [3200, 3000], dur: 0.08, gap: 0.12, vol: 0.025 },
  ];
  activeIntervals.push(setInterval(() => { if (!ctx || !masterGain) return;
    const p = patterns[Math.floor(Math.random() * patterns.length)]; const bt = c.currentTime;
    p.freqs.forEach((f, i) => { const o = c.createOscillator(); const e = c.createGain(); o.type = "sine";
      o.frequency.value = f + (Math.random() - 0.5) * 200; const s = bt + i * (p.dur + p.gap);
      e.gain.setValueAtTime(p.vol, s); e.gain.exponentialRampToValueAtTime(0.001, s + p.dur);
      o.connect(e); e.connect(g); o.start(s); o.stop(s + p.dur + 0.01); });
  }, 1500 + Math.random() * 3000));
  activeIntervals.push(setInterval(() => { if (!ctx || !masterGain) return;
    [1200, 900].forEach((f, i) => { const o = c.createOscillator(); const e = c.createGain(); o.type = "sine"; o.frequency.value = f;
      const s = c.currentTime + i * 0.35; e.gain.setValueAtTime(0.02, s); e.gain.exponentialRampToValueAtTime(0.001, s + 0.25);
      o.connect(e); e.connect(g); o.start(s); o.stop(s + 0.25); });
  }, 6000 + Math.random() * 8000));
}

function startWaves(c: AudioContext, g: GainNode) {
  const src = noiseSource(c); const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 500; bp.Q.value = 0.3;
  const lg = c.createGain(); lg.gain.value = 0; const lfo = c.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.1;
  lfo.connect(lg.gain); lfo.start(); track(lfo); src.connect(bp); bp.connect(lg); lg.connect(g); src.start(); track(src);
}

function startBreakSound(c: AudioContext, g: GainNode) {
  const notes = [523, 659, 784, 880]; let idx = 0;
  activeIntervals.push(setInterval(() => { if (!ctx || !masterGain) return;
    const o = c.createOscillator(); const e = c.createGain(); o.type = "sine"; o.frequency.value = notes[idx % notes.length];
    e.gain.setValueAtTime(0.06, c.currentTime); e.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
    o.connect(e); e.connect(g); o.start(); o.stop(c.currentTime + 0.4); idx++;
  }, 600));
}

function startGeneratedFallback(type: AmbientSoundType | "break", volume: number) {
  const audioCtx = getCtx(); if (!audioCtx || !masterGain) return;
  masterGain.gain.value = Math.max(0, Math.min(1, volume));
  switch (type) {
    case "thunder": startThunder(audioCtx, masterGain); break;
    case "fire": startFire(audioCtx, masterGain); break;
    case "cafe": startWhiteNoise(audioCtx, masterGain); break;
    case "birds": startBirds(audioCtx, masterGain); break;
    case "waves": startWaves(audioCtx, masterGain); break;
    case "break": startBreakSound(audioCtx, masterGain); break;
  }
}

// --- Public API ---
export async function startAmbient(type: AmbientSoundType | "break", volume: number): Promise<void> {
  stopAmbient();
  const requestId = ++currentRequestId;

  if (type === "break") { startGeneratedFallback(type, volume); return; }

  // Try static MP3 first
  try {
    const audio = new Audio(SOUND_FILES[type]);
    audio.loop = true;
    audio.volume = Math.max(0, Math.min(1, volume));
    await audio.play();
    if (currentRequestId !== requestId) { audio.pause(); audio.src = ""; return; }
    audioEl = audio;
    usingStatic = true;
    return;
  } catch {
    // File not found or can't play — fall through
  }

  // Fallback to Web Audio generated
  if (currentRequestId === requestId) {
    usingStatic = false;
    startGeneratedFallback(type, volume);
  }
}

function stopWebAudioNodes(): void {
  for (const iv of activeIntervals) clearInterval(iv);
  activeIntervals = [];
  for (const node of activeNodes) {
    try { if ("stop" in node && typeof (node as AudioBufferSourceNode).stop === "function") (node as AudioBufferSourceNode).stop(); node.disconnect(); } catch { /* */ }
  }
  activeNodes = [];
}

export function stopAmbient(): void {
  currentRequestId++;
  if (audioEl) { audioEl.pause(); audioEl.src = ""; audioEl = null; usingStatic = false; }
  stopWebAudioNodes();
}

export function setAmbientVolume(volume: number): void {
  const v = Math.max(0, Math.min(1, volume));
  if (audioEl) audioEl.volume = v;
  if (masterGain) masterGain.gain.value = v;
}
