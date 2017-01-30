// import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import Promise from 'bluebird';

import processPortfolio from '../lib/process-portfolio';
import { formatCurrency } from '../lib/formaters';

import styles from '../styles';

import env from "../../env";
import Portfolios from '../../data/portfolios';
import Day from '../../data/day';
import Week from '../../data/week';
import Year from '../../data/year';
import AllTime from '../../data/5year';
import Positions from '../../data/positions';

const { positivePrimaryColor, negativePrimaryColor } = styles;

export const login = () => {
    return {
        type: 'LOGIN'
    };
}
export const logout = () => {
    return {
        type: 'LOGOUT'
    };
}
export const attachRobinhood = (robinhood) => {
    return {
        type: 'ATTACH_ROBINHOOD',
        robinhood
    };
}
export const toggleMenu = (open) => {
    return {
        type: 'TOGGLE_MENU',
        open
    };
}
export const changeTitle = (text) => {
    return {
        type: 'CHANGE_TITLE',
        text
    };
}
export const changeFixedTitle = (text) => {
    return {
        type: 'CHANGE_FIXED_TITLE',
        text
    };
}
export const changeEquityTitle = (text) => {
    return {
        type: 'CHANGE_EQUITY_TITLE',
        text
    };
}
export const changePaneTitle = (text) => {
    return {
        type: 'CHANGE_PANE_TITLE',
        text
    };
}
export const changePaneSubtitle = (text) => {
    return {
        type: 'CHANGE_PANE_SUBTITLE',
        text
    };
}
export const addPortfolio = (portfolio) => {
    return {
        type: 'ADD_PORTFOLIO',
        portfolio
    };
}
export const addCard = (card) => {
    return {
        type: 'ADD_CARD',
        card
    };
}
export const dismissCard = (url) => {
    return {
        type: 'DISMISS_CARD',
        url
    };
}
export const addPosition = (position) => {
    return {
        type: 'ADD_POSITION',
        position
    };
}

export const changePrimaryColor = (color) => {
    return {
        type: 'CHANGE_PRIMARY_COLOR',
        color
    };
}

export const invalidatePortfolio = (portfolio) => {
  return {
    type: 'INVALIDATE_PORTFOLIO',
    portfolio
  }
}

function requestPortfolio() {
    return {
        type: 'REQUEST_PORTFOLIO'
    };
}

function receivePortfolio(portfolio) {
    return {
        type: 'RECEIVE_PORTFOLIO',
        portfolio,
        receivedAt: Date.now()
    };
}

