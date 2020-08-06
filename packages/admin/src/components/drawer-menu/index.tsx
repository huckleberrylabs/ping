import React from "react";
import { Link } from "react-router-dom";

// Drawer
import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

// List
import { List, ListItem } from "@rmwc/list";
import "@rmwc/list/styles";

// Style
import "./style.css";

// Routes
import { Routes } from "../../config";

export const DrawerMenu = () => (
  <Drawer className="drawer-menu-container">
    <DrawerContent>
      <List>
        <Link to={Routes.account}>
          <ListItem>Account</ListItem>
        </Link>
        <Link to={Routes.contacts}>
          <ListItem>Contacts</ListItem>
        </Link>
        <Link to={Routes.conversations}>
          <ListItem>Conversations</ListItem>
        </Link>
        <Link to={Routes.widgets}>
          <ListItem>Widgets</ListItem>
        </Link>
        <Link to={Routes.routers}>
          <ListItem>Routers</ListItem>
        </Link>
        <Link to={Routes.analytics}>
          <ListItem>Analytics</ListItem>
        </Link>
      </List>
    </DrawerContent>
  </Drawer>
);
