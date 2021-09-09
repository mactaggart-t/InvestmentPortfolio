import React, {useEffect, useState} from 'react'
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import './personalInv.css';

export function TransactionForm(props) {
    const [ticker, setTicker] = useState('');
    // const [buySell, setBuySell] = useState('Buy');
    const [price, setPrice] = useState(0.00);
    // const [shares, setShares] = useState(0);
    // const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (props.loginFailed) {
            toast.dismiss();
            toast.error("Error: Incorrect Username or Password");
        }
    });

    return (
        <div className={'loginBox'}>
            <form className={'loginForm'}>
                <input type="text" name="ticker" placeholder="Enter Ticker" className={'textInput'}
                       value={ticker}
                       onChange={(e) => setTicker(e.target.value)}/>
                <br/>
                <input type="text" name="price" placeholder="Enter Price" className={'textInput'}
                       value={price}
                       onChange={(e) => setPrice(e.target.value)}/>
            </form>
            <div className={'formButton'} style={{'marginTop': '15px'}}>
                <Button
                    style={{'textTransform': 'none',
                            'minWidth': '250px'}}
                    variant="contained"
                    color="secondary" onClick={console.log(ticker)}>Confirm</Button>
            </div>
        </div>
    );
}