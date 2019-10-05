import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "@material/theme/dist/mdc.theme.css";
import { ThemeProvider } from "@rmwc/theme";
import { WidgetExplorer, WidgetDetail } from "../../widget";
import { AppBar } from "../bar";
import { AppMenu } from "../menu";
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
          primary: "#0087ff",
          secondary: "#e1f5fe",
          error: "#f44336",
          background: "white",
          surface: "#fafafa",
          onPrimary: "rgba(255, 255, 255, 1)",
          onSecondary: "rgba(0, 0, 0, 0.87)",
          onSurface: "rgba(0, 0, 0, 0.87)",
          onError: "#f44336",
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
          <AppBar logout={() => console.log("Logged Out")} />
          <div className="app-container">
            <AppMenu />
            <Switch>
              <Route path="/" exact component={WidgetExplorer} />
              <Route path="/widgets" exact component={WidgetExplorer} />
              <Route path="/widgets/:id" component={WidgetDetail} />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}
