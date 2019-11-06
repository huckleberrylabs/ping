import React /* , { useState } */ from "react";
// import { Select } from "@rmwc/select";
import { WidgetSummary } from "../summary";
import { Button } from "@rmwc/button";
import "@material/select/dist/mdc.select.css";
import "@material/button/dist/mdc.button.css";
import "./style.css";
import { Widget } from "@huckleberryai/ping";
import { Link } from "react-router-dom";

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
      <div className="controls">
        <h1>Widgets</h1>
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
        <p style={{ color: "grey" }}>{props.widgets.length} Widgets Found</p>
      </div>
      <div className="grid">
        {props.widgets
          //.slice(0, page * RESULTS_PER_PAGE)
          .map(widget => (
            <WidgetSummary key={widget.id} widget={widget} />
          ))}
        <Link key="new" to={`/add-widget`}>
          <div className="new-widget-button-container">
            <Button
              className="new-widget-button"
              label="New Widget"
              icon="add"
              outlined
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
