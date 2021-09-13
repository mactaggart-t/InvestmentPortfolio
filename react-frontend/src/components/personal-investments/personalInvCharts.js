import React, {Component} from 'react';
import Select from "react-dropdown-select";
import {connect} from "react-redux";
import './personalInv.css';
import PropTypes from "prop-types";
import {
    addTransaction,
    getPortfolio,
    getPortValue,
    getPurchases, getTransactHist,
    transactionSubmission
} from "../../actions/personalInv";
import {TransactionForm} from './purchaseLogging';
import {PortBalance} from './portBalance'
import DataGrid from "./dataGridTemplate";
import {toast} from "react-toastify";

const transactHistCols = [
  {
    field: "Company",
    title: "Company",
  }, {
    field: "Ticker",
    title: "Ticker"
  }, {
    field: "PurchaseOrSale",
    title: "Purchase Or Sale",
  }, {
    field: "PurchaseOrSalePrice",
    title: "Purchase Or Sale Price",
    type: 'currency'
  }, {
    field: "Shares",
    title: "Shares",
    type: 'numeric'
  }, {
    field: "PurchaseOrSaleDate",
    title: "Purchase Or Sale Date",
    type: 'date'
  },
];

function TransactionHist(props) {
    return (
        <>
            <h4 className="chartTitle">Transaction History</h4>
            <DataGrid style={{position: 'relative'}} columns={transactHistCols} data={props.transactHist} title={''}/>
        </>);
}

TransactionHist.propTypes = {
    transactHist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

function IndSecurities(props) {
    return (<></>);
}

function PortDiversity(props) {
    return (<></>);
}

export class ChartSelector extends Component {
    constructor(props) {
        super(props);
        this.options = [
            {key: 'Portfolio Balance', value: 'Portfolio Balance', label: 'Portfolio Balance'},
            {key: 'Transaction History', value: 'Transaction History', label: 'Transaction History'},
            {key: 'Individual Securities', value: 'Individual Securities', label: 'Individual Securities'},
            {key: 'Portfolio Diversification', value: 'Portfolio Diversification', label: 'Portfolio Diversification'},
            {key: 'Add Purchase/Sale', value: 'Add Purchase/Sale', label: 'Add Purchase/Sale'}]
    }
    render() {
        return (
            <>
                <Select
                    options={this.options}
                    values={[{key: 'Portfolio Balance', value: 'Portfolio Balance', label: 'Portfolio Balance'}]}
                    onChange={(value) => this.props.changeView(value)}
                    className={'viewSelector'}
                />
                <div className={'placeholderDiv'}/>
            </>
        );
    }
}

ChartSelector.PropType = {
    changeView: PropTypes.func.isRequired,
};

class ChartOverview extends Component{
    componentDidMount() {
        if (this.props.chartData.length === 0) {
            this.props.getPortValue(this.props.username);
            this.props.getPurchases(this.props.username);
            this.props.getPortfolio(this.props.username);
            this.props.getTransactHist(this.props.username);
        }
        else {
            toast.dismiss();
        }
    }

    render() {
        switch (this.props.selectedView) {
            case "Portfolio Balance":
                return (<PortBalance chartData={this.props.chartData}
                                     formattedData={this.props.formattedData}
                                     type={this.props.type}
                                     purchases={this.props.purchases}
                                     data={this.props.portfolioDatagrid}/>);
            case "Transaction History":
                return (<TransactionHist transactHist={this.props.transactHist}/>);
            case "Individual Securities":
                return (<IndSecurities/>);
            case "Portfolio Diversification":
                return (<PortDiversity/>);
            default:
                return (<TransactionForm addTransaction={this.props.addTransaction}
                                         transactionResponse={this.props.transactionResponse}
                                         username={this.props.username}
                                         transactionSubmission={this.props.transactionSubmission}
                                         transactionSubmitting={this.props.transactionSubmitting}/>);
        }
    }
}

ChartOverview.PropType = {
    selectedView: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    chartData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    formattedData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    purchases: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    portfolioDatagrid: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    transactionResponse: PropTypes.string.isRequired,
    transactionSubmitting: PropTypes.bool.isRequired,
    transactHist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    getPortValue: PropTypes.func.isRequired,
    getPurchases: PropTypes.func.isRequired,
    getPortfolio: PropTypes.func.isRequired,
    addTransaction: PropTypes.func.isRequired,
    transactionSubmission: PropTypes.func.isRequired,
    getTransactHist: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    selectedView: state.personalInv.selectedView,
    username: state.personalInv.username,
    type: state.personalInv.type,
    chartData: state.personalInv.chartData,
    formattedData: state.personalInv.formattedData,
    purchases: state.personalInv.purchases,
    portfolioDatagrid: state.personalInv.portfolioDatagrid,
    transactionResponse: state.personalInv.transactionResponse,
    transactionSubmitting: state.personalInv.transactionSubmitting,
    transactHist: state.personalInv.transactHist,
});

export default connect(mapStateToProps,
    {getPortValue, getPurchases, getPortfolio, addTransaction, transactionSubmission, getTransactHist})(ChartOverview);