import
{
  Box, Chip, Container, Divider, Paper, Stack, Typography
} from "@mui/material";

import type { VideoProps } from "./utils/videos.ts";

import { getLatest, getUniqueChannels, getViewStatistics } from "./utils/statistics.ts";


const Center = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

export default function Home ({ videos } : VideoProps)
{
  return (
    <>
      <Box sx={Center}>
        <WelcomeCard videos={ videos }/>
      </Box>
    </>
  );
}

function WelcomeCard ({ videos } : VideoProps)
{
  return (
    <Paper elevation={3} sx={{ width: "75%" }}>
      <Box sx={{ width: "100%", padding: "1rem" }}>
        <Typography align="center" component="h1" variant="h3">
          {
            (videos === null) ? "Fetching..." : `Fetched ${videos.length} videos`
          }
        </Typography>
        <Divider variant="middle" sx={{ my: "1rem" }}/>
        <VideoStatistics videos={ videos }/>
      </Box>
    </Paper>
  );
}

function VideoStatistics ({ videos } : VideoProps)
{
  let videoStatistics = (
    <Typography align="center" component="h2" variant="h4" sx={{ textDecoration: "underline" }} gutterBottom>
      Video Statistics
    </Typography>
  );

  let latest = "",
      channels = "";

  if (videos !== null)
  {
    latest = `Most Recently Added: ${(videos === null) ? "" : getLatest(videos).toDateString() }\n`;
    channels = `Unique Channels: ${(videos === null) ? "" : getUniqueChannels(videos)}\n`;
  }

  return (
    <>
      { videoStatistics }
      <Typography align="center" component="h3" variant="h5" sx={{ whiteSpace: "pre" }} gutterBottom>
        {channels}
        {latest}
      </Typography>
      <Divider variant="middle" sx={{ my: "1rem" }}/>
      <ViewStack videos={ videos }/>
    </>
  );
}

function ViewStack ({ videos } : VideoProps)
{
  let statistics : Record<string, number> | null = null;

  if (videos !== null)
  {
    statistics = getViewStatistics(videos);
  }

  return (
    <Container sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "center" }} useFlexGap>
        <Chip color="info" label={
          `Average: ${
            (statistics !== null) ?
              statistics.mean.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                }
              )
              :
              "N/A"
          }`
        }/>
        <Chip color="info" label={`Min: ${(statistics !== null) ? statistics.min.toLocaleString() : "N/A"}`}/>
        <Chip color="info" label={`First Quartile: ${(statistics !== null) ? statistics["25"].toLocaleString() : "N/A"}`}/>
        <Chip color="info" label={`Median: ${(statistics !== null) ? statistics.median.toLocaleString() : "N/A"}`}/>
        <Chip color="info" label={`Third Quartile: ${(statistics !== null) ? statistics["75"].toLocaleString() : "N/A"}`}/>
        <Chip color="info" label={`Max: ${(statistics !== null) ? statistics.max.toLocaleString() : "N/A"}`}/>
      </Stack>
    </Container>
  );
}
