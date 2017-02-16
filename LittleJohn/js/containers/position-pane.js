import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { changePrimaryColor } from '../actions';

import PositionPaneComponent from '../components/position-pane';

const mapStateToProps = (state) => {
    return {
        position: _.find(state.positions.items, {instrument: {name: state.title.present.fixedTitle}}),
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePrimaryColor: (color) => {
            dispatch(changePrimaryColor(color));
        }
    }
}

const PositionPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PositionPaneComponent);

export default PositionPaneContainer;