import {ResponsiveContainer, Treemap, Tooltip} from "recharts";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getTreemapData} from '../../actions/s_and_p'
import './s_and_p.css'
import React, {Component} from "react";
import {toast, ToastContainer} from "react-toastify";
import Selectors from "./selectors";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].payload) {
        if (payload[0].payload.fullName) {
            return (
                <div style={{'backgroundColor': 'white', 'padding': '5px'}}>
                    <p>{`${payload[0].payload.fullName} : $${payload[0].value/1000000000}B`}</p>
                </div>
            );
        }
        if (payload[0].payload.name) {
            return (
                <div style={{'backgroundColor': 'white', 'padding': '5px'}}>
                    <p>{`${payload[0].payload.name} : $${payload[0].value/1000000000}B`}</p>
                </div>
            );
        }
    }
    return null;
};

class MarketCapTM extends Component {
    componentDidMount() {
        setTimeout(function() {
            toast.success("Loading, please wait");
        }, 0);
        this.props.getTreemapData();
    }

    render() {
        if (Object.keys(this.props.chartData).length !== 0) {
            toast.dismiss();
        }
        return (
            <>
                <div className={'titleStyle'}>
                    <h4 style={{'textAlign':'center'}}>S&P 500 by Market Cap</h4>
                </div>
                <Selectors />
                <ResponsiveContainer className={'treemapContainer'} width="85%" height="60%">
                    <Treemap
                        width={400}
                        height={1000}
                        data={this.props.chartData[this.props.sector]}
                        dataKey="size"
                        nameKey='name'
                        stroke="#fff"
                        aspectRatio={4 / 3}
                        fill="#8884d8"
                    >
                        <Tooltip content={<CustomTooltip />}/>

                    </Treemap>
                </ResponsiveContainer>
                <ToastContainer
                    position="bottom-center"
                    autoClose={false}
                    hideProgressBar={true}
                    draggable
                    pauseOnHover/>
            </>
        )
    }
}

MarketCapTM.propTypes = {
    chartData: PropTypes.objectOf(PropTypes.any),
    sector: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    chartData: state.sp500.marketCapData,
    sector: state.sp500.selectedSector,
});

export default connect(mapStateToProps, {getTreemapData})(MarketCapTM)