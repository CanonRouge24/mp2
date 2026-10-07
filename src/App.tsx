import { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { Box } from "@mui/material";

import { BrowserRouter, Routes, Route } from "react-router";

import Navbar from "./Navbar.tsx";
import Home from "./Home.tsx";
import List from "./List.tsx";
import Gallery from "./Gallery.tsx";
import VideoPage from "./VideoPage.tsx";

import loadPlaylistData from "./utils/fetchplaylist.ts";

function App()
{
  const [videos, setVideos] = useState(null),
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
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar setSearchString={ setSearchString }/>

          <Routes>
            <Route index element={<Home videos={ videos }/>}/>
            <Route path="list" element={<List videos={ videos } searchString={ searchString }/>}/>
            <Route path="gallery" element={<Gallery videos={ videos } searchString={ searchString }/>}/>
            <Route path="video/:id" element={<VideoPage videos={ videos }/>}/>
          </Routes>
        </Box>
      </BrowserRouter>
    </>
  );
}

export default App;
