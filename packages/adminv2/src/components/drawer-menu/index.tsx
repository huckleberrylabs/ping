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

// Routes
import { Routes } from "../../config";

export const DrawerMenu = () => (
  <Drawer className="drawer-menu-container">
    <DrawerContent>
      <List>
        <Link to={Routes.account}>
          <ListItem>account</ListItem>
        </Link>
      </List>
    </DrawerContent>
  </Drawer>
);
