import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { addCard, dismissCard } from '../actions';

import Cards from '../components/cards';

const mapStateToProps = (state) => {
    return {
        cards: state.cards,
        width: state.width,
        robinhood: state.robinhood,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dismissCard: (e, elm, url) => {
            dispatch(dismissCard(url));
        }
    }
}

const RobinhoodCards = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cards);

export default RobinhoodCards;