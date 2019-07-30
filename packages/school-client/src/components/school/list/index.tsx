import React from "react";
import { Select } from "@rmwc/select";
import { School } from "@huckleberry/schools";
import { SchoolSummary } from "../summary";
import { Button } from "@rmwc/button";
import "@material/select/dist/mdc.select.css";
import "@material/button/dist/mdc.button.css";
import "./style.css";

const RESULTS_PER_PAGE = 21;

enum SortOptions {
  RATING_DESC = "High Rating",
  RATING_ASC = "Low Rating",
  DISTANCE = "Distance",
}

type Props = {
  schools: School[];
};
type State = {
  sort: SortOptions;
  page: number;
};

export class SchoolList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sort: SortOptions.RATING_DESC,
      page: 1,
    };
  }
  onClickLoadMore = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        page: prevState.page + 1,
      };
    });
  };
  onChangeSort = (sort: SortOptions) => {
    this.setState({ sort });
  };
  render() {
    return (
      <div className="school-list-container">
        <div className="controls">
          <Select
            label="Sort By"
            outlined
            defaultValue={SortOptions.RATING_DESC}
            options={[
              SortOptions.RATING_DESC,
              SortOptions.RATING_ASC,
              SortOptions.DISTANCE,
            ]}
            value={this.state.sort}
            // @ts-ignore
            onChange={evt => this.onChangeSort(evt.target.value)}
          />
          {this.state.sort === SortOptions.DISTANCE ? "" : <></>}
          <p style={{ color: "grey" }}>
            {this.props.schools.length} Results Found
          </p>
        </div>
        <div className="grid">
          {this.props.schools
            .slice(0, this.state.page * RESULTS_PER_PAGE)
            .map(school => (
              <SchoolSummary key={school.id} school={school} />
            ))}
        </div>

        <div className="load-more-button-container">
          <Button
            className="load-more-button"
            label="Load More"
            outlined
            onClick={this.onClickLoadMore}
          />
        </div>
      </div>
    );
  }
}
