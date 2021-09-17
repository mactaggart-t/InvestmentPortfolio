import React, {Component, useState} from 'react'
import './personalInv.css'
import Header from "../header/header";
import Button from "@material-ui/core/Button";
import {toast, ToastContainer} from "react-toastify";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {createAcct} from '../../actions/personalInv'
import {Redirect} from 'react-router-dom'

function CreateAccountForm(props) {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    function handleClick(username, password1, password2) {
        if (password1 !== password2) {
            toast.dismiss();
            toast.error("Error: Passwords don't match");
        }
        else if (password1 === '') {
            toast.dismiss();
            toast.error("Error: Passwords cannot be empty");
        }
        else {
            props.createAcct(username, password1, password2);
            if (props.duplicateAccount) {
                toast.dismiss();
                setTimeout(() => {  toast.error("Sorry: Username taken"); }, 500);
            }
        }
    }

    return (
        <div className={'loginBox'}>
            <form className={'loginForm'}>
                <input type="text" name="username" placeholder="Enter Username" className={'textInput'}
                value={username} onChange={(e) => setUsername(e.target.value)}/>
                <br/>
                <input type="password" name="password"  placeholder="Enter Password" className={'textInput'}
                value={password1} onChange={(e) => setPassword1(e.target.value)}/>
                <br/>
                <input type="password" name="password"  placeholder="Re-Enter Password" className={'textInput'}
                value={password2} onChange={(e) => setPassword2(e.target.value)}/>
            </form>
            <div className={'formButton'} style={{'margin-top': '15px'}}>
                <Button
                    style={{'text-transform': 'none',
                            'min-width': '250px'}}
                    variant="contained"
                    color="secondary" onClick={handleClick.bind(this, username, password1, password2)}>
                    Create Account</Button>
            </div>
        </div>
    );
}

CreateAccountForm.propTypes = {
    duplicateAccount: PropTypes.bool.isRequired,
    createAcct: PropTypes.func.isRequired,
};

class CreateAccount extends Component {
    render() {
        if (this.props.isLoggedIn) {
            return (
                <Redirect to="/personalInv" />
            );
        }
        return (
            <>
                <Header selected={'personalInv'}/>
                <div className="headerStyle">
                    <h1 id="headerText">Create a New Portfolio</h1>
                </div>
                <CreateAccountForm duplicateAccount={this.props.duplicateAccount} createAcct={this.props.createAcct}/>
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

CreateAccount.propTypes = {
    duplicateAccount: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    createAcct: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    duplicateAccount: state.personalInv.duplicateAccount,
    isLoggedIn: state.personalInv.isLoggedIn,
});

export default connect(mapStateToProps, {createAcct})(CreateAccount)