import React, { Component } from "react";
import { battle } from "../utils/api";
import Card from "./card";
import { PropTypes } from "prop-types";
import Loading from "./loading";

import {
  FaUser,
  FaUsers,
  FaCompass,
  FaBriefcase,
  FaUserFriends,
} from "react-icons/fa";

function ProfileList({ profile }) {
  return (
    <ul className="card-list">
      <li>
        <FaUser color="rgb(239, 115, 115)" size={22} />
        {profile.name}
      </li>
      {profile.location && (
        <li>
          <FaCompass color="rgb(144, 115, 255)" size={22} />
          {profile.location}
        </li>
      )}
      {profile.company && (
        <li>
          <FaBriefcase color="#795548" size={22} />
          {profile.company}
        </li>
      )}
      <li>
        <FaUsers color="rgb(129, 195, 245)" size={22} />
        {profile.followers.toLocaleString()} followers
      </li>
      <li>
        <FaUserFriends color="rgb(64, 183, 95)" size={22} />
        {profile.following.toLocaleString()} following
      </li>
    </ul>
  );
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired,
};

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { playerOne, playerTwo } = this.props;
    battle([playerOne, playerTwo])
      .then((results) =>
        this.setState({
          winner: results[0],
          loser: results[1],
          error: null,
          loading: false,
        })
      )
      .catch(({ message }) => {
        this.setState({ error: message, loading: false });
      });
  }
  render() {
    const { winner, loser, error, loading } = this.state;

    if (loading) {
      return <Loading text="Battling" />;
    }

    if (error) {
      return <p className="center-text error">{error}</p>;
    }

    return (
      <React.Fragment>
        <div className="grid space-around container-sm">
          <Card
            header={winner.score === loser.score ? "Tie" : "Winner"}
            subheader={`Score: ${winner.score.toLocaleString()}`}
            avatar={winner.profile.avatar_url}
            href={winner.profile.html_url}
            name={winner.profile.login}
          >
            <ProfileList profile={winner.profile} />
          </Card>
          <Card
            header={winner.score === loser.score ? "Tie" : "Loser"}
            subheader={`Score: ${loser.score.toLocaleString()}`}
            avatar={loser.profile.avatar_url}
            href={loser.profile.html_url}
            name={loser.profile.login}
          >
            <ProfileList profile={loser.profile} />
          </Card>
        </div>
        <button onClick={this.props.onReset} className="btn dark-btn btn-space">
          Reset
        </button>
      </React.Fragment>
    );
  }
}

Results.propTypes = {
  onReset: PropTypes.func.isRequired,
};

export default Results;
