import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { changeTitleFromTab } from '../actions';

import OrderPlacementPaneComponent from '../components/order-placement-pane';

const mapStateToProps = (state) => {
    const symbol = state.title.present.symbol;
    const stockType = state.title.present.stockType;
    let stock = null;

    switch(stockType) {
        case 'position':
            stock = state.positions.items[symbol];
            break;
        case 'watchlist':
            stock = state.watchlist.items[symbol];
            break;
        case 'stock':
            stock = state.stocks[symbol];
            break;
    }

    return {
        stockType,
        stock,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeTitleFromTab: (fixedTitle, options) => dispatch(changeTitle(fixedTitle, options))
    }
}

const OrderPlacementPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderPlacementPaneComponent);

export default OrderPlacementPaneContainer;