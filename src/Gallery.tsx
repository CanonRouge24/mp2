import { useEffect, useRef } from "react";

import {
  Box, Chip,
  ImageList, ImageListItem, ImageListItemBar,
  Stack
} from "@mui/material";

import {
  NavLink
} from "react-router";

import type { Video, VideoProps } from "./utils/videos.ts";

import { getUniqueChannelNames } from "./utils/statistics.ts";


interface GalleryProps {
  videos : Video[] | null;
  searchString : string;
  setSearchString : Function;
}

export default function Gallery ({ videos, searchString, setSearchString } : GalleryProps)
{
  if (videos === null) return;

  // Filter displayed videos based on search string
  videos = videos.filter(
    (video : Video) => {
      return video.title.includes(searchString) ||
             video.channelTitle.includes(searchString);
    }
  );

  return (
    <Box sx={{ height: "100%" }}>
      <ArtistChips videos={ videos } setSearchString={ setSearchString }/>
      <ImageGallery videos={ videos }/>
    </Box>
  );
}


interface ArtistChipsProps {
  videos : Video[];
  setSearchString : Function;
}

function ArtistChips ({ videos, setSearchString } : ArtistChipsProps)
{
  // if (videos === null) return;

  const scroller = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
    {
      const element = scroller.current;

      if (element === null) return;

      let target = element.scrollLeft,
        frame = 0;

      const clamp = (value : number) => Math.max(0, Math.min(element.scrollWidth - element.clientWidth, value)),

      animate = () => {
        const next = element.scrollLeft + (target - element.scrollLeft) / 4;

        if (Math.abs(target - next) < 0.5)
          {
            element.scrollLeft = target;
            frame = 0;
            return;
          }

          element.scrollLeft = next;
          frame = requestAnimationFrame(animate);
      };

      const handleWheel = (event : WheelEvent) =>
      {
        if (element.scrollWidth <= element.clientWidth) return;

        event.preventDefault();

        const pixels = (event.deltaMode === WheelEvent.DOM_DELTA_LINE) ?
          event.deltaY * 16
          :
          event.deltaY,

        // Only scroll smoothly for scrollwheel events; trackpad events have smooth deltaX by design
        isMouseNotch = (
          (event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL) ||
          (event.deltaX === 0 && Math.abs(event.deltaY) >= 50)
        );

        switch (isMouseNotch)
        {
          case true:
            target = clamp(target + pixels);
            if (frame === 0) frame = requestAnimationFrame(animate);
            break;

          case false:
            if (frame !== 0)
            {
              cancelAnimationFrame(frame);
              frame = 0;
            }

            target = clamp(element.scrollLeft + pixels + event.deltaX);
            element.scrollLeft = target;
            break;
        }
      };

      element.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        element.removeEventListener("wheel", handleWheel);
        cancelAnimationFrame(frame);
      };
    },
    []
  );

  const uniqueChannels : string[] = getUniqueChannelNames(videos);

  return (
    <Stack
      ref={ scroller }
      direction="row"
      spacing={1}
      sx={{ overflowX: "scroll", scrollbarWidth: "none", alignItems: "center", height: "3rem" }}
      useFlexGap
    >
      {
        uniqueChannels.map(
          (channel : string) =>
          {
            return (
              <Chip color="info" label={ channel } onClick={ () => { setSearchString(channel) } }/>
            );
          }
        )
      }
    </Stack>
  );
}


function ImageGallery ({ videos } : VideoProps)
{
  if (videos === null) return;

  return (
    <ImageList component="div" cols={3}>
      {
        videos.map(
          (video : Video) =>
          {
            const { thumbnails: { gallery } } = video;

            return (
              <ImageListItem
                key={video.videoId}
                sx={{
                  "& .MuiImageListItemBar-root": {
                    overflow: "hidden",
                    opacity: "0",
                    height: "0px",
                    transitionProperty: "opacity, height",
                    transitionDuration: "0.5s"
                  },

                  "& a:hover .MuiImageListItemBar-root": {
                    opacity: "1",
                    height: "2rem"
                  }
                }}
              >
                <NavLink to={`/video/${video.index}`}>
                  <img src={gallery.link} loading="lazy" width={ gallery.width } style={{ width: "100%" }}/>

                  <ImageListItemBar position="bottom" title={video.title} />
                </NavLink>
              </ImageListItem>
            );
          }
        )
      }
    </ImageList>
  );
}
