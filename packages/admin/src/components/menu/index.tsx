import React from "react";
import { Link } from "react-router-dom";

// Drawer
import { Drawer, DrawerContent } from "@rmwc/drawer";
import "@material/drawer/dist/mdc.drawer.css";

// List
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";

// Style
import "./style.css";

export const AppMenu = () => (
  <Drawer className="menu-container">
    <DrawerContent>
      <List>
        <Link to="/widgets">
          <ListItem>widgets</ListItem>
        </Link>
        <Link to="/account">
          <ListItem>account</ListItem>
        </Link>
        {/*         <Link to="/analytics">
          <ListItem>analytics</ListItem>
        </Link> */}
        <Link to="/billing">
          <ListItem>billing</ListItem>
        </Link>
      </List>
    </DrawerContent>
  </Drawer>
);
