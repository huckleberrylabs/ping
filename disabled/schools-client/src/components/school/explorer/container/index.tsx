import React, { Component } from "react";
import { SchoolMap } from "../../map";
import { Coordinates, School } from "@huckleberry/schools";
import { SchoolService } from "../../../../services";
import { SchoolExplorerViewModes } from "../view-selector";
import { SchoolExplorerBar } from "../bar";
import "./style.css";
import { SchoolList } from "../../list";

type Props = {};

type State = {
  map: {
    center: Coordinates;
    zoom: number;
  };
  view: {
    mode: SchoolExplorerViewModes;
  };

  schools: School[]; // Original Data
  filteredSchools: School[]; // Display Data
};

export class SchoolExplorer extends Component<Props, State> {
  private schoolService: SchoolService = new SchoolService();
  constructor(props: Props) {
    super(props);
    this.state = {
      map: {
        zoom: 6,
        center: { latitude: 49.5881527, longitude: -86.0781141 },
      },
      view: {
        mode: SchoolExplorerViewModes.MAP,
      },
      schools: [],
      filteredSchools: [],
    };
  }
  async componentDidMount() {
    const schools = await this.schoolService.getAll();
    this.setState({ schools, filteredSchools: schools });
  }
  onChangeViewMode = (mode: SchoolExplorerViewModes): void => {
    this.setState({ view: { mode } });
  };
  render() {
    return (
      <div className="explorer-container">
        <SchoolExplorerBar
          currentViewMode={this.state.view.mode}
          onChangeViewMode={this.onChangeViewMode}
        />
        {this.state.view.mode === SchoolExplorerViewModes.MAP ? (
          <SchoolMap
            schools={this.state.filteredSchools}
            center={this.state.map.center}
            zoom={this.state.map.zoom}
          />
        ) : (
          <></>
        )}
        {this.state.view.mode === SchoolExplorerViewModes.LIST ? (
          <SchoolList schools={this.state.filteredSchools} />
        ) : (
          <></>
        )}
      </div>
    );
  }
}
