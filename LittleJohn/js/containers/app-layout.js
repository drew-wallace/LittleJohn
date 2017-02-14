import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { toggleMenu, closeMenu, changeTitle, changeDisplayedValue, undoTitle, redoTitle } from '../actions';

import App from '../components/app';

const mapStateToProps = (state) => {
    return {
		title: state.title,
		menu: state.menu,
		robinhood: state.robinhood,
		portfolio: state.portfolio,
		primaryColor: state.primaryColor,
		settings: state.settings
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: (open) => dispatch(toggleMenu(open)),
		changeTitle: (fixedTitle, floatingTitle) => dispatch(changeTitle(fixedTitle, floatingTitle, false, false, false)),
		changeDisplayedValue: (value) => dispatch(changeDisplayedValue(value)),
		undoTitle: () => dispatch(undoTitle()),
		redoTitle: () => dispatch(redoTitle())
    }
}

const AppLayout = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppLayout;