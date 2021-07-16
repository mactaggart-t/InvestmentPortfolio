import React, { Component } from 'react'
import About from '../about/about'
import { BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import { Provider } from 'react-redux';
import PersonalInv from "../personal-investments/personalInv";
import research from "../research/research";
import sp500 from "../s-and-p/s_and_p";
import store from '../../store/index'

class App extends Component {
    render() {
        return (
            <Provider store={store}>
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
            </Provider>
        );
    }
}

export default App;
