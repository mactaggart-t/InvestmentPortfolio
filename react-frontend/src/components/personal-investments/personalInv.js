import React, {Component} from "react";
import {connect} from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import Header from "../header/header";
import './personalInv.css'
import ChartOverview, {ChartSelector} from "./personalInvCharts";
import {changeView} from "../../actions/personalInv";

class PersonalInv extends Component {
    render() {
        if (!this.props.isLoggedIn) {
            return (<Redirect to='/personalInv/login'/>);
        }
        return (
            <>
                <Header selected={'personalInv'}/>
                <div className="headerStyle">
                    <h1 id="headerText">{"Hello " + this.props.username}</h1>
                </div>
                <ChartSelector changeView={this.props.changeView}/>
                <ChartOverview />
            </>
            );
    }
}

PersonalInv.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    changeView: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isLoggedIn: state.personalInv.isLoggedIn,
    username: state.personalInv.username,
});

export default connect(mapStateToProps, {changeView})(PersonalInv)