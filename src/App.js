import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoggedIn from './layouts/LoggedIn';
import Home from './layouts/Home';
import Signup from './layouts/Signup';
import Signin from './layouts/Signin';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route path='/' component={Home} exact />
            <Route path='/signup' component={Signup} exact />
            <Route path='/home' component={LoggedIn} exact />
            <Route path='/login' component={Signin} exact />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
