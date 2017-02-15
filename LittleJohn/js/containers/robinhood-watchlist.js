import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Watchlist from '../components/watchlist';

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
        changeTitle: (fixedTitle) => {
			dispatch(changeTitle(fixedTitle, '', false, false, true));
		},
        fetchWatchlistIfNeeded: () => {
            dispatch(fetchWatchlistIfNeeded());
        }
    }
}

const RobinhoodWatchlist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Watchlist);

export default RobinhoodWatchlist;