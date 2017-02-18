import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import PositionListComponent from '../components/position-list';

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
        changeTitle: (fixedTitle, options) => {
			dispatch(changeTitle(fixedTitle, options));
		},
        fetchPositionsIfNeeded: () => {
            dispatch(fetchPositionsIfNeeded());
        }
    }
}

const PositionsListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PositionListComponent);

export default PositionsListContainer;