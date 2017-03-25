import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { changeTitleFromTab, confirmOrder } from '../actions';

import OrderPlacementPaneComponent from '../components/order-placement-pane';

const mapStateToProps = (state) => {
    const account = state.account.accountData;
    const symbol = state.title.present.symbol;
    const stockType = state.title.present.stockType;
    const currentOrder = state.currentOrder;
    let stock = state.stocks[symbol];

    return {
        account,
        stockType,
        stock,
        currentOrder,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        confirmOrder: (fixedTitle, options) => dispatch(confirmOrder())
    }
}

const OrderPlacementPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderPlacementPaneComponent);

export default OrderPlacementPaneContainer;