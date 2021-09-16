import React, {useEffect} from "react";
import {Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell} from "recharts";
import PropTypes from "prop-types";
import './personalInv.css'
import {toast, ToastContainer} from "react-toastify";

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#FF36F3',
    '#FF3333'];


const CustomTooltip = (content) =>  {
    if (content.active && content.payload && content.payload.length) {
        const totalValue = content.data.map(item => item.value).reduce((prev, next) => prev + next);
        return (
            <div className={'tooltipBackground'}>
                <p>{`${content.payload[0].name}: ${(100*content.payload[0].value/totalValue).toFixed(2)}%`}</p>
            </div>
        );
    }
    return null;
};

CustomTooltip.propTypes = {
    data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
};

export function PortDiversity(props) {
    useEffect(() => {
        if (props.secDivData.length === 0 || props.sectorDivData.length === 0) {
            toast.dismiss();
            toast.success('Loading, please wait...');
        } else {
            toast.dismiss();
        }
    });

    return (
        <>
            <h4 className="chartTitle">Portfolio Diversity</h4>
            <div className={'distributionBox'} style={{float: 'left'}}>
                <h5 className={'piechartTitle'}>Security Distribution</h5>
            </div>
            <div className={'distributionBox'} style={{float: 'right'}}>
                <h5 className={'piechartTitle'}>Sector Distribution</h5>
            </div>
            <div style={{width: '50%', height: '100%', float: 'left'}}>
                <ResponsiveContainer width="100%" height="70%">
                    <PieChart width={400} height={400}>
                        <Pie
                            dataKey="value"
                            isAnimationActive
                            data={props.secDivData}
                            cx="50%"
                            cy="35%"
                            outerRadius={'60%'}
                            fill="#8884d8"
                            labelLine
                            label={(item)=> `$${item.payload.payload.value.toFixed(2)}`}
                        >
                            {props.secDivData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip data={props.secDivData}/>}/>
                        <Legend verticalAlign='top' height={50} layout='vertical' align='left'/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{width: '50%', height: '100%', float: 'right'}}>
                <ResponsiveContainer width="100%" height="70%">
                    <PieChart width={400} height={400}>
                        <Pie
                            dataKey="value"
                            nameKey="sector"
                            isAnimationActive
                            data={props.sectorDivData}
                            cx="50%"
                            cy="35%"
                            outerRadius={'60%'}
                            fill="#8884d8"
                            labelLine
                            label={(item)=> `$${item.payload.payload.value.toFixed(2)}`}
                        >
                            {props.sectorDivData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip data={props.secDivData}/>}/>
                        <Legend verticalAlign='top' height={50} layout='vertical' align='left'/>
                    </PieChart>
                </ResponsiveContainer>
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

PortDiversity.PropType = {
    secDivData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    sectorDivData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
};
