import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import WatchlistComponent from '../components/watchlist';

import { fetchWatchlistIfNeeded, changeTitle } from '../actions';

const mapStateToProps = (state) => {
    return {
        watchlist: state.watchlist,
        primaryColor: state.primaryColor,
        settings: state.settings
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeTitle: (fixedTitle, options) => {
			dispatch(changeTitle(fixedTitle, options));
		},
        fetchWatchlistIfNeeded: () => {
            dispatch(fetchWatchlistIfNeeded());
        }
    }
}

const WatchlistContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WatchlistComponent);

export default WatchlistContainer;