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
    (a, b) => a.viewCount - b.viewCount
  );

  const { length } = sorted,
        median = length / 2,
        firstQuartile = length / 4,
        thirdQuartile = 3 * length / 4;

  viewStatistics.min = +sorted[0].viewCount;
  viewStatistics.max = +sorted[length - 1].viewCount;
  viewStatistics.median = (+sorted[Math.floor(median)].viewCount + +sorted[Math.ceil(median)].viewCount) / 2;
  viewStatistics["25"] = (+sorted[Math.floor(firstQuartile)].viewCount + +sorted[Math.ceil(firstQuartile)].viewCount) / 2;
  viewStatistics["75"] = (+sorted[Math.floor(thirdQuartile)].viewCount + +sorted[Math.ceil(thirdQuartile)].viewCount) / 2;

  const sum = sorted.reduce(
    (total, video) => {
      return total + +video.viewCount;
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

let uniqueChannels : number | undefined = undefined;

function getUniqueChannels (videos : Video[]) : number
{
  if (uniqueChannels !== undefined)
  {
    return uniqueChannels;
  }

  const channels = new Set();

  for (const video of videos)
  {
    channels.add(video.channelId);
  }

  uniqueChannels = channels.size;

  return uniqueChannels;
}

export { getLatest, getUniqueChannels, getViewStatistics };
