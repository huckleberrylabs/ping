import React, { Component } from "react";
import Fuse from "fuse.js";

import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/menu/dist/mdc.menu.css";
import "@material/menu-surface/dist/mdc.menu-surface.css";
import "@material/list/dist/mdc.list.css";

import { TextField } from "@rmwc/textfield";
import { MenuSurfaceAnchor, MenuSurface } from "@rmwc/menu";

import { GoogleService, SchoolService } from "../../../services";
import { School, SearchResult } from "@huckleberry/schools";
import { SearchResultList } from "../result-list";
import "./style.css";

const MIN_INPUT_LENGTH = 2;

const SCHOOL_SEARCH_OPTIONS: Fuse.FuseOptions<School> = {
  shouldSort: true,
  matchAllTokens: true,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name", "address", "status", "type", "province"],
};
const COMBINED_SEARCH_OPTIONS: Fuse.FuseOptions<SearchResult> = {
  shouldSort: true,
  matchAllTokens: false,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  // @ts-ignore
  keys: ["name", "address", "description"],
};

type Props = {};
type State = {
  showResults: boolean;
  results: SearchResult[] | undefined;
  inputValue: string;
  schools: School[];
};

export class SearchBar extends Component<Props, State> {
  private schoolService: SchoolService = new SchoolService();
  private googleService: GoogleService = new GoogleService();
  constructor(props: Props) {
    super(props);
    this.state = {
      showResults: false,
      results: undefined,
      inputValue: "",
      schools: [],
    };
  }
  async componentDidMount() {
    const schools = await this.schoolService.getAll();
    this.setState({ schools });
  }
  get shouldGetResults(): boolean {
    return (
      this.state.inputValue.trim() !== "" &&
      this.state.inputValue.length > MIN_INPUT_LENGTH
    );
  }
  onClose = () => {
    this.setState({ showResults: false });
  };
  onFocus = () => {
    this.setState({ showResults: true });
  };
  onBlur = () => {
    this.setState({ showResults: false });
  };
  onClickClear = () => {
    this.setState({ inputValue: "", results: undefined });
  };
  onInputChange = async (input: string): Promise<void> => {
    this.setState({ inputValue: input });
  };
  getResults = async (input: string): Promise<void> => {
    const schoolFuse: Fuse<School, Fuse.FuseOptions<School>> = new Fuse(
      this.state.schools,
      SCHOOL_SEARCH_OPTIONS
    );
    const schoolResults = schoolFuse.search(input);
    const googleResults: SearchResult[] = [];
    try {
      googleResults.push(
        ...(await this.googleService.autoCompleteAddress(input))
      );
    } catch (error) {
      console.log(error);
    }
    const results: SearchResult[] = [
      ...schoolResults.slice(0, 5),
      ...googleResults.slice(0, 5),
    ];
    const combinedFuse: Fuse<
      SearchResult,
      Fuse.FuseOptions<SearchResult>
    > = new Fuse(results, COMBINED_SEARCH_OPTIONS);
    const combinedResults = combinedFuse.search(input);
    this.setState({ results: combinedResults });
  };
  render() {
    if (this.shouldGetResults) {
      this.getResults(this.state.inputValue);
    }
    return (
      <>
        <MenuSurfaceAnchor className="drop-down-anchor">
          <MenuSurface
            anchorCorner={"bottomLeft"}
            open={this.shouldGetResults}
            onClose={this.onClose}
          >
            <SearchResultList
              results={this.state.results}
              onSelect={this.onClose}
            />
          </MenuSurface>
        </MenuSurfaceAnchor>
        <TextField
          className="text-field"
          icon="search"
          trailingIcon={
            this.state.inputValue.trim() != ""
              ? {
                  icon: "clear",
                  onClick: this.onClickClear,
                }
              : { icon: "" }
          }
          id="school-search"
          placeholder="Search by school or address"
          value={this.state.inputValue}
          // @ts-ignore
          onChange={async evt => this.onInputChange(evt.target.value)}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </>
    );
  }
}
