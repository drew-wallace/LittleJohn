import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Positions from '../components/positions';

import { fetchPositionsIfNeeded, changeCurrentPane } from '../actions';

const mapStateToProps = (state) => {
    return {
        positions: state.positions,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentPane: (symbol) => {
            dispatch(changeCurrentPane(symbol));
        },
        fetchPositionsIfNeeded: () => {
            dispatch(fetchPositionsIfNeeded());
        }
    }
}

const RobinhoodPositions = connect(
    mapStateToProps,
    mapDispatchToProps
)(Positions);

export default RobinhoodPositions;