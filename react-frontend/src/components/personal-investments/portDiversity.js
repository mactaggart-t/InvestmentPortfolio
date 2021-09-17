import React, {useEffect} from "react";
import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
    Cell,
    CartesianGrid,
    YAxis,
    Bar,
    BarChart,
    LabelList
} from "recharts";
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


const CustomTooltipPie = (content) =>  {
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

CustomTooltipPie.propTypes = {
    data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
};

const CustomTooltipBar = (content) =>  {
    if (content.active && content.payload && content.payload.length) {
        const totalValue = content.data.map(item => item.value).reduce((prev, next) => prev + next);
        return (
            <div className={'tooltipBackground'}>
                <p>{`${(content.payload[0].payload.sector ? 
                    content.payload[0].payload.sector : content.payload[0].payload.name)}: 
                    ${(100*content.payload[0].value/totalValue).toFixed(2)}%`}</p>
                <p>{`$${(content.payload[0].value).toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

CustomTooltipBar.propTypes = {
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
            <div style={{width: '50%', height: '70%', float: 'left', marginBottom: '10px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={props.secDivData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{value: 'Value($)', angle: -90, dx: -30}}/>
                      <Tooltip content={<CustomTooltipBar data={props.secDivData}/>}/>
                      <Bar yAxisId="left" dataKey="value" fill="#82ca9d">
                          <LabelList dataKey="name" position="top" />
                      </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{width: '50%', height: '70%', float: 'right', marginBottom: '10px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={props.sectorDivData}
                      margin={{
                        top: 20,
                        right: 50,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{value: 'Value($)', angle: -90, dx: -30}} />
                      <Tooltip content={<CustomTooltipBar data={props.sectorDivData}/>}/>
                      <Bar yAxisId="left" dataKey="value" fill="#82ca9d">
                          <LabelList dataKey="sector" position="top" />
                      </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{width: '50%', height: '70%', float: 'left'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                        <Pie
                            dataKey="value"
                            isAnimationActive
                            data={props.secDivData}
                            cx="45%"
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
                        <Tooltip content={<CustomTooltipPie data={props.secDivData}/>}/>
                        <Legend verticalAlign='top' height={50} layout='vertical' align='left'/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{width: '50%', height: '70%', float: 'right'}}>
                <ResponsiveContainer width="100%" height="100%">
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
                        <Tooltip content={<CustomTooltipPie data={props.secDivData}/>}/>
                        <Legend verticalAlign='top' height={50} layout='vertical' align='right'/>
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
