import React from "react";
import { match } from "react-router";
import { School } from "@huckleberry/schools";
import { SchoolService } from "../../../services";

type Props = {
  match: match<{ id: string }>;
};
type State = {
  school: School | undefined;
};

export class SchoolDetail extends React.Component<Props, State> {
  private schoolService: SchoolService = new SchoolService();
  constructor(props: Props) {
    super(props);

    this.state = {
      school: undefined
    };
  }
  async componentDidMount() {
    const school = await this.schoolService.getById(this.props.match.params.id);
    this.setState({ school });
  }
  render() {
    const { school } = this.state;
    if (school) {
      return (
        <div>
          <div>
            <h1>{school.name}</h1>
            <h2>{school.type}</h2>
            <p>{school.status}</p>
            <p>{school.rating}</p>
            <p>{school.province}</p>
            <p>{school.address}</p>
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}
