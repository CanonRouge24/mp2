import { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { Box } from "@mui/material";

import { HashRouter, Routes, Route } from "react-router";

import Navbar from "./Navbar.tsx";
import Home from "./Home.tsx";
import List from "./List.tsx";
import Gallery from "./Gallery.tsx";
import VideoPage from "./VideoPage.tsx";

import type { Video } from "./utils/videos.ts";

import loadPlaylistData from "./utils/fetchplaylist.ts";

function App()
{
  const [videos, setVideos] = useState<Video[] | null>(null),
        [searchString, setSearchString] = useState("");

  useEffect(
    () =>
    {
      loadPlaylistData().then(setVideos).catch(console.error);
    },
    []
  );

  return (
    <>
      <CssBaseline enableColorScheme/>
      <HashRouter basename={"/"}>
        <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar setSearchString={ setSearchString }/>

          <Routes>
            <Route index element={<Home videos={ videos }/>}/>
            <Route path="list" element={<List videos={ videos } searchString={ searchString }/>}/>
            <Route path="gallery" element={<Gallery videos={ videos } searchString={ searchString } setSearchString={ setSearchString }/>}/>
            <Route path="video/:id" element={<VideoPage videos={ videos }/>}/>
          </Routes>
        </Box>
      </HashRouter>
    </>
  );
}

export default App;
