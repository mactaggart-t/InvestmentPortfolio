import './App.css';
import React, { Component } from 'react'
import About from './components/about/about'
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import PersonalInv from "./components/personal-investments/personalInv";
import research from "./components/research/research";
import sp500 from "./components/s-and-p/s_and_p";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
            <Route exact path="/">
                <Redirect to="/about" />
            </Route>
            <Route exact path="/about" component={About} />
            <Route exact path="/personalInv" component={PersonalInv} />
            <Route exact path="/research" component={research} />
            <Route exact path="/sp500" component={sp500} />
        </Switch>
      </Router>
    );
  }
}

export default App;
