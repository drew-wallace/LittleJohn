import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Positions from '../components/positions';

import { fetchPositionsIfNeeded } from '../actions';

const mapStateToProps = (state) => {
    return {
        positions: state.positions,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showStockOverlay: (symbol) => {
            console.log('showStockOverlay:', symbol);
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