import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { toggleMenu, closeMenu, changeTitle, changeDisplayedValue, undoTitle, redoTitle, changePrimaryColor, changeTitleFromTab } from '../actions';

import App from '../components/app';

const mapStateToProps = (state) => {
    return {
		title: state.title,
		menu: state.menu,
		robinhood: state.robinhood,
		portfolio: state.portfolio,
		primaryColor: state.primaryColor,
		settings: state.settings,
		watchlist: state.watchlist,
		positions: state.positions
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: (open) => dispatch(toggleMenu(open)),
		changeTitle: (fixedTitle, floatingTitle, isStock, isPosition, isWatchlist) => dispatch(changeTitle(fixedTitle, floatingTitle, isStock, isPosition, isWatchlist)),
		changeTitleFromTab: (fixedTitle, floatingTitle, isStock, isPosition, isWatchlist) => dispatch(changeTitleFromTab(fixedTitle, floatingTitle, isStock, isPosition, isWatchlist)),
		changeDisplayedValue: (value) => dispatch(changeDisplayedValue(value)),
		undoTitle: () => dispatch(undoTitle()),
		redoTitle: () => dispatch(redoTitle()),
		changePrimaryColor: (color) => dispatch(changePrimaryColor(color))
    }
}

const AppLayout = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppLayout;