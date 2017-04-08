import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { cancelOrder } from '../actions';

import OrderPaneComponent from '../components/order-pane';

const mapStateToProps = (state) => {
    const account = state.account.accountData;
    const symbol = state.title.present.symbol;
    const stock = state.stocks[symbol];
    const title = state.title.present;
    const order = _.find(stock.orders, (order) => order.id == title.orderId);

    return {
        account,
        stock,
        order,
        primaryColor: state.primaryColor,
        robinhood: state.robinhood
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        cancelOrder: (url, symbol, orderRes) => dispatch(cancelOrder(url, symbol, orderRes))
    }
}

const OrderPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderPaneComponent);

export default OrderPaneContainer;