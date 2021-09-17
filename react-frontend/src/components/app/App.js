import React, { Component } from 'react'
import About from '../about/about'
import { BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import { Provider } from 'react-redux';
import PersonalInv from "../personal-investments/personalInv";
import research from "../research/research";
import sp500 from "../s-and-p/s_and_p";
import CreateAccount from "../personal-investments/createAccount";
import store from '../../store/index'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import PersonalInvLogin from "../personal-investments/personalInvLogin";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#6fbf73',
      main: '#4caf50',
      dark: '#357a38',
      contrastText: '#fff',
    },
  },
});

class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <Router>
                        <Switch>
                            <Route exact path="/">
                                <Redirect to="/about" />
                            </Route>
                            <Route exact path="/about" component={About} />
                            <Route exact path="/personalInv" component={PersonalInv} />
                            <Route exact path="/personalInv/createAccount" component={CreateAccount} />
                            <Route exact path="/personalInv/login" component={PersonalInvLogin} />
                            <Route exact path="/research" component={research} />
                            <Route exact path="/sp500" component={sp500} />
                        </Switch>
                      </Router>
                </Provider>
            </ThemeProvider>
        );
    }
}

export default App;
