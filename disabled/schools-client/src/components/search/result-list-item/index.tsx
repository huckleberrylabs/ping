import React from "react";
import "@material/list/dist/mdc.list.css";
import { SimpleListItem } from "@rmwc/list";
import { School, GoogleAutoCompleteResult } from "@huckleberry/schools";
import { Link } from "react-router-dom";

export const SchoolSearchResultListItem = (props: { school: School }) => {
  return (
    <Link to={`/schools/${props.school.id}`}>
      <SimpleListItem
        graphic="school"
        text={props.school.name}
        secondaryText={props.school.address}
      />
    </Link>
  );
};

export const AddressSearchResultListItem = (props: {
  address: GoogleAutoCompleteResult;
}) => {
  return (
    <Link to={`/nearby/${encodeURIComponent(props.address.description)}`}>
      <SimpleListItem graphic="map" text={props.address.description} />
    </Link>
  );
};
