import React from "react";
import { Link } from "react-router-dom";
import { Routes } from "../../config";

// UI
import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { List, ListItem } from "@rmwc/list";
import "@rmwc/list/styles";
import "./style.css";

export const DrawerMenu = () => (
  <Drawer className="drawer-menu">
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
        {/*  <Link to={Routes.routers}>
          <ListItem>Routing</ListItem>
        </Link> */}
        {/* <Link to={Routes.analytics}>
          <ListItem>Analytics</ListItem>
        </Link> */}
      </List>
    </DrawerContent>
  </Drawer>
);
