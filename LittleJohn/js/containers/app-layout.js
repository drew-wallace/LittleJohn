import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { toggleMenu, closeMenu, changeTitle } from '../actions'

import App from '../components/app';

const mapStateToProps = (state) => {
    return {
		title: state.title,
		menu: state.menu,
		robinhood: state.robinhood
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: (open) => {
            dispatch(toggleMenu(open));
        },
		changeTitle: (text) => {
			dispatch(changeTitle(text));
		}
    }
}

const AppLayout = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppLayout;