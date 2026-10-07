import type { Video } from "./videos.ts";


let viewStatistics : Record<string, number> = {
  min: 0,
  max: 0,
  median: 0,
  "25": 0,
  "75": 0,
  mean: 0
};

let computedViewStatistics : boolean = false;

function getViewStatistics (videos : Video[]) : Record<string, number>
{
  if (computedViewStatistics)
  {
    return viewStatistics;
  }

  // Sort by views
  const sorted = videos.slice().sort(
    (a, b) => +(a.viewCount ?? 0) - +(b.viewCount ?? 0)
  );

  const { length } = sorted,
        median = length / 2,
        firstQuartile = length / 4,
        thirdQuartile = 3 * length / 4;

  viewStatistics.min = +(sorted[0].viewCount ?? 0);
  viewStatistics.max = +(sorted[length - 1].viewCount ?? 0);
  viewStatistics.median = (+(sorted[Math.floor(median)].viewCount ?? 0) + +(sorted[Math.ceil(median)].viewCount ?? 0)) / 2;
  viewStatistics["25"] = (+(sorted[Math.floor(firstQuartile)].viewCount ?? 0) + +(sorted[Math.ceil(firstQuartile)].viewCount ?? 0)) / 2;
  viewStatistics["75"] = (+(sorted[Math.floor(thirdQuartile)].viewCount ?? 0) + +(sorted[Math.ceil(thirdQuartile)].viewCount ?? 0)) / 2;

  const sum = sorted.reduce(
    (total, video) => {
      return total + +(video.viewCount ?? 0);
    },
    0
  );

  viewStatistics.mean = (sum / length);

  computedViewStatistics = true;

  return viewStatistics;
}

let latest : Date | null = null;

function getLatest (videos : Video[]) : Date
{
  if (latest !== null)
  {
    return latest;
  }

  // Else
  latest = new Date(videos[0].added);

  return latest;
}

const channelNames : string[] = [];
let uniqueChannels : number | undefined = 0;

function computeUniqueChannels (videos: Video[]) : void
{
  const channels = new Set();

  for (const video of videos)
  {
    if (!channels.has(video.channelId))
    {
      channelNames.push(video.channelTitle);
    }

    channels.add(video.channelId);
  }

  uniqueChannels = channels.size;
}

function getUniqueChannels (videos : Video[]) : number
{
  if (uniqueChannels !== undefined)
  {
    return uniqueChannels;
  }

  // Else
  computeUniqueChannels(videos);

  return (uniqueChannels ?? 0);
}

function getUniqueChannelNames (videos : Video[]) : string[]
{
  if (channelNames.length !== 0)
  {
    return channelNames;
  }

  // Else
  computeUniqueChannels(videos);

  return channelNames;
}

export { getLatest, getUniqueChannels, getUniqueChannelNames, getViewStatistics };
