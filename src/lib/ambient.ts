import { AmbientSoundType } from "@/types";

let ctx: AudioContext | null = null;
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

function startCafe(audioCtx: AudioContext, gain: GainNode) {
  const src = noiseSource(audioCtx);
  const lp = audioCtx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 300;
  const vol = audioCtx.createGain();
  vol.gain.value = 0.8;
  src.connect(lp);
  lp.connect(vol);
  vol.connect(gain);
  src.start();
  track(src);

  const iv = setInterval(() => {
    if (!ctx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 2000 + Math.random() * 1500;
    env.gain.setValueAtTime(0.015, audioCtx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(env);
    env.connect(gain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  }, 2000 + Math.random() * 3000);
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

export function startAmbient(type: AmbientSoundType | "break", volume: number): void {
  stopAmbient();
  const audioCtx = getCtx();
  if (!audioCtx || !masterGain) return;
  masterGain.gain.value = Math.max(0, Math.min(1, volume));

  switch (type) {
    case "rain": startRain(audioCtx, masterGain); break;
    case "fire": startFire(audioCtx, masterGain); break;
    case "whitenoise": startWhiteNoise(audioCtx, masterGain); break;
    case "cafe": startCafe(audioCtx, masterGain); break;
    case "waves": startWaves(audioCtx, masterGain); break;
    case "break": startBreakSound(audioCtx, masterGain); break;
  }
}

export function stopAmbient(): void {
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
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
}
