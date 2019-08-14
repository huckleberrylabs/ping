import React, { ReactChild } from "react";
import { InfoWindow as OriginalInfoWindow } from "@react-google-maps/api";
import { Coordinates } from "@huckleberry/schools";
import "./style.css";

type Props = {
  children: ReactChild;
  position: Coordinates;
  onCloseClick: () => void;
};

export const InfoWindow = (props: Props) => (
  <OriginalInfoWindow
    options={{
      pixelOffset: {
        width: 0,
        height: -44,
        equals: () => {
          return true;
        },
      },
    }}
    position={{
      lat: props.position.latitude,
      lng: props.position.longitude,
    }}
    onCloseClick={props.onCloseClick}
  >
    {props.children}
  </OriginalInfoWindow>
);
