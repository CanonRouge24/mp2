import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

import { BrowserRouter, Routes, Route } from "react-router";

import Navbar from "./Navbar.tsx";

import Home from "./Home.tsx";
import List from "./List.tsx";
import Gallery from "./Gallery.tsx";

import fetchPlaylistData from "./utils/fetchplaylist.ts";

function App()
{
  return (
    <>
      <CssBaseline enableColorScheme/>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Navbar/>

        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/list" element={<List/>}/>
          <Route path="/gallery" element={<Gallery/>}/>
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
