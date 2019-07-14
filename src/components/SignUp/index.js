import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';

import './style.css';
import { SignInGoogle } from '../SignIn';

const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  Аккаунт с таким е-mail уже сущетсвует.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <div className="sugnup-form">
        <form onSubmit={this.onSubmit}>
          <div className="txtb">
            <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="ФИО пользователя"
            />
          </div>

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
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="Пароль"
              />
            </div>

            <div className="txtb">
              <input
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Подтвердите пароль"
              />
            </div>

          <div>
            <button disabled={isInvalid} type="submit" className="logbtngogl">
              Зарегистрироваться
            </button>
          </div>

          {error && <p>{error.message}</p>}
        </form>

      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Создать аккаунт? <Link to='/signup'>Зарегистрироваться</Link>
  </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };
