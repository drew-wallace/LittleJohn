import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { backToStockPane } from '../actions';

import OrderPlacedPaneComponent from '../components/order-placed-pane';

const mapStateToProps = (state) => {
    const currentOrder = state.currentOrder;
    const stock = state.stocks[currentOrder.symbol];

    return {
        currentOrder,
        stock,
        primaryColor: state.primaryColor,
        title: state.title.present
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        backToStockPane: () => dispatch(backToStockPane())
    }
}

const OrderPlacementPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderPlacedPaneComponent);

export default OrderPlacementPaneContainer;