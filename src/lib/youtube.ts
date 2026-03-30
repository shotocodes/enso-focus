/**
 * YouTube IFrame API integration for high-quality ambient sounds.
 * Uses curated long-duration ambient videos (hidden player).
 * Falls back to Web Audio generated sounds when offline.
 */

import { AmbientSoundType } from "@/types";

// Curated YouTube video IDs - long ambient sounds (8-12 hours)
const AMBIENT_VIDEOS: Record<AmbientSoundType, string[]> = {
  thunder: [
    "nDq6TstdEI8",  // Thunder & Rain 10hrs
    "gVKEM4K8J8A",  // Thunderstorm ambience
  ],
  fire: [
    "UgHKb_7884o",  // Fireplace 10hrs crackling
    "L_LUpnjgPso",  // Cozy fireplace
  ],
  whitenoise: [
    "nMfPqeZjc2c",  // White noise 10hrs
    "wzjWIxXBs_s",  // Pure white noise
  ],
  birds: [
    "rYoZgpAEkFs",  // Bird sounds morning 8hrs
    "XqGnfnbJsLY",  // Forest birds singing
  ],
  waves: [
    "f77SKdyn-1Y",  // Ocean waves 10hrs
    "WHPEKLQID4U",  // Calm sea waves
  ],
};

let player: YT.Player | null = null;
let apiReady = false;
let apiLoading = false;
let onReadyCallbacks: (() => void)[] = [];

// YouTube IFrame API types
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: typeof YT;
  }
}

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (apiReady && window.YT) {
      resolve();
      return;
    }

    onReadyCallbacks.push(resolve);

    if (apiLoading) return;
    apiLoading = true;

    // Set global callback
    window.onYouTubeIframeAPIReady = () => {
      apiReady = true;
      onReadyCallbacks.forEach((cb) => cb());
      onReadyCallbacks = [];
    };

    // Load script
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
}

function getRandomVideoId(type: AmbientSoundType): string {
  const videos = AMBIENT_VIDEOS[type];
  return videos[Math.floor(Math.random() * videos.length)];
}

export async function startYouTubeAmbient(type: AmbientSoundType, volume: number): Promise<boolean> {
  try {
    await loadYouTubeAPI();

    if (!window.YT?.Player) return false;

    // Create hidden container if not exists
    let container = document.getElementById("yt-ambient-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "yt-ambient-container";
      container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;";
      document.body.appendChild(container);
    }

    // Destroy existing player
    if (player) {
      try { player.destroy(); } catch { /* ignore */ }
      player = null;
    }

    // Create player div
    let playerDiv = document.getElementById("yt-ambient-player");
    if (playerDiv) playerDiv.remove();
    playerDiv = document.createElement("div");
    playerDiv.id = "yt-ambient-player";
    container.appendChild(playerDiv);

    const videoId = getRandomVideoId(type);

    return new Promise((resolve) => {
      player = new window.YT!.Player("yt-ambient-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            event.target.setVolume(Math.round(volume * 100));
            event.target.playVideo();
            resolve(true);
          },
          onError: () => {
            resolve(false);
          },
        },
      });

      // Timeout fallback
      setTimeout(() => resolve(false), 8000);
    });
  } catch {
    return false;
  }
}

export function stopYouTubeAmbient(): void {
  if (player) {
    try {
      player.stopVideo();
      player.destroy();
    } catch { /* ignore */ }
    player = null;
  }
}

export function setYouTubeVolume(volume: number): void {
  if (player) {
    try {
      player.setVolume(Math.round(Math.max(0, Math.min(1, volume)) * 100));
    } catch { /* ignore */ }
  }
}

export function isYouTubeAvailable(): boolean {
  return typeof window !== "undefined" && navigator.onLine;
}
