import React, {Component} from 'react';
import Select from "react-dropdown-select";
import {connect} from "react-redux";
import './personalInv.css';
import PropTypes from "prop-types";
import {
    addTransaction,
    getPortfolio, getPortfolioTickers,
    getPortValue,
    getPurchases, getTransactHist, loadPortDiversity, resetLoaded, submitSelectedTickers,
    transactionSubmission
} from "../../actions/personalInv";
import {TransactionForm} from './purchaseLogging';
import {PortBalance} from './portBalance'
import {IndSecurities} from './indSecurities'
import DataGrid from "./dataGridTemplate";
import {toast} from "react-toastify";
import {PortDiversity} from "./portDiversity";

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
        } else {
            toast.dismiss();
        }
        if (this.props.transactHist.length === 0) {
            this.props.getTransactHist(this.props.username);
        }
        if (this.props.chartDataInd.length === 0) {
            this.props.getPortfolioTickers(this.props.username);
        }
        if (this.props.secDivData.length === 0) {
            this.props.loadPortDiversity(this.props.username);
        }
    }

    render() {
        switch (this.props.selectedView) {
            case "Portfolio Balance":
                return (<PortBalance chartData={this.props.chartData}
                                     formattedData={this.props.formattedData}
                                     type={this.props.type}
                                     purchases={this.props.purchases}
                                     data={this.props.portfolioDatagrid} time={this.props.time}/>);
            case "Transaction History":
                return (<TransactionHist transactHist={this.props.transactHist}/>);
            case "Individual Securities":
                return (<IndSecurities selected={this.props.selected} type={this.props.typeInd} time={this.props.timeInd}
                           chartData={this.props.chartDataInd} formattedData={this.props.formattedDataInd}
                           items={this.props.items} submitSelectedTickers={this.props.submitSelectedTickers}
                                       loadedInd={this.props.loadedInd} resetLoaded={this.props.resetLoaded}/>);
            case "Portfolio Diversification":
                return (<PortDiversity secDivData={this.props.secDivData} sectorDivData={this.props.sectorDivData}/>);
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
    time: PropTypes.string.isRequired,
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
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeInd: PropTypes.string.isRequired,
    timeInd: PropTypes.string.isRequired,
    chartDataInd: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    formattedDataInd: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    loadedInd: PropTypes.bool.isRequired,
    secDivData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    sectorDivData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    submitSelectedTickers: PropTypes.func.isRequired,
    getPortValue: PropTypes.func.isRequired,
    getPurchases: PropTypes.func.isRequired,
    getPortfolio: PropTypes.func.isRequired,
    addTransaction: PropTypes.func.isRequired,
    transactionSubmission: PropTypes.func.isRequired,
    getTransactHist: PropTypes.func.isRequired,
    getPortfolioTickers: PropTypes.func.isRequired,
    loadPortDiversity: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    selectedView: state.personalInv.selectedView,
    username: state.personalInv.username,
    type: state.personalInv.type,
    time: state.personalInv.time,
    chartData: state.personalInv.chartData,
    formattedData: state.personalInv.formattedData,
    purchases: state.personalInv.purchases,
    portfolioDatagrid: state.personalInv.portfolioDatagrid,
    transactionResponse: state.personalInv.transactionResponse,
    transactionSubmitting: state.personalInv.transactionSubmitting,
    transactHist: state.personalInv.transactHist,
    selected: state.personalInv.selected,
    typeInd: state.personalInv.typeInd,
    timeInd: state.personalInv.timeInd,
    chartDataInd: state.personalInv.chartDataInd,
    formattedDataInd: state.personalInv.formattedDataInd,
    items: state.personalInv.items,
    loadedInd: state.personalInv.loadedInd,
    secDivData: state.personalInv.secDivData,
    sectorDivData: state.personalInv.sectorDivData,
});

export default connect(mapStateToProps, {getPortValue, getPurchases, getPortfolio,
    addTransaction, transactionSubmission, getTransactHist, getPortfolioTickers,
    submitSelectedTickers, resetLoaded, loadPortDiversity})(ChartOverview);