function fetchPortfolio(state) {
    return dispatch => {
        dispatch(requestPortfolio());

        let robinhood = state.robinhood;
        // let promises = [
        //     robinhood.portfolios(),
        //     robinhood.portfolioHistoricals({span: 'day', interval: '5minute'}),
        //     robinhood.portfolioHistoricals({span: 'week', interval: '10minute'}),
        //     robinhood.portfolioHistoricals({span: 'year', interval: 'day'}),
        //     robinhood.portfolioHistoricals({span: '5year', interval: 'week'})
        // ];
        let promises = [
            Portfolios,
            Day,
            Week,
            Year,
            AllTime
        ]

        Promise.all(promises).spread((portfolioRes, dayRes, weekRes, yearRes, allRes) => {
				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("portfolios.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, portfolioRes.responseText);
				// });
				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("day.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, dayRes.responseText);
				// });
				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("week.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, weekRes.responseText);
				// });
				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, yearRes.responseText);
				// });
				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("5year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, allRes.responseText);
				// });
				const portfolio = processPortfolio(portfolioRes, dayRes, weekRes, yearRes, allRes);
                dispatch(changeFixedTitle(formatCurrency(portfolio.equity)));
                dispatch(changePrimaryColor((_.last(portfolio.historicals.day).adjusted_open_equity >= portfolio.historicals.day[0].adjusted_open_equity ? positivePrimaryColor : negativePrimaryColor)));
                dispatch(receivePortfolio(portfolio));
			}
		);
    }
}

function shouldFetchPortfolio(state) {
    const portfolio = state.portfolio;

    if (_.isEmpty(portfolio)) {
        return true;
    } else if (portfolio.isFetching) {
        return false;
    } else {
        return portfolio.didInvalidate;
    }
}

export function fetchPortfolioIfNeeded() {

    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.

    return (dispatch, getState) => {
        const state = getState();

        if (shouldFetchPortfolio(state)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchPortfolio(state));
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    };
}

export const invalidateCards = (cards) => {
  return {
    type: 'INVALIDATE_CARDS',
    cards
  }
}

function requestCards() {
    return {
        type: 'REQUEST_CARDS'
    };
}

function receiveCards(cards) {
    return {
        type: 'RECEIVE_CARDS',
        cards,
        receivedAt: Date.now()
    };
}

function fetchCards(state) {
    return dispatch => {
        dispatch(requestCards());

        let robinhood = state.robinhood;

        // robinhood.cards().then(function(res) {
        //     let cards = res.responseJSON.results.filter(function(card) {
        //         return card.show_if_unsupported;
        //     });
        //     dispatch(receiveCards(cards));
        // });
        dispatch(receiveCards(env.cards.results));
    }
}

function shouldFetchCards(state) {
    const cards = state.cards;

    if (_.isEmpty(cards)) {
        return true;
    } else if (cards.isFetching) {
        return false;
    } else {
        return cards.didInvalidate;
    }
}

export function fetchCardsIfNeeded() {

    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.

    return (dispatch, getState) => {
        const state = getState();

        if (shouldFetchCards(state)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchCards(state));
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    };
}

export const invalidatePositions = (positions) => {
  return {
    type: 'INVALIDATE_POSITIONS',
    positions
  }
}

function requestPositions() {
    return {
        type: 'REQUEST_POSITIONS'
    };
}

function receivePositions(positions) {
    return {
        type: 'RECEIVE_POSITIONS',
        positions,
        receivedAt: Date.now()
    };
}

function fetchPositions(state) {
    return dispatch => {
        dispatch(requestPositions());

        let robinhood = state.robinhood;

        // robinhood.positions({nonzero: true}).then(function(positions){
        //     var promises = [];
        //     var currentPositions = positions.responseJSON.results.forEach(function(position){
        //         promises.push(robinhood.instrument(position.instrument).then(function(response){
        //             position.instrument = response.responseJSON;
        //             return response.responseJSON.symbol;
        //         }).then(function(symbol){
        //             return Promise.join(
        //                 robinhood.quote_data(symbol),
        //                 robinhood.symbolHistoricals(symbol, {span: 'day', interval: '5minute'}),
        //                 robinhood.symbolHistoricals(symbol, {span: 'week', interval: '10minute'}),
        //                 robinhood.symbolHistoricals(symbol, {span: 'year', interval: 'day'}),
        //                 robinhood.symbolHistoricals(symbol, {span: '5year', interval: 'week'}),
        //                 function(quoteRes, dayRes, weekRes, yearRes, allRes) {
        //                     position.quote = quoteRes.responseJSON.results[0];
        //                     position.historicals = {
        //                         day: dayRes.responseJSON.historicals,
        //                         week: weekRes.responseJSON.historicals,
        //                         year: yearRes.responseJSON.historicals,
        //                         all: allRes.responseJSON.historicals
        //                     };

        //                     return position;
        //                 });
        //         }));
        //     });
        //     return Promise.all(promises).then(function(positions){
        //         // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("positions.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
        //         //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(positions));
        //         // });
        //         dispatch(receivePositions(positions));
        //     });
        // });
        dispatch(receivePositions(Positions.responseJSON));
    }
}

function shouldFetchPositions(state) {
    const positions = state.positions;

    if (_.isEmpty(positions)) {
        return true;
    } else if (positions.isFetching) {
        return false;
    } else {
        return positions.didInvalidate;
    }
}

export function fetchPositionsIfNeeded() {

    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.

    return (dispatch, getState) => {
        const state = getState();

        if (shouldFetchPositions(state)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchPositions(state));
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    };
}