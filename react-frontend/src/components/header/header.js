import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from "react-redux";
import {logout} from '../../actions/personalInv'
import './header.css'

function Header(props) {
    if (props.isLoggedIn) {
        return (
            <ul className={'header'}>
                <li className={'header'}><Link className={(props.selected === 'personalInv') ? "active": "inactive"} to='/personalInv'>
                    Personal Investments
                </Link></li>
                <li className={'header'}><Link className={(props.selected === 's_and_p') ? "active": "inactive"} to='/sp500'>
                    S&P500
                </Link></li>
                <li className={'header'}><Link className={(props.selected === 'research') ? "active": "inactive"} to='/research'>
                    Research Securities
                </Link></li>
                <li className={'header'} style={{ float: 'right' }}>
                    <Link className={(props.selected === 'about') ? "active": "inactive"} to='/about'>About
                </Link></li>
                <li className={'header'} style={{ float: 'right' }} onClick={() => props.logout()}>
                    <Link className="inactive" to="/personalInv/login">Sign Out
                </Link></li>
            </ul>
        );
    }
    return (
        <ul className={'header'}>
            <li className={'header'}><Link className={(props.selected === 'personalInv') ? "active": "inactive"} to='/personalInv'>
                Personal Investments
            </Link></li>
            <li className={'header'}><Link className={(props.selected === 's_and_p') ? "active": "inactive"} to='/sp500'>
                S&P500
            </Link></li>
            <li className={'header'}><Link className={(props.selected === 'research') ? "active": "inactive"} to='/research'>
                Research Securities
            </Link></li>
            <li className={'header'} style={{ float: 'right' }}>
                <Link className={(props.selected === 'about') ? "active": "inactive"} to='/about'>About
            </Link></li>
        </ul>
    );
}

Header.propTypes = {
    selected: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isLoggedIn: state.personalInv.isLoggedIn,
});

export default connect(mapStateToProps, {logout})(Header)