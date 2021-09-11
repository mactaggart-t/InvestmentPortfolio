import React, {useEffect} from 'react'
import Button from "@material-ui/core/Button";
import {TextField, RadioGroup, FormControlLabel, Radio, InputAdornment} from "@material-ui/core";
import { useFormik } from 'formik';
import * as yup from 'yup';
import './personalInv.css';
import PropTypes from "prop-types";
import {ToastContainer, toast} from "react-toastify";

export function TransactionForm(props) {
    useEffect(() => {
        if (props.transactionSubmitting) {
            switch (props.transactionResponse) {
                case 'no sample':
                    toast.dismiss();
                    toast.error('Error: you cannot change the sample account');
                    props.transactionSubmission('complete');
                    break;
                case 'no exist':
                    toast.dismiss();
                    toast.error('Error: that ticker does not exist');
                    props.transactionSubmission('complete');
                    break;
                case 'bad sell':
                    toast.dismiss();
                    toast.error('Error: you cannot sell more than you own');
                    props.transactionSubmission('complete');
                    break;
                case '':
                    break;
                default:
                    toast.dismiss();
                    toast.success('Successfully logged transaction', {autoClose: 5000});
                    props.transactionSubmission('complete');
            }
        }
    });

    const validationSchema = yup.object({
        ticker: yup
            .string('Enter a ticker')
            .required('Ticker is required'),
        price: yup
            .number('Enter a price')
            .moreThan(0, 'Price must be greater than $0')
            .required('Price is required'),
        shares: yup
            .number('Enter number of shares')
            .moreThan(0, 'Number of shares must be greater than 0')
            .required('Number of shares is required'),
        transactDate: yup
            .date('Select a date')
            .min(new Date('01-01-2000'), 'Please select a date after Jan 1 2000')
            .max(new Date(), 'Please select a date in the past or present')
    });

    const formik = useFormik({
    initialValues: {
        ticker: '',
        price: 0.01,
        shares: 0,
        buyOrSell: 'Buy',
        transactDate: new Date(),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        toast.dismiss();
        toast.success('Loading, please wait...');
        props.transactionSubmission('starting');
        props.addTransaction(props.username, values.ticker, values.buyOrSell,
            values.price, values.shares, values.transactDate);
    }});

    return (
        <>
            <div className={'purchaseBox'}>
                <form onSubmit={formik.handleSubmit} className={'loginForm'}>
                    <div className={'purchaseInput'}>
                        <TextField fullWidth id="ticker" label="Enter Ticker" variant="outlined"
                                   value={formik.values.ticker} onChange={formik.handleChange}
                                   error={formik.touched.ticker && Boolean(formik.errors.ticker)}
                                   helperText={formik.touched.ticker && formik.errors.ticker}/>
                    </div>
                    <RadioGroup row aria-label="buyOrSell" name="buyOrSell" style={{'display': 'inline-block'}}
                                value={formik.values.buyOrSell} onChange={formik.handleChange}
                                defaultValue='Buy'>
                        <div className={'purchaseRadio'}>
                            <FormControlLabel value='Buy' control={<Radio />} label="Buy"/>
                            <FormControlLabel value='Sell' control={<Radio />} label="Sell"/>
                        </div>
                    </RadioGroup>
                    <div className={'purchaseInput'}>
                        <TextField fullWidth id="price" label="Enter Price (USD)" variant="outlined" type='number'
                                   value={formik.values.price} onChange={formik.handleChange}
                                   error={formik.touched.price && Boolean(formik.errors.price)}
                                   helperText={formik.touched.price && formik.errors.price}
                        InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>, step: 0.01}}/>
                    </div>
                    <div className={'purchaseInput'}>
                        <TextField fullWidth id="shares" label="Enter Number of Shares" variant="outlined" type='number'
                                   value={formik.values.shares} onChange={formik.handleChange}
                                   error={formik.touched.shares && Boolean(formik.errors.shares)}
                                   helperText={formik.touched.shares && formik.errors.shares}
                        InputProps={{step: 1}}/>
                    </div>
                    <div className={'purchaseInput'}>
                        <TextField fullWidth id="transactDate" label="Enter Date of Transaction" variant="outlined" type='date'
                                   onChange={formik.handleChange} InputLabelProps={{shrink: true,}}
                                   error={formik.touched.transactDate && Boolean(formik.errors.transactDate)}
                                   helperText={formik.touched.transactDate && formik.errors.transactDate}/>
                    </div>
                    <div className={'formButton'} style={{'marginTop': '15px'}}>
                        <Button
                            style={{'textTransform': 'none',
                                    'minWidth': '250px'}}
                            variant="contained"
                            color="secondary" type='submit'>Confirm</Button>
                    </div>
                </form>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={false}
                hideProgressBar={true}
                draggable
                pauseOnHover
                />
        </>
    );
}

TransactionForm.propTypes = {
    username: PropTypes.string.isRequired,
    transactionResponse: PropTypes.string.isRequired,
    transactionSubmitting: PropTypes.bool.isRequired,
    addTransaction: PropTypes.func.isRequired,
    transactionSubmission: PropTypes.func.isRequired,
};