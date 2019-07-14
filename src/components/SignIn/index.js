import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';

import './style.css';

const SignInPage = () => (
  <div>
    <SignInForm/>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  Аккаунт с таким е-mail уже сущетсвует.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push('/home');
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div className="login-form">
        <form onSubmit={this.onSubmit}>

          <div className="txtb">
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="E-mail"
            />
          </div>

          <div className="txtb">
            <input
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Пароль"
            />
          </div>

          <button disabled={isInvalid} type="submit" className="logbtn">
            Войти
          </button>
        </form>

        <span>
          <hr></hr>
        </span>

        <SignInGoogle/>

        <div className="signuplink">
          <SignUpLink/>
        </div>

      </div>


    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
        });
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push('/home');
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" className="logbtngogl">Войти с помощью Google</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

export default SignInPage;

export { SignInForm, SignInGoogle };
