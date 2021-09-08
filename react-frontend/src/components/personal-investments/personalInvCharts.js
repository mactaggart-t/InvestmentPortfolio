import React, {Component, useEffect} from 'react';
import Select from "react-dropdown-select";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import './personalInv.css';
import PropTypes from "prop-types";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatXAxis} from "../../actions/chartingUtils";
import {getPortValue, getPurchases} from "../../actions/personalInv";
import Selectors from "./selectors";
import {ToastContainer, toast} from "react-toastify";

const CustomTooltip = (content) => {
    if (content.active && content.payload && content.payload.length) {
        if (content.type === '$') {
            return (
                <div className={'tooltipBackground'}>
                    <p>{formatXAxis(content.payload[0].payload.date)}</p>
                    <p>{`$${content.payload[0].payload.Value.toFixed(2)}`}</p>
                </div>
            );
        }
        else {
            return (
                <div className={'tooltipBackground'}>
                    <p>{formatXAxis(content.payload[0].payload.date)}</p>
                    <p>{`${content.payload[0].payload.Value.toFixed(2)}%`}</p>
                </div>
            )
        }
    }
    return null;
};

function PortBalance(props) {
    useEffect(() => {
        toast.dismiss();
        if (props.chartData.length === 0) {
            toast.success('Loading, please wait...');
        }
    });
    return (
        <>
            <h4 className="chartTitle">Portfolio Value</h4>
            <Selectors purchases={props.purchases}/>
            <ResponsiveContainer width="95%" height="60%">
                <LineChart
                  width={800}
                  data={props.formattedData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 30,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" label={{ value: "Date", dy: -27}} tickFormatter={formatXAxis} angle={45}  dy={25}/>
                  <YAxis label={{ value: (props.type === '$') ? "Price($)": "Change(%)", angle: -90, dx: 40 }}
                         tickFormatter={t => (props.type === '$') ? "$" + t : t + '%'}/>
                  <Tooltip content={<CustomTooltip type={props.type}/>} labelFormatter={t => new Date(t).toLocaleString().split(',')[0]}/>
                  <Line key="port" type="monotone" dataKey="Value" dot={false} />
                </LineChart>
            </ResponsiveContainer>
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

PortBalance.propTypes = {
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
};

function TransactionHist(props) {
    return (<></>);
}

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
            {key: 'Portfolio Diversification', value: 'Portfolio Diversification', label: 'Portfolio Diversification'}]
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
                <div className={'purchaseButton'}>
                    <Button
                        style={{'textTransform': 'none',
                                'minWidth': '250px'}}
                        variant="contained"
                        color="secondary"
                    >Add Purchase/Sale</Button>
                </div>
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
        }
        else {
            toast.dismiss();
        }
    }

    render() {
        if (this.props.selectedView === 'Portfolio Balance') {
            return (<PortBalance chartData={this.props.chartData}
                                 formattedData={this.props.formattedData}
                                 type={this.props.type}
                                 purchases={this.props.purchases}/>);
        }
        else if (this.props.selectedView === 'Transaction History') {
            return (<TransactionHist/>);
        }
        else if (this.props.selectedView === 'Individual Securities') {
            return (<IndSecurities/>)
        }
        else {
            return (<PortDiversity/>)
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
    getPortValue: PropTypes.func.isRequired,
    getPurchases: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    selectedView: state.personalInv.selectedView,
    username: state.personalInv.username,
    type: state.personalInv.type,
    chartData: state.personalInv.chartData,
    formattedData: state.personalInv.formattedData,
    purchases: state.personalInv.purchases,
});

export default connect(mapStateToProps, {getPortValue, getPurchases})(ChartOverview);