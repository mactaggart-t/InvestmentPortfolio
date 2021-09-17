import {CustomTooltip, formatXAxis} from "../../actions/chartingUtils";
import React, {useEffect} from "react";
import {toast, ToastContainer} from "react-toastify";
import Selectors from "./selectors";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import DataGrid from "./dataGridTemplate";
import PropTypes from "prop-types";

const columns = [
  {
    field: "Company",
    title: "Company",
  }, {
    field: "Ticker",
    title: "Ticker"
  }, {
    field: "PurchasePrice",
    title: "Purchase Price",
    type: 'currency'
  }, {
    field: "Shares",
    title: "Shares",
    type: 'numeric'
  }, {
    field: "CurrentPrice",
    title: "Current Price",
    type: 'currency'
  }, {
    field: "MarketValue",
    title: "Market Value",
    type: 'currency'
  }, {
    field: "Gain$",
    title: "Gain $",
    type: 'currency'
  }, {
    field: "Gain%",
    title: "Gain %",
    customSort: (a, b) => parseFloat(a['Gain%'].replace('%', '')) - parseFloat(b['Gain%'].replace('%', ''))

  }
];

export function PortBalance(props) {
    useEffect(() => {
        toast.dismiss();
        if (props.chartData.length === 0) {
            toast.success('Loading, please wait...');
        }
    });
    return (
        <>
            <h4 className="chartTitle">Portfolio Value</h4>
            <Selectors time={props.time} type={props.type} chartData={props.chartData} purchases={props.purchases}
                       chartType={'portfolio'}/>
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
            <DataGrid columns={columns} data={props.data} title={'Portfolio'}/>
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
    data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};