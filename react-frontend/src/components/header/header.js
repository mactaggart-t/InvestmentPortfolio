import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './header.css'

function Header(props) {
    return (
        <ul>
            <li><Link className={(props.selected === 'personalInv') ? "active": "inactive"} to='/personalInv'>
                Personal Investments
            </Link></li>
            <li><Link className={(props.selected === 's_and_p') ? "active": "inactive"} to='/sp500'>
                S&P500
            </Link></li>
            <li><Link className={(props.selected === 'research') ? "active": "inactive"} to='/research'>
                Research Securities
            </Link></li>
            <li style={{ float: 'right' }}>
                <Link className={(props.selected === 'about') ? "active": "inactive"} to='/about'>About
            </Link></li>
        </ul>
    );
}

Header.propTypes = {
    selected: PropTypes.string.isRequired,
};

export default Header