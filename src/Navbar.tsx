import * as React from "react";

import SearchIcon from "@mui/icons-material/Search";

import
{
  AppBar,
  Box,
  Button,
  InputAdornment,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";

import { NavLink } from "react-router";


function NavbarLink ({ text, isActive })
{
  const NORMAL_STYLE = {
    bgcolor: "primary.normal",
    color: "white"
  },

  ACTIVE_STYLE = {
    bgcolor: "primary.light",
    color: "white"
  },

  style = (isActive) ? ACTIVE_STYLE : NORMAL_STYLE;

  return (
    <Button key={text} variant="text" sx={style}>
    {text}
    </Button>
  );
}


export default function Navbar ({ setSearchString })
{
  return (
    <Box>
      <AppBar sx={{ position : "sticky" }}>
        <Toolbar>
          <NavLink to="/">
            <Button key="CanonRouge24's Playlist Viewer" variant="text" sx={{ flexGrow: 1, mr: "1rem", fontSize: "1rem", textAlign: { xs: "center", md: "left" }, color: "white" }}>
              CanonRouge24's Playlist Viewer
            </Button>
          </NavLink>

          <TextField
            hiddenLabel
            placeholder="Search"
            size="small"
            slotProps = {{
              input: {
                sx: {
                  bgcolor: "primary.light",
                  borderRadius: 3,
                },
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }}/>
                  </InputAdornment>
                ),
              },
            }}
            sx={
              theme =>
              ({
                bgcolor: "primary.light",
                borderRadius: 3,
                boxShadow: `0px 0px 15px ${theme.palette.primary.light}`,
                flexGrow: 5,
                input: { color: "white", caretColor: "white" },

                /* Style the placeholder text to be transparent white */
                "& input::placeholder": {
                  color: "white",
                  opacity: 0.7
                }
              })
            }
            onChange={
              (event : React.ChangeEvent<HTMLInputElement>) => {
                setSearchString(event.target.value);
              }
            }
            variant="filled"
          />

          <Box sx={{ display: "flex", justifyContent: "end", flexGrow: 1 }}>
            <NavLink to="/list">
            {
              ({ isActive }) => <NavbarLink text="List" isActive={isActive}/>
            }
            </NavLink>
            <NavLink to="/gallery">
            {
              ({ isActive }) => <NavbarLink text="Gallery" isActive={isActive}/>
            }
            </NavLink>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
