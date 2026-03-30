import { AmbientSoundType } from "@/types";
import { getFreesoundUrl, isFreesoundAvailable } from "./freesound";

let ctx: AudioContext | null = null;
let freesoundAudio: HTMLAudioElement | null = null;
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

function startRain(audioCtx: AudioContext, gain: GainNode) {
  // Filtered noise base
  const src = noiseSource(audioCtx);
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3000;
  bp.Q.value = 0.5;
  src.connect(bp);
  bp.connect(gain);
  src.start();
  track(src);

  // Random drips
  const iv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 2000 + Math.random() * 2000;
    env.gain.setValueAtTime(0.02, audioCtx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(env);
    env.connect(gain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  }, 200 + Math.random() * 300);
  activeIntervals.push(iv);
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

function startForest(audioCtx: AudioContext, gain: GainNode) {
  // Wind through leaves - gentle filtered noise
  const src = noiseSource(audioCtx);
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 800;
  bp.Q.value = 0.3;
  const vol = audioCtx.createGain();
  vol.gain.value = 0.4;
  src.connect(bp);
  bp.connect(vol);
  vol.connect(gain);
  src.start();
  track(src);

  // Rustling leaves - LFO modulated noise
  const rustleSrc = noiseSource(audioCtx);
  const rustleBp = audioCtx.createBiquadFilter();
  rustleBp.type = "highpass";
  rustleBp.frequency.value = 2000;
  const rustleGain = audioCtx.createGain();
  rustleGain.gain.value = 0;
  const rustleLfo = audioCtx.createOscillator();
  rustleLfo.type = "sine";
  rustleLfo.frequency.value = 0.3;
  rustleLfo.connect(rustleGain.gain);
  rustleLfo.start();
  track(rustleLfo);
  rustleSrc.connect(rustleBp);
  rustleBp.connect(rustleGain);
  rustleGain.connect(gain);
  rustleSrc.start();
  track(rustleSrc);

  // Distant bird calls
  const birdNotes = [1800, 2200, 2600, 2000, 1600];
  const iv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const noteIdx = Math.floor(Math.random() * birdNotes.length);
    const freq = birdNotes[noteIdx] + Math.random() * 200;

    // Two-tone chirp
    for (let i = 0; i < 2; i++) {
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq + i * 300;
      const start = audioCtx.currentTime + i * 0.08;
      env.gain.setValueAtTime(0.025, start);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
      osc.connect(env);
      env.connect(gain);
      osc.start(start);
      osc.stop(start + 0.1);
    }
  }, 3000 + Math.random() * 4000);
  activeIntervals.push(iv);
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

function startFreesoundPlayback(url: string, volume: number) {
  freesoundAudio = new Audio(url);
  freesoundAudio.loop = true;
  freesoundAudio.volume = Math.max(0, Math.min(1, volume));
  freesoundAudio.play().catch(() => {});
}

function startGeneratedFallback(type: AmbientSoundType | "break", volume: number) {
  const audioCtx = getCtx();
  if (!audioCtx || !masterGain) return;
  masterGain.gain.value = Math.max(0, Math.min(1, volume));

  switch (type) {
    case "rain": startRain(audioCtx, masterGain); break;
    case "fire": startFire(audioCtx, masterGain); break;
    case "whitenoise": startWhiteNoise(audioCtx, masterGain); break;
    case "forest": startForest(audioCtx, masterGain); break;
    case "waves": startWaves(audioCtx, masterGain); break;
    case "break": startBreakSound(audioCtx, masterGain); break;
  }
}

export async function startAmbient(type: AmbientSoundType | "break", volume: number): Promise<void> {
  stopAmbient();

  // Break sound is always generated
  if (type === "break") {
    startGeneratedFallback(type, volume);
    return;
  }

  // Try freesound API first
  if (isFreesoundAvailable()) {
    try {
      const url = await getFreesoundUrl(type);
      if (url) {
        startFreesoundPlayback(url, volume);
        return;
      }
    } catch {
      // Fall through to generated sound
    }
  }

  // Fallback to Web Audio generated sounds
  startGeneratedFallback(type, volume);
}

export function stopAmbient(): void {
  // Stop freesound HTML audio
  if (freesoundAudio) {
    freesoundAudio.pause();
    freesoundAudio.src = "";
    freesoundAudio = null;
  }
  // Stop Web Audio nodes
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

export function setAmbientVolume(volume: number): void {
  const v = Math.max(0, Math.min(1, volume));
  if (freesoundAudio) {
    freesoundAudio.volume = v;
  }
  if (masterGain) {
    masterGain.gain.value = v;
  }
}
