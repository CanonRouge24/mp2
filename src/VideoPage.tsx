import { useParams } from "react-router";

import {
  Card, CardContent, CardMedia,
  Container,
  Typography
} from "@mui/material";

export default function VideoPage ({ videos })
{
  if (videos === null) return;

  const { id } = useParams(),
        video = videos[+id];

  const { thumbnails: { gallery : thumbnail } } = video;

  return (
    <Container sx={{ display: "flex", flexGap: "1rem" }}>
      <VideoEmbed video={ video }/>

      {/*
      <Card sx={{ display: "flex", flexDirection: "row", width: "100%", height: "100%" }}>
        <CardMedia
          image={thumbnail.link}
          sx={{ height: thumbnail.height }}
          title="test"
        />
        <CardContent>
        </CardContent>
      </Card>
      */}
    </Container>
  );
}

function VideoEmbed ({ video })
{
  return (
    <iframe
      style={{ width: "100%", aspectRatio: "16/9", border: "none" }}
      src={`https://www.youtube.com/embed/${video.videoId}`}
      title="Youtube Video Player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  );
}
