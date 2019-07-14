import { compose } from 'recompose';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Navigation from '../Navigation';


class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.user) {
      this.setState({ loading: true });
    }

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.props.onSetUser(
          snapshot.val(),
          this.props.match.params.id,
        );

        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  render() {
    const { user } = this.props;

    return (
      <div>
        <div>
          <Navigation />
          <hr />
        </div>

        <h2>User ({this.props.match.params.id})</h2>

        {user && (
          <div>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
          </div>
        )}
      </div>
    );
  }
}

const condition = authUser => !authUser;

const mapStateToProps = (state, props) => ({
  user: (state.userState.users || {})[props.match.params.id],
});

const mapDispatchToProps = dispatch => ({
  onSetUser: (user, uid) => dispatch({ type: 'USER_SET', user, uid }),
});

export default compose(
  withAuthorization(condition),
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HomePage);
