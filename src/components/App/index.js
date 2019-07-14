import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';

import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <Route exact path='/' component={SignInPage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/home' component={HomePage} />
      <Route path='/signin' component={SignInPage} />
    </div>
  </Router>
);

export default withAuthentication(App);
