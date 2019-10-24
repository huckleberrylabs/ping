import React, { Component } from "react";
import { Phone, Url } from "@huckleberryai/core";
import { Settings } from "@huckleberryai/ping";
import { WidgetList } from "../list";
import "./style.css";

type Props = {};

type State = {
  error: boolean;
  widgets: Settings.T[];
};

export class WidgetExplorer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      widgets: []
    };
  }
  async componentDidMount() {
    this.setState({
      widgets: [
        Settings.C("+1 647 295 1647" as Phone.T, "http://localhost" as Url.T),
        Settings.C("+1 647 295 1647" as Phone.T, "http://localhost" as Url.T)
      ]
    });
  }
  render() {
    const { widgets } = this.state;
    return (
      <div className="explorer-container">
        <WidgetList widgets={widgets} />
      </div>
    );
  }
}
