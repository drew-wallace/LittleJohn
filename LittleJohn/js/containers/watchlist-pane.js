import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { changePrimaryColor, fetchPortfolioIfNeeded } from '../actions';

import Portfolio from '../components/portfolio';

const mapStateToProps = (state) => {
    return {
        portfolio: state.portfolio,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePrimaryColor: (color) => {
            dispatch(changePrimaryColor(color));
        },
        // fetchPortfolioIfNeeded: () => {
        //     dispatch(fetchPortfolioIfNeeded());
        // }
    }
}

const PositionPane = connect(
    mapStateToProps,
    mapDispatchToProps
)(Portfolio);

export default PositionPane;