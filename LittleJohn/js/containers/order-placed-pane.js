import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { backToStockPane } from '../actions';

import OrderPlacementPaneComponent from '../components/order-placement-pane';

const mapStateToProps = (state) => {
    const currentOrder = state.currentOrder;

    return {
        currentOrder,
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
)(OrderPlacementPaneComponent);

export default OrderPlacementPaneContainer;