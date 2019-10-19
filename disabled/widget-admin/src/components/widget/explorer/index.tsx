import React, { Component } from "react";
import { IWidgetSettings, WidgetSettings } from "@huckleberryai/widget";
import { WidgetList } from "../list";
import "./style.css";
import { ParsePhone } from "@huckleberryai/core";

type Props = {};

type State = {
  error: boolean;
  widgets: IWidgetSettings[];
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
        WidgetSettings(ParsePhone("+1 647 295 1647")),
        WidgetSettings(ParsePhone("+1 647 295 1647"))
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
