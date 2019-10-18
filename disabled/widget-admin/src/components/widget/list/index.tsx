import React from "react";
// import { Select } from "@rmwc/select";
import { WidgetSummary } from "../summary";
import { Button } from "@rmwc/button";
import "@material/select/dist/mdc.select.css";
import "@material/button/dist/mdc.button.css";
import "./style.css";
import { IWidgetSettings } from "@huckleberryai/widget";
import { Link } from "react-router-dom";

// const RESULTS_PER_PAGE = 21;

/* enum SortOptions {
  RATING_DESC = "High Rating",
  RATING_ASC = "Low Rating",
  DISTANCE = "Distance"
} */

type Props = {
  widgets: IWidgetSettings[];
};
type State = {
  //  sort: SortOptions;
  page: number;
};

export class WidgetList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // sort: SortOptions.RATING_DESC,
      page: 1
    };
  }
  /* onChangeSort = (sort: SortOptions) => {
    this.setState({ sort });
  }; */
  render() {
    return (
      <div className="widget-list-container">
        <div className="controls">
          <h1>Widgets</h1>
          {/* 
          <Select
            label="Sort By"
            outlined
            defaultValue={SortOptions.RATING_DESC}
            options={[
              SortOptions.RATING_DESC,
              SortOptions.RATING_ASC,
              SortOptions.DISTANCE
            ]}
            value={this.state.sort}
            // @ts-ignore
            onChange={evt => this.onChangeSort(evt.target.value)}
          />
          {this.state.sort === SortOptions.DISTANCE ? "" : <></>} */}
          <p style={{ color: "grey" }}>
            {this.props.widgets.length} Widgets Found
          </p>
        </div>
        <div className="grid">
          {this.props.widgets
            //.slice(0, this.state.page * RESULTS_PER_PAGE)
            .map(widget => (
              <WidgetSummary key={widget.id} widget={widget} />
            ))}
          <Link key="new" to={`/new-widget`}>
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
  }
}
