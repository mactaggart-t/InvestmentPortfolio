import React from 'react'
import './s_and_p.css'
import Header from "../header/header";
import MarketCapTM from "./MarketCapTM";

function SP500() {
    return (
        <>
            <Header selected={'s_and_p'}/>
            <div className="headerStyle">
                <h1 id="headerText">S&P500</h1>
            </div>
            <MarketCapTM/>
        </>
    );
}

export default SP500