import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './research.css'
import Header from "../header/header"
import { Multiselect } from 'multiselect-react-dropdown'
import {connect} from "react-redux";
import {getAllTickers} from "../../actions/research";

function SearchBar(props) {
    return (
        <div className={'search_box'}>
            <Multiselect
                avoidHighlightFirstOption
                isObject={false}
                options={props.items}
                onRemove={function noRefCheck(){}}
                onSelect={function noRefCheck(){}}
                showArrow
            />
        </div>
    );
}

SearchBar.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
};

class Research extends Component {
    componentDidMount() {
        this.props.getAllTickers();
    }

    render() {
        return (
            <>
                <Header selected={'research'}/>
                <SearchBar items={this.props.items} selected={this.props.selected}/>
            </>
        );
    }
}

Research.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
    items: state.research.items,
    selected: state.research.selected,
});

export default connect(mapStateToProps, { getAllTickers })(Research)