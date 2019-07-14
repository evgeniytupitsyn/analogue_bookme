import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import SignOutButton from '../SignOut';

const Navigation = ({ authUser }) =>
  authUser ? (
    <NavigationAuth authUser={authUser} />
  ) : (
    <NavigationNonAuth />
  );

const NavigationAuth = ({ authUser }) => (
  <ul>
    <li>
      <Link to='/'>Стартовая страница</Link>
    </li>
    <li>
      <Link to='/home'>Информация о пользователе (необходима авторизация)</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to='/'>Стартовая страница</Link>
    </li>
    <li>
      <Link to='/home'>Информация о пользователе (необходима авторизация)</Link>
    </li>
    <li>
      <Link to='/signin'>Войти</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
