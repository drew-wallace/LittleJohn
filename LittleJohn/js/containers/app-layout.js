import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { toggleMenu, closeMenu, changeTitle, changeFixedTitle } from '../actions'

import App from '../components/app';

const mapStateToProps = (state) => {
    return {
		title: state.title,
		fixedTitle: state.fixedTitle,
		menu: state.menu,
		robinhood: state.robinhood,
		portfolio: state.portfolio,
		primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: (open) => {
            dispatch(toggleMenu(open));
        },
		changeTitle: (text) => {
			dispatch(changeTitle(text));
		},
		changeFixedTitle: (text) => {
			dispatch(changeFixedTitle(text));
		}
    }
}

const AppLayout = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppLayout;