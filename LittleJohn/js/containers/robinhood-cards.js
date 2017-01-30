import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { dismissCard, fetchCardsIfNeeded } from '../actions';

import Cards from '../components/cards';

const mapStateToProps = (state) => {
    return {
        cards: state.cards,
        robinhood: state.robinhood,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dismissCard: (url) => {
            dispatch(dismissCard(url));
        },
        fetchCardsIfNeeded: () => {
            dispatch(fetchCardsIfNeeded());
        }
    }
}

const RobinhoodCards = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cards);

export default RobinhoodCards;