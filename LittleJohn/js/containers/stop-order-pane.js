import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { setStopPrice } from '../actions';

import StopOrderPaneComponent from '../components/stop-order-pane';

const mapStateToProps = (state) => {
    console.log('ASDFASDFASDF');
    const currentOrder = state.currentOrder;
    const stock = state.stocks[currentOrder.symbol];
    const title = state.title.present;

    return {
        title,
        currentOrder,
        stock
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setStopPrice: (fixedTitle, options) => dispatch(setStopPrice(fixedTitle, options))
    }
}

const StopOrderPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StopOrderPaneComponent);

export default StopOrderPaneContainer;