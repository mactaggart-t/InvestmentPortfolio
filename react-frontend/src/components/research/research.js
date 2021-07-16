import React, {Component, useState} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from "react-toastify";
import PropTypes from 'prop-types'
import { Multiselect } from 'multiselect-react-dropdown'
import {connect} from "react-redux";
import Selectors from './selectors';
import Header from "../header/header"
import {getAllTickers, submitSelectedTickers} from "../../actions/research";
import './research.css'
import 'react-toastify/dist/ReactToastify.min.css';

function StockChart(props) {
    const getStroke = (itemIndex) => {
        switch (itemIndex % 5) {
            case 0:
                return '#004E98';
            case 1:
                return '#C03221';
            case 2:
                return '#00CC14';
            case 3:
                return '#F99FAB';
            default:
                return '#989C94'
        }
    };

    function getFormattedDate(date) {
        const year = date.getFullYear();

        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;
    }

    const formatXAxis = (tickItem) => {
        if (tickItem === 0 || tickItem === 'auto' || tickItem === '') {
            return '';
        }
        return getFormattedDate(new Date(tickItem));
    };

    return (
        <div className={'chart_container'}>
            <div className={'center_header'}>
                <h2>Compare or View Stock Prices</h2>
                <Selectors />
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
                  <Tooltip labelFormatter={t => new Date(t).toLocaleString().split(',')[0]}/>
                  <Legend verticalAlign="top"/>
                  {props.selected.map(ticker => (
                      <Line key={ticker} type="monotone" dataKey={ticker} dot={false} stroke={getStroke(props.selected.indexOf(ticker))}/>
                  ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

StockChart.propTypes = {
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

class Research extends Component {
    componentDidMount() {
        this.props.getAllTickers();
    }

    render() {
        toast.dismiss();
        return (
            <>
                <Header selected={'research'}/>
                <SearchBar items={this.props.items}
                           selected={this.props.selected}
                           submitSelectedTickers={this.props.submitSelectedTickers}
                />
                <StockChart type={this.props.type}
                            chartData={this.props.chartData}
                            selected={this.props.selected}
                            formattedData={this.props.formattedData}
                />
                <ToastContainer
                position="bottom-center"
                autoClose={false}
                hideProgressBar={true}
                draggable
                pauseOnHover/>
            </>
        );
    }
}

Research.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    getAllTickers: PropTypes.func.isRequired,
    submitSelectedTickers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    items: state.research.items,
    selected: state.research.selected,
    type: state.research.type,
    chartData: state.research.chartData,
    formattedData: state.research.formattedData,
});

export default connect(mapStateToProps, { getAllTickers, submitSelectedTickers })(Research)