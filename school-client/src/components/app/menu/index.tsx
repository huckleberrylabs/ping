import React, { Component } from "react";
import "@material/button/dist/mdc.button.css";
import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import { Button } from "@rmwc/button";
import { List, ListItem } from "@rmwc/list";

type Props = {};
type State = {
  isOpen: boolean;
};

export class AppMenu extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  toggleOpen = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };
  render() {
    return (
      <>
        <Drawer
          style={{ top: 0 }}
          dir="rtl"
          modal
          open={this.state.isOpen}
          onClose={this.toggleOpen}
        >
          <DrawerHeader dir="ltr" />
          <DrawerContent dir="ltr">
            <List>
              <ListItem>Explore</ListItem>
              <ListItem>About</ListItem>
            </List>
          </DrawerContent>
        </Drawer>
        <Button onClick={this.toggleOpen} outlined icon="menu" />
      </>
    );
  }
}
