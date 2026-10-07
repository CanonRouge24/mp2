import {
  Box, Container
} from "@mui/material";

import {
  DataGrid,
  type GridRowsProp,
  type GridColDef
} from "@mui/x-data-grid";

import {
  NavLink
} from "react-router";

import type { Video } from "./utils/videos.ts";


const ignore = "getApplyQuickFilterFn",
      ignoreFn = () => null;

const COLUMNS : GridColDef[] = [
  {
    field: "thumbnail",
    headerName: "",
    width: 320,
    [ignore]: ignoreFn,
    renderCell: (params) => {
      return (
        <NavLink to={`/video/${params.id}`}>
          <img
            src={params.value}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </NavLink>
      );
    },
    headerAlign: "center"
  },
  { field: "title", headerName: "Name", width: 480, align: "center", headerAlign: "center" },
  { field: "author", headerName: "By", width: 160, align: "center", headerAlign: "center" },
  { field: "views", headerName: "Views", width: 100, [ignore]: ignoreFn, align: "right", headerAlign: "center" },
  { field: "published", headerName: "Uploaded", width: 100, type: "date", align: "right", headerAlign: "center" },
  { field: "added", headerName: "Discovered", width: 100, type: "date", align: "right", headerAlign: "center" }
];


interface ListProps {
  videos : Video[] | null;
  searchString : string;
}

export default function List ({ videos, searchString } : ListProps)
{
  if (videos === null) return;

  const rows : GridRowsProp = videos.map(
    (video : Video) =>
    {
      return {
        id: video.index,
        // videoId: video.videoId,
        thumbnail: video.thumbnails.list.link,
        title: video.title,
        author: video.channelTitle,
        views: +(video.viewCount ?? 0),
        published: new Date(video.published ?? ""),
        added: new Date(video.added)

      };
    }
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "25%", maxHeight: "100%" }}>
      <DataGrid
        rows={ rows } rowHeight={ 180 }
        columns={ COLUMNS }
        columnVisibilityModel={{ author: true }}
        filterModel={
          {
            items: [],
            quickFilterValues: searchString.trim() === "" ? [] : [searchString]
          }
        }
      />
    </Box>
  );
}
