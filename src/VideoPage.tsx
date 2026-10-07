import { useParams } from "react-router";

import {
  Button,
  Card, CardContent,
  Container,
  Divider,
  Stack, Typography
} from "@mui/material";

import { NavLink } from "react-router";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

// TODO: style to prevent buttons overlapping video

export default function VideoPage (props)
{
  const { videos } : Video[] = props

  if (videos === null) return;

  const { length } = videos;

  const id = +(useParams().id),
        video = videos[+id];

  const { thumbnails: { gallery : thumbnail } } = video;

  return (
    <Container sx={{ display: "flex", alignItems: "center" }}>
      <NextPrevButton id={ id } isNext={ false } enabled={ (id > 0) }/>

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

      <NextPrevButton id={ id } isNext={ true } enabled={ (id < length) }/>
    </Container>
  );
}

function VideoEmbed (props)
{
  const { video } : Video = props;

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

function NextPrevButton (props)
{
  const { id } : number = props,
        { isNext } : boolean = props,
        { enabled } : boolean = props;

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
    <Button
      key={key}
      component={(enabled) ? NavLink : "button"}
      {...((enabled) ? { to: `/video/${target}` } : {})}
      variant="contained"
      size="large"
      disabled={!enabled}
      sx={ style }
    >
      {icon}
    </Button>
  );
}
