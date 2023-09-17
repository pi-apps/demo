import React from "react";
import { UserContextType } from "./Types";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { UserContext } from "./Auth";

const linkStyle = {
  textDecoration: "none",
  color: 'black'
};

export default function Header() {
  const { user, saveUser } = React.useContext(UserContext) as UserContextType;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ mr: 2 }}
          >
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/" style={linkStyle}>Home</Link> {/* IMPORTANT TO USE LINK FROM REACT-DOM TO NOT LOSE CONTEXT*/}
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/payments/usertoapp" style={linkStyle}>User to App Payments</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/payments/apptouser" style={linkStyle}>App to User Payments</Link>
              </MenuItem>
            </Menu>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pi Bakery
          </Typography>
          
              <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={user.uid === '' ? (saveUser ) : (saveUser)}
                    color="inherit"
                  >
                  { user.uid === '' ? (
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Sign-In
                    </Typography>
                    ) : (
                  <Container>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    @{user.username} - Sign Out
                    </Typography>
                  </Container>
              )}
              </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
