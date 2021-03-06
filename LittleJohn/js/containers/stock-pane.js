import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { changePrimaryColor, changeTitle, initTitle, selectedOrderSide, showPastOrder, showMoreNews } from '../actions';

import PositionPaneComponent from '../components/stock-pane';

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
            stock = state.stock[symbol];
            break;
    }

    return {
        account: state.account,
        stockType,
        stock,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePrimaryColor: (color) => dispatch(changePrimaryColor(color)),
        changeTitle: (fixedTitle, options) => dispatch(changeTitle(fixedTitle, options)),
        initTitle: (fixedTitle, options) => dispatch(initTitle(fixedTitle, options)),
        selectedOrderSide: (fixedTitle, options) => dispatch(selectedOrderSide(fixedTitle, options)),
        showPastOrder: (fixedTitle, options) => dispatch(showPastOrder(fixedTitle, options)),
        showMoreNews: (fixedTitle, options) => dispatch(showMoreNews(fixedTitle, options)),
    }
}

const PositionPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PositionPaneComponent);

export default PositionPaneContainer;