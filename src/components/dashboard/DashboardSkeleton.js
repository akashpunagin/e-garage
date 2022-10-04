import React from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../../contexts/Auth";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Customer } from "./customer/Customer";
import { History } from "./history/History";
import { Item } from "./item/Item";
import { Vehicle } from "./vehicle/Vehicle";
import { Worker } from "./worker/Worker";

class NavItem {
  constructor(label, component, path) {
    this.label = label;
    this.component = component;
    this.path = path;
  }
}

export function DashboardSkeleton({ component: Component }) {
  // const { user, logout } = useAuth();
  // const history = useHistory();
  // async function handleLogout() {
  //   await logout();
  //   history.push("/login");
  // }

  const drawerWidth = 240;

  const navItems = [
    new NavItem("Customers", Customer, "/customer"),
    new NavItem("Items", Item, "/item"),
    new NavItem("Vehicles", Vehicle, "/vehicle"),
    new NavItem("Workers", Worker, "worker"),
    new NavItem("History", History, "/history"),
  ];

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const AppLabelAndLogo = () => {
    return (
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        E Garrage
      </Link>
    );
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <AppLabelAndLogo></AppLabelAndLogo>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText
                primary={
                  <Link to={item.path} style={{ textDecoration: "none" }}>
                    {item.label}
                  </Link>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box mr={10}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 0, display: { xs: "none", sm: "block" } }}
            >
              <AppLabelAndLogo></AppLabelAndLogo>
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item.label} sx={{ color: "#fff" }}>
                <Link
                  to={item.path}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {item.label}
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Component></Component>
      </Box>
    </Box>
  );
}
