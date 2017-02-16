import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { dismissCard, fetchCardsIfNeeded } from '../actions';

import CardStackComponent from '../components/card-stack';

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

const CardStackContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CardStackComponent);

export default CardStackContainer;