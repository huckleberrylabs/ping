import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { InfoWindow } from "../../info-window";
import { School, Coordinates } from "@huckleberry/schools";
import { SchoolSummary } from "../summary";
import "./style.css";

const GOOGLE_API_KEY = process.env.REACT_APP_PUBLIC_GOOGLE_API_KEY;

type Props = {
  schools: School[];
  center: Coordinates;
  zoom: number;
};
type State = {
  selected: School | undefined;
  center: Coordinates;
};

export class SchoolMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected: undefined,
      center: props.center,
    };
  }
  onMapClick = (): void => {
    this.setState({ selected: undefined });
  };
  onMarkerClick = (school: School): void => {
    this.setState({ selected: school });
  };
  onInfoWindowCloseClick = (): void => {
    this.setState({ selected: undefined });
  };
  render() {
    return (
      <>
        <LoadScript id="script-loader" googleMapsApiKey={GOOGLE_API_KEY}>
          <GoogleMap
            id="map"
            mapContainerStyle={{
              height: "100%",
              width: "100%",
              overflow: "hidden",
            }}
            zoom={this.props.zoom}
            center={{
              lat: this.state.center.latitude,
              lng: this.state.center.longitude,
            }}
            onClick={this.onMapClick}
          >
            {this.props.schools
              .filter(school => school.latitude && school.longitude)
              .map((school, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: school.latitude,
                    lng: school.longitude,
                  }}
                  onClick={() => this.onMarkerClick(school)}
                />
              ))}
            {this.state.selected ? (
              <InfoWindow
                position={this.state.selected}
                onCloseClick={this.onInfoWindowCloseClick}
              >
                <SchoolSummary school={this.state.selected} />
              </InfoWindow>
            ) : (
              <></>
            )}
          </GoogleMap>
        </LoadScript>
      </>
    );
  }
}
