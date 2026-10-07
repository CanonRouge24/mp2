import * as React from "react";

import type { Video, VideoProps } from "./utils/videos.ts";


interface GalleryProps {
  videos : Video[] | null;
  searchString : string;
}

export default function Gallery ({ videos, searchString } : GalleryProps)
{
  if (videos === null) return;


  return (
    <>
    </>
  );
}
