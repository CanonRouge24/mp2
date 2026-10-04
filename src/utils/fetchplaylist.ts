import axios from "axios";

import type {
  PlaylistItemsResponse,
  Video,
  VideoItemsResponse,
  VideoRawItem
} from "./videos.ts";
import {
  convertPlaylistItemToVideo,
  augmentVideoStatistics
} from "./videos.ts";

import { setCachedData, getCachedData } from "./localstorage.ts";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY,

      CACHE_KEY = "cr24_playlist",

      // 1 day in seconds
      CACHE_LIFETIME = 24 * 60 * 60,

      PLAYLIST_IDS = [
        "PL4vSHIbiiRJ_xJzxhdKQCMz8hhwx1sRcA", // Music
        "PL4vSHIbiiRJ_-Banj0m6NhItG5izKi0no"  // Liked Songs (Spotify transfer)
      ],

      BASE_URL = "https://www.googleapis.com/youtube/v3/",
      PLAYLIST_BASE_URL = BASE_URL + `playlistItems?part=snippet&part=id&maxResults=50&key=${API_KEY}`,
      BATCH_VIDEO_BASE_URL = BASE_URL + `videos?part=snippet&part=statistics&key=${API_KEY}`;


async function fetchPlaylistData () : Video[]
{
  // Check if in cache
  const cached = getCachedData<Video[]>(CACHE_KEY);

  if (cached)
  {
    console.log(`Using cached data that expires at ${(new Date(cached.expiry)).toString()}!`);

    return cached;
  }

  // Get from API
  console.log("Fetching fresh data from API...");
  const videos : Video[] = [];

  // Get videos from all playlists
  for (const ID of PLAYLIST_IDS)
  {
    let playlistResponse : PlaylistItemsResponse = null,
        playlistURL = PLAYLIST_BASE_URL + `&playlistId=${ID}`;

    do
    {
      try
      {
        playlistResponse = await axios.get<PlaylistItemsResponse>(playlistURL);
        const items : Video[] = playlistResponse.data.items.map(convertPlaylistItemToVideo),

              // Extract the individual video ids and create the batch call URL
              idQueryParameters = items.map(
                video => `&id=${video.videoId}`
              ).join``,

              videoURL = BATCH_VIDEO_BASE_URL + idQueryParameters,
              videoResponse = await axois.get<VideoItemsResponse>(videoURL);

        // Copy `published` and `viewCount` data for each video
        augmentVideoStatistics(items, videoResponse);

        // Add to final items
        videos.concat(items);

        playlistURL = PLAYLIST_BASE_URL + `&pageToken=${playlistResponse.nextPageToken}`;
      }
      catch (error)
      {
        console.error("Couldn't get response ", error);
      }
    } while (playlistResponse.nextPageToken !== undefined);
  }

  setCachedData<Video[]>(CACHE_KEY, videos, CACHE_LIFETIME);

  return videos;
}

export default fetchPlaylistData;
