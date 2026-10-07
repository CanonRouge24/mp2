import { useParams } from "react-router";

import {
  Button,
  Card, CardContent, CardMedia,
  Container,
  Divider,
  Stack, Typography
} from "@mui/material";

import { NavLink } from "react-router";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function VideoPage ({ videos })
{
  if (videos === null) return;

  const { length } = videos;

  const id = +(useParams().id),
        video = videos[+id];

  const { thumbnails: { gallery : thumbnail } } = video;

  return (
    <Container sx={{ display: "flex", alignItems: "center" }}>
      <NavLink to={`/video/${((id - 1) < 0) ? 0 : id - 1}`} sx={{ position: "fixed", top: "50%" }}>
        <NextPrevButton id={ id } isNext={ false } enabled={ (id > 0) }/>
      </NavLink>

      <Container sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <VideoEmbed video={ video }/>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: "white" }}/>} spacing={1} sx={{ bgcolor: "secondary.light", p: "1rem", color: "white" }}>
              <Typography component="h1" variant="h4" sx={{ flex: 4 }}>
                {video.title}
              </Typography>
              <Typography component="p" variant="h6" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                Views: {video.viewCount}
              </Typography>
            </Stack>
            <Typography component="p" variant="h6" sx={{ whiteSpace: "pre" }}>
              {`Created By:`} <a href={`https://youtube.com/channel/${video.channelId}`}>{video.channelTitle}</a>
              {`\nPublished: ${new Date(video.published).toLocaleString().split`, `[0]}`}
              {`\nAdded: ${new Date(video.added).toLocaleString().split`, `[0]}`}
            </Typography>
          </CardContent>
        </Card>
      </Container>

      <NavLink to={`/video/${((id + 1) === length) ? length - 1 : id + 1}`} sx={{ position: "fixed", top: "50%" }}>
        <NextPrevButton id={ id } isNext={ true } enabled={ (id < length) }/>
      </NavLink>
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
      allowFullScreen
    ></iframe>
  );
}

function NextPrevButton ({ id, isNext, enabled })
{
  const target = id + (isNext << 1) - 1,
        icon = (isNext) ?
          <ArrowForwardIosRoundedIcon/>
          :
          <ArrowBackIosRoundedIcon/>,
        key = (isNext) ? ">" : "<",

        style = {
          position: "fixed",
          top: "50%",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          left: (isNext) ? "" : "2.5%",
          right: (isNext) ? "2.5%" : ""
        };


  return (
    <NavLink to={`/video/${target}`}>
      {
        (enabled) ?
          <Button key={key} variant="contained" size="large" color="secondary" sx={ style }>
            {icon}
          </Button>
          :
          <Button key={key} variant="contained" size="large" sx={ style } disabled>
            {icon}
          </Button>
      }
    </NavLink>
  );
}
