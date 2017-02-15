import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Positions from '../components/positions';

import { fetchPositionsIfNeeded, changeTitle } from '../actions';

const mapStateToProps = (state) => {
    return {
        positions: state.positions,
        primaryColor: state.primaryColor,
        settings: state.settings
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeTitle: (fixedTitle) => {
			dispatch(changeTitle(fixedTitle, '', false, true));
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