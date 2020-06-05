import React /* , { useState } */ from "react";
import { Link } from "react-router-dom";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Select
// import { Select } from "@rmwc/select";
import "@material/select/dist/mdc.select.css";

// UI Components
import { WidgetCard } from "../card";

// Style
import "./style.css";

// Domain
import { Widget } from "@huckleberrylabs/ping";

/*

const RESULTS_PER_PAGE = 21;

enum SortOptions {
  RATING_DESC = "High Rating",
  RATING_ASC = "Low Rating",
  DISTANCE = "Distance"
}

const DEFAULT_SORT = SortOptions.RATING_DESC;

*/

type Props = {
  widgets: Widget.T[];
};

export const WidgetList = (props: Props) => {
  // const [sort, setSort] = useState<SortOptions>(DEFAULT_SORT);
  // const [page, setPage] = useState<number>(1);
  return (
    <div className="widget-list-container">
      <div className="widget-list-controls">
        <h1>widgets</h1>
        {/*         <Select
          label="Sort By"
          outlined
          defaultValue={DEFAULT_SORT}
          options={[
            SortOptions.RATING_DESC,
            SortOptions.RATING_ASC,
            SortOptions.DISTANCE
          ]}
          value={sort}
          onChange={(event: any) =>
            setSort((event.target as HTMLInputElement).value as SortOptions)
          }
        />
        {sort === SortOptions.DISTANCE ? "" : <></>} */}
        <p>
          {props.widgets.length} widget{props.widgets.length > 1 ? "s" : ""}{" "}
          found
        </p>
      </div>
      <div className="widget-list-grid">
        {props.widgets
          //.slice(0, page * RESULTS_PER_PAGE)
          .map((widget) => (
            <WidgetCard key={widget.id} widget={widget} />
          ))}
        <Link key="new" to={`/add-widget`}>
          <div className="new-widget-button-container">
            <Button
              className="new-widget-button"
              label="new widget"
              icon="add"
              outlined
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
