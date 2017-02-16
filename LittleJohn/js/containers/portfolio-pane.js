import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { changePrimaryColor, fetchPortfolioIfNeeded } from '../actions';

import PortfolioPaneComponent from '../components/portfolio-pane';

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
        fetchPortfolioIfNeeded: () => {
            dispatch(fetchPortfolioIfNeeded());
        }
    }
}

const PortfolioPane = connect(
    mapStateToProps,
    mapDispatchToProps
)(PortfolioPaneComponent);

export default PortfolioPane;