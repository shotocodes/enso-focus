/**
 * Freesound.org API integration for high-quality ambient sounds.
 * Falls back to Web Audio generated sounds when API key is not set or offline.
 *
 * To enable: Set NEXT_PUBLIC_FREESOUND_API_KEY in .env.local
 * Get a key at: https://freesound.org/apiv2/apply/
 */

import { AmbientSoundType } from "@/types";

const API_KEY = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_FREESOUND_API_KEY || "")
  : "";

const API_BASE = "https://freesound.org/apiv2";

// Curated search queries for each ambient type
const SOUND_QUERIES: Record<AmbientSoundType, { query: string; minDuration: number; maxDuration: number }> = {
  thunder: { query: "thunderstorm rain thunder ambient", minDuration: 30, maxDuration: 300 },
  fire: { query: "fireplace crackling loop", minDuration: 30, maxDuration: 300 },
  whitenoise: { query: "white noise ambient", minDuration: 30, maxDuration: 300 },
  birds: { query: "birds singing chirping morning ambient", minDuration: 30, maxDuration: 300 },
  waves: { query: "ocean waves ambient loop", minDuration: 30, maxDuration: 300 },
};

// Cache fetched audio URLs in memory
const audioCache = new Map<string, string>();

export function isFreesoundAvailable(): boolean {
  return API_KEY.length > 0;
}

interface FreesoundResult {
  id: number;
  name: string;
  previews: {
    "preview-hq-mp3": string;
    "preview-lq-mp3": string;
  };
  duration: number;
}

/**
 * Search freesound for a suitable ambient sound and return a preview URL.
 * Returns null if API key not set, offline, or no results.
 */
export async function getFreesoundUrl(type: AmbientSoundType): Promise<string | null> {
  if (!isFreesoundAvailable()) return null;

  const cached = audioCache.get(type);
  if (cached) return cached;

  const config = SOUND_QUERIES[type];

  try {
    const params = new URLSearchParams({
      query: config.query,
      filter: `duration:[${config.minDuration} TO ${config.maxDuration}]`,
      sort: "rating_desc",
      fields: "id,name,previews,duration",
      page_size: "5",
      token: API_KEY,
    });

    const res = await fetch(`${API_BASE}/search/text/?${params}`);
    if (!res.ok) return null;

    const data = await res.json();
    const results: FreesoundResult[] = data.results || [];
    if (results.length === 0) return null;

    // Pick a random one from top 5 for variety
    const pick = results[Math.floor(Math.random() * results.length)];
    const url = pick.previews["preview-hq-mp3"] || pick.previews["preview-lq-mp3"];

    audioCache.set(type, url);
    return url;
  } catch {
    // Offline or API error
    return null;
  }
}

/**
 * Clear the audio cache (useful when user wants to refresh sounds)
 */
export function clearFreesoundCache(): void {
  audioCache.clear();
}
