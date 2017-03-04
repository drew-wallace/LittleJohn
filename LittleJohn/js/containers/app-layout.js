import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { toggleMenu, closeMenu, changeTitle, changeDisplayedValue, undoTitle, changePrimaryColor, changeTitleFromTab, initTitle, fetchAccountIfNeeded, selectedOrderType, selectedOrderTypeWithPrice } from '../actions';

import App from '../components/app';

const mapStateToProps = (state) => {
    return {
		title: state.title,
		menu: state.menu,
		robinhood: state.robinhood,
		portfolio: state.portfolio,
		account: state.account,
		primaryColor: state.primaryColor,
		settings: state.settings,
		watchlist: state.watchlist,
		positions: state.positions,
		currentOrder: state.currentOrder,
		stocks: state.stocks
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: (open) => dispatch(toggleMenu(open)),
		changeTitle: (fixedTitle, options) => dispatch(changeTitle(fixedTitle, options)),
		changeTitleFromTab: (fixedTitle, options) => dispatch(changeTitleFromTab(fixedTitle, options)),
		initTitle: (fixedTitle, options) => dispatch(initTitle(fixedTitle, options)),
		selectedOrderType: (fixedTitle, options) => dispatch(selectedOrderType(fixedTitle, options)),
		selectedOrderTypeWithPrice: (fixedTitle, options) => dispatch(selectedOrderTypeWithPrice(fixedTitle, options)),
		changeDisplayedValue: (value) => dispatch(changeDisplayedValue(value)),
		undoTitle: () => dispatch(undoTitle()),
		changePrimaryColor: (color) => dispatch(changePrimaryColor(color)),
		fetchAccountIfNeeded: () => dispatch(fetchAccountIfNeeded()),
    }
}

const AppLayout = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppLayout;