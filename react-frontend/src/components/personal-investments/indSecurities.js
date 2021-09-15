import React, {useState} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from "react-toastify";
import PropTypes from 'prop-types'
import { Multiselect } from 'multiselect-react-dropdown'
import Selectors from './selectors';
import '../research/research.css'
import 'react-toastify/dist/ReactToastify.min.css';
import {CustomTooltip, formatXAxis, getStroke} from "../../actions/chartingUtils";

export function IndSecurities(props) {
    if (props.loadedInd) {
        toast.dismiss();
        props.resetLoaded();
    }
    return (
        <>
            <h4 className="chartTitle">Individual Securities</h4>
            <div style={{marginLeft: '5px'}}>
                <SearchBar items={props.items}
                           selected={props.selected}
                           submitSelectedTickers={props.submitSelectedTickers}
                />
            </div>
            <div className={'chart_container'}>
                <div className={'center_header'}>
                    <Selectors time={props.time} type={props.type} chartData={props.chartData} chartType={'individual'}/>
                </div>
                <ResponsiveContainer width="100%" height="100%">
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
                      <YAxis label={{ value: (props.type === '$') ? "Price($)": "Change(%)", angle: -90, dx: 40 }} tickFormatter={t => (props.type === '$') ? "$" + t : t + '%'}/>
                      <Tooltip content={<CustomTooltip type={props.type}/>} labelFormatter={t => new Date(t).toLocaleString().split(',')[0]}/>
                      <Legend verticalAlign="top"/>
                      {props.selected.map(ticker => (
                          <Line key={ticker} type="monotone" dataKey={ticker} dot={false} stroke={getStroke(props.selected.indexOf(ticker))}/>
                      ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <ToastContainer
                    position="bottom-center"
                    autoClose={false}
                    hideProgressBar={true}
                    draggable
                    pauseOnHover/>
        </>
    );
}

IndSecurities.propTypes = {
    loadedInd: PropTypes.bool.isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    chartData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    formattedData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    submitSelectedTickers: PropTypes.func.isRequired,
    resetLoaded: PropTypes.func.isRequired,
};

function SearchBar(props) {
    const [selectedItems, setSelected] = useState(props.selected);

    function onSelect(selectedList, selectedItem) {
        setSelected(selectedList);
    }

    function onRemove(selectedList, removedItem) {
        setSelected(selectedList);
    }

    const notify = () => toast.success("Loading, please wait");

    function handleOnClick() {
        notify();
        props.submitSelectedTickers(selectedItems);
    }

    return (
        <>
            <div className={'searchContainer'}>
                <div className={'search_box'}>
                    <Multiselect
                        avoidHighlightFirstOption
                        isObject={false}
                        options={props.items}
                        onRemove={onRemove}
                        onSelect={onSelect}
                        showArrow
                    />
                </div>
                <div className={'submit_button'}>
                    <Button
                        style={{textTransform: 'none'}}
                        variant="contained"
                        color="primary"
                        onClick={handleOnClick}>Apply</Button>
                </div>
            </div>

        </>
    );
}

SearchBar.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    submitSelectedTickers: PropTypes.func.isRequired,
};
