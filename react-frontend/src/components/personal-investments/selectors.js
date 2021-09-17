import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {formatData} from "../../actions/chartingUtils";

function Selectors(props) {

    const handleChangeTime = (event, newTime) => {
        props.formatData(props.chartData, newTime, props.type, props.chartType, props.purchases);
    };

    const handleChangeType = (event, newType) => {
        props.formatData(props.chartData, props.time, newType, props.chartType, props.purchases);
    };
    return (
        <>
            <ul className={'listStyle'}>
                <li className={'hiddenDupe'}>
                    <ToggleButtonGroup
                      value={props.type}
                      exclusive
                      onChange={handleChangeType}
                    >
                        <ToggleButton value="%">%</ToggleButton>
                        <ToggleButton value='$'>$</ToggleButton>
                    </ToggleButtonGroup>
                </li>
                <li
                    className={'centerElem'}
                >
                    <ToggleButtonGroup
                      value={props.time}
                      exclusive
                      onChange={handleChangeTime}
                    >
                        <ToggleButton value="2w">2w</ToggleButton>
                        <ToggleButton value='1m'>1M</ToggleButton>
                        <ToggleButton value='3m'>3M</ToggleButton>
                        <ToggleButton value='6m'>6M</ToggleButton>
                        <ToggleButton value='ytd'>YTD</ToggleButton>
                        <ToggleButton value='1y'>1Y</ToggleButton>
                        <ToggleButton value='5y'>5Y</ToggleButton>
                        <ToggleButton value='10y'>10Y</ToggleButton>
                        <ToggleButton value='all'>All</ToggleButton>
                    </ToggleButtonGroup>
                </li>
                <li className={'rightElem'}>
                    <ToggleButtonGroup
                      value={props.type}
                      exclusive
                      onChange={handleChangeType}
                      style={{'margin': '5px'}}
                    >
                        <ToggleButton value="%">%</ToggleButton>
                        <ToggleButton value='$'>$</ToggleButton>
                    </ToggleButtonGroup>
                </li>
            </ul>
        </>
    );
}

Selectors.propTypes = {
    chartData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]))).isRequired,
    time: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    chartType: PropTypes.string.isRequired,
    purchases: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    formatData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { formatData })(Selectors)