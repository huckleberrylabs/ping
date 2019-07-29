import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@rmwc/theme";
import { SchoolExplorer, SchoolDetail } from "../../school";
import { AppBar } from "../bar";
import "./style.css";

type Props = {};
type State = {};

export class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ThemeProvider
        options={{
          primary: "#6200ee",
          secondary: "#03dac4",
          error: "#b00020",
          background: "#fff",
          surface: "#fff",
          onPrimary: "rgba(255, 255, 255, 1)",
          onSecondary: "rgba(0, 0, 0, 0.87)",
          onSurface: "rgba(0, 0, 0, 0.87)",
          onError: "#fff",
          textPrimaryOnBackground: "rgba(0, 0, 0, 0.87)",
          textSecondaryOnBackground: "rgba(0, 0, 0, 0.54)",
          textHintOnBackground: "rgba(0, 0, 0, 0.38)",
          textDisabledOnBackground: "rgba(0, 0, 0, 0.38)",
          textIconOnBackground: "rgba(0, 0, 0, 0.38)",
          textPrimaryOnLight: "rgba(0, 0, 0, 0.87)",
          textSecondaryOnLight: "rgba(0, 0, 0, 0.54)",
          textHintOnLight: "rgba(0, 0, 0, 0.38)",
          textDisabledOnLight: "rgba(0, 0, 0, 0.38)",
          textIconOnLight: "rgba(0, 0, 0, 0.38)",
          textPrimaryOnDark: "white",
          textSecondaryOnDark: "rgba(255, 255, 255, 0.7)",
          textHintOnDark: "rgba(255, 255, 255, 0.5)",
          textDisabledOnDark: "rgba(255, 255, 255, 0.5)",
          textIconOnDark: "rgba(255, 255, 255, 0.5)"
        }}
      >
        <Router>
          <AppBar />
          <div className="app-container">
            <Switch>
              <Route path="/" exact component={SchoolExplorer} />
              <Route path="/schools" exact component={SchoolExplorer} />
              <Route path="/schools/:id" component={SchoolDetail} />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}
