import React from "react";
import { Link } from "react-router-dom";

// Drawer
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import "@material/drawer/dist/mdc.drawer.css";

// List
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";

export const AppMenu = () => (
  <Drawer>
    <DrawerHeader />
    <DrawerContent>
      <List>
        <Link to="/widgets">
          <ListItem>Widgets</ListItem>
        </Link>
        <Link to="/account">
          <ListItem>Account</ListItem>
        </Link>
      </List>
    </DrawerContent>
  </Drawer>
);
