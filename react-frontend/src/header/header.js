import React from 'react'
import PropTypes from 'prop-types'
import './header.css'

function Header(selected) {
    return (
        <ul>
            <li><a href='personalInv' className={(selected === 'personalInv') ? "active": "inactive"}>Personal Investments</a></li>
            <li><a href = "s_and_p" className={(selected === 's_and_p') ? "active": "inactive"}> S & P 500 </a></li>
            <li><a href = "research" className={(selected === 'research') ? "active": "inactive"}> Research Securities </a></li>
            <li style = "float:right"> <a href = "about" className={(selected === 'about') ? "active": "inactive"}> About </a></li>
        </ul>
    );
}

Header.propTypes = {
    selected: PropTypes.string.isRequired,
};

export default Header