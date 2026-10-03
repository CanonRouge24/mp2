import axios from "axios";

import { setCachedData, getCachedData } from "./localstorage.ts";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY,

      CACHE_KEY = "cr24_playlist",

      // 1 day in seconds
      CACHE_LIFETIME = 24 * 60 * 60,

      PLAYLIST_IDS = [
        "PL4vSHIbiiRJ_xJzxhdKQCMz8hhwx1sRcA", // Music
        "PL4vSHIbiiRJ_-Banj0m6NhItG5izKi0no"  // Liked Songs (Spotify transfer)
      ];

async function fetchPlaylistData ()
{
  // Check if in cache
  const cached = getCachedData<any[]>(CACHE_KEY);

  if (cached)
  {
    console.log(`Using cached data that expires at ${(new Date(cached.expiry)).toString()}!`);

    return cached;
  }

  // Get from API
  console.log("Fetching fresh data from API...");
  for (const ID of PLAYLIST_IDS)
  {
    // const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&part=id&maxResults=50&playlistId=${ID}&key=${API_KEY}`;
  }

  const response = await axios.get(""),
        videos = response.data.items;

  setCachedData(CACHE_KEY, videos, CACHE_LIFETIME);

  return videos;
}
