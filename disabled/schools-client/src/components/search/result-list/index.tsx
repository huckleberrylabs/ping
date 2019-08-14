import React from "react";

import "@rmwc/icon/icon.css";
import "@material/list/dist/mdc.list.css";
import "@rmwc/circular-progress/circular-progress.css";
import { CircularProgress } from "@rmwc/circular-progress";
import { List } from "@rmwc/list";

import { SearchResult, isSchool } from "@huckleberry/schools";
import {
  AddressSearchResultListItem,
  SchoolSearchResultListItem,
} from "../result-list-item";
import "./style.css";

const RESULT_LIMIT = 10;

type Props = {
  results: SearchResult[] | undefined;
  onSelect: () => void;
};

export const SearchResultList = (props: Props) => {
  if (!props.results) {
    return (
      <div className="result-list">
        <CircularProgress />
      </div>
    );
  } else if (props.results.length === 0) {
    return <div className="result-list">No Results Found</div>;
  } else {
    return (
      <div className="result-list">
        <List twoLine onClick={props.onSelect}>
          {props.results.slice(0, RESULT_LIMIT).map((result, index) => {
            if (isSchool(result)) {
              return <SchoolSearchResultListItem key={index} school={result} />;
            } else {
              return (
                <AddressSearchResultListItem key={index} address={result} />
              );
            }
          })}
        </List>
      </div>
    );
  }
};
