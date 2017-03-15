import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { setOrderPrice } from '../actions';

import LimitOrderPaneComponent from '../components/limit-order-pane';

const mapStateToProps = (state) => {
    const currentOrder = state.currentOrder;
    const stock = state.stocks[currentOrder.symbol];

    return {
        currentOrder,
        stock
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setOrderPrice: (fixedTitle, options) => dispatch(setOrderPrice(fixedTitle, options))
    }
}

const LimitOrderPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LimitOrderPaneComponent);

export default LimitOrderPaneContainer;