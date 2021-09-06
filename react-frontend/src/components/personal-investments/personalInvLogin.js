import React, {Component, useState} from 'react'
import './personalInv.css'
import Header from "../header/header";
import Button from '@material-ui/core/Button';
import {Link, Redirect} from 'react-router-dom'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginFunc} from '../../actions/personalInv'
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function handleClick(username, password) {
        await props.loginFunc(username, password);
        if (props.loginFailed) {
            toast.dismiss();
            setTimeout(() => {  toast.error("Error: Incorrect Username or Password"); }, 500);

        }
    }

    return (
        <div className={'loginBox'}>
            <form className={'loginForm'}>
                <input type="text" name="username" placeholder="Enter Username" className={'textInput'}
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}/>
                <br/>
                <input type="password" name="password" placeholder="Enter Password" className={'textInput'}
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
            </form>
            <div className={'formButton'} style={{'marginTop': '15px'}}>
                <Button
                    style={{'textTransform': 'none',
                            'minWidth': '250px'}}
                    variant="contained"
                    color="secondary" onClick={handleClick.bind(this, username, password)}>Sign In</Button>
            </div>
            <div className={'formButton'}>
                <Link to={'/personalInv/createAccount'} style={{'textDecoration': 'none'}}>
                    <Button
                        style={{'textTransform': 'none',
                                'minWidth': '250px'}}
                        variant="contained"
                        color="secondary"
                    >Create Account</Button>
                </Link>
            </div>
            <div className={'formButton'}>
                <Button
                    style={{'textTransform': 'none',
                            'minWidth': '250px'}}
                    variant="contained"
                    color="secondary" onClick={handleClick.bind(this, 'Sample', 'pass')}>View Sample Account</Button>
            </div>
        </div>
    );
}

LoginForm.propTypes = {
    loginFunc: PropTypes.func.isRequired,
    loginFailed: PropTypes.bool.isRequired,
};

class PersonalInvLogin extends Component {

    render() {
        if (this.props.isLoggedIn) {
            return (<Redirect to='/personalInv'/>)
        }
        return (
            <>
                <Header selected={'personalInv'}/>
                <div className="headerStyle">
                    <h1 id="headerText">Log In to View Portfolio Analysis</h1>
                </div>
                <LoginForm loginFunc={this.props.loginFunc} loginFailed={this.props.loginFailed}/>
                <ToastContainer
                position="bottom-center"
                autoClose={false}
                hideProgressBar={true}
                draggable
                pauseOnHover/>
            </>
        );
    }
}

PersonalInvLogin.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    loginFailed: PropTypes.bool.isRequired,
    loginFunc: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isLoggedIn: state.personalInv.isLoggedIn,
    loginFailed: state.personalInv.loginFailed,
});

export default connect(mapStateToProps, {loginFunc})(PersonalInvLogin)