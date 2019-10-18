import React from "react";
import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import { Link } from "react-router-dom";

type Props = {};

export const AppMenu = (props: Props) => (
  <Drawer>
    <DrawerHeader />
    <DrawerContent>
      <List>
        <Link to="/insights">
          <ListItem>Insights</ListItem>
        </Link>

        <Link to="/widgets">
          <ListItem>Widgets</ListItem>
        </Link>
        <Link to="/team">
          <ListItem>Team</ListItem>
        </Link>
        <Link to="/billing">
          <ListItem>Billing</ListItem>
        </Link>
        <Link to="/user">
          <ListItem>My Profile</ListItem>
        </Link>
        <Link to="/widgets">
          <ListItem>About</ListItem>
        </Link>
      </List>
    </DrawerContent>
  </Drawer>
);
