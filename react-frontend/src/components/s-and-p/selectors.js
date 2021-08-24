import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";
import {setSector} from '../../actions/s_and_p'

function Selectors(props) {

    const handleChange = (event, newSelection) => {
        props.setSector(newSelection);
    };

    return (
        <>
            <ul className={'listStyle'}>
                <li
                    className={'centerElem'}
                >
                    <ToggleButtonGroup
                      value={props.sector}
                      exclusive
                      onChange={handleChange}
                    >
                        {props.allSectors.map(sector => (
                            <ToggleButton value={sector}>{sector}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </li>
            </ul>
        </>
    );
}

Selectors.propTypes = {
    allSectors: PropTypes.arrayOf(PropTypes.string),
    sector: PropTypes.string.isRequired,
    setSector: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    allSectors: state.sp500.allSectors,
    sector: state.sp500.selectedSector,
});

export default connect(mapStateToProps, {setSector})(Selectors)