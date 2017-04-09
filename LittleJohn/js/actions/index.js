// import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import Promise from 'bluebird';

import processPortfolio from '../lib/process-portfolio';
import { formatCurrency } from '../lib/formaters';

import styles from '../styles';

import env from "../../env";
import Account from '../../data/account';
import Portfolios from '../../data/portfolios';
import Positions from '../../data/positions';
import Watchlist from '../../data/watchlist';

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
export const changeTitle = (fixedTitle='Portfolio', options={}) => {
    return {
        type: 'CHANGE_TITLE',
        ...options,
        fixedTitle
    };
}
export const changeTitleFromTab = (fixedTitle='Portfolio', options={}) => {
    return {
        type: 'CHANGE_TITLE_FROM_TAB',
        ...options,
        fixedTitle
    };
}
export const initTitle = (fixedTitle='Portfolio', options={}) => {
    return {
        type: 'INIT_TITLE',
        ...options,
        fixedTitle
    };
}
export function showMoreNews(fixedTitle, options={}) {
    return (dispatch) => {
        dispatch(changePrimaryColor(styles.positivePrimaryColor));
        dispatch(initTitle(fixedTitle, options));
        return Promise.resolve()
    };
}
export function showPastOrder(fixedTitle, options = {}) {
    return (dispatch) => {
        dispatch(changePrimaryColor(styles.positivePrimaryColor));
        dispatch(initTitle(fixedTitle, options));
        return Promise.resolve()
    };
}
export const backToOrderPlacementPane = () => {
    return {
        type: 'BACK_TO_ORDER_PLACEMENT_PANE'
    };
}
export const updateCurrentOrder = (options={}) => {
    return {
        type: 'UPDATE_CURRENT_ORDER',
        options
    };
}
export const resetCurrentOrder = (options={}) => {
    return {
        type: 'RESET_CURRENT_ORDER',
        options
    };
}
export function selectedOrderSide(fixedTitle, options={}) {
    return (dispatch) => {
        dispatch(changePrimaryColor(styles.positivePrimaryColor));
        dispatch(resetCurrentOrder({
            side: options.side,
            symbol: options.symbol,
            type: 'market',
            trigger: 'immediate',
            time_in_force: 'gfd'
        }));
        dispatch(initTitle(fixedTitle, options));
        return Promise.resolve()
    };
}
export function selectedMarketOrderType(fixedTitle, options={}) {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(resetCurrentOrder({
            side: state.currentOrder.side,
            symbol: state.currentOrder.symbol,
            type: 'market',
            trigger: 'immediate',
            time_in_force: 'gfd'
        }));
        dispatch(backToOrderPlacementPane());
        return Promise.resolve()
    };
}
export function selectedOrderTypeWithPrice(fixedTitle, options={}) {
    let currentOrderOptions = {type: options.orderType};

    if (currentOrderOptions.type == 'stop loss') {
        currentOrderOptions.type = 'market';
        currentOrderOptions.trigger = 'stop';
    } else if (currentOrderOptions.type == 'stop limit') {
        currentOrderOptions.type = 'limit';
        currentOrderOptions.trigger = 'stop'
    }

    currentOrderOptions.price = 0;
    currentOrderOptions.stop_price = 0;

    return (dispatch) => {
        dispatch(updateCurrentOrder({potential: currentOrderOptions}));
        dispatch(changeTitle(fixedTitle, options));
        return Promise.resolve();
    };
}
export function setStopPrice(fixedTitle, options={}) {
    return (dispatch) => {
        dispatch(updateCurrentOrder({
            potential: {
                stop_price: options.stop_price
            }
        }));
        dispatch(changeTitle(fixedTitle, options));
        return Promise.resolve();
    };
}
export function setOrderPrice(fixedTitle, options={}) {
    return (dispatch) => {
        dispatch(updateCurrentOrder({
            potential: {
                price: options.price
            }
        }));
        dispatch(changeTitle(fixedTitle, options));
        return Promise.resolve();
    };
}
export function selectedTimeInForce(time_in_force) {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(updateCurrentOrder({
            time_in_force,
            ...state.currentOrder.potential
        }));
        dispatch(backToOrderPlacementPane());
        return Promise.resolve();
    };
}
export function confirmOrder(quantity) {
    console.log('Confirm Order action');
    return (dispatch, getState) => {
        const state = getState();
        dispatch(updateCurrentOrder({quantity}));
        dispatch(changeTitle(state.title.present.fixedTitle, {...state.title.present, activePane: 'confirm order'}));
        return Promise.resolve();
    };
}
export const changeDisplayedValue = (value) => {
    return {
        type: 'CHANGE_DISPLAYED_VALUE',
        value
    };
}
export const undoTitle = () => {
    return {
        type: 'UNDO_TITLE'
    };
}
export const redoTitle = () => {
    return {
        type: 'REDO_TITLE'
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
export const updateStocks = (stocks) => {
    return {
        type: 'UPDATE_STOCKS',
        stocks
    }
}
export const invalidateAccount = (account) => {
  return {
    type: 'INVALIDATE_ACCOUNT',
    account
  }
}
function requestAccount() {
    return {
        type: 'REQUEST_ACCOUNT'
    };
}
function receiveAccount(account) {
    return {
        type: 'RECEIVE_ACCOUNT',
        account,
        receivedAt: Date.now()
    };
}
export const cancelOrder = (orderId, symbol, orderRes) => {
    return {
        type: 'DISMISS_ORDER',
        orderId,
        symbol,
        orderRes
    };
}
function fetchAccount(state) {
    return dispatch => {
        dispatch(requestAccount());

        // let robinhood = state.robinhood;

        // robinhood.account().then(function(res) {
        //     let account = res.responseJSON.results[0];
        //     Windows.Storage.ApplicationData.current.localFolder.createFileAsync("cards.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
        //         return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(cards));
        //     });
        //     dispatch(receiveAccount(account));
        // });
        dispatch(receiveAccount(Account.responseJSON.results[0]));
    }
}

function shouldFetchAccount(state) {
    const account = state.account;

    if (_.isEmpty(account)) {
        return true;
    } else if (account.isFetching) {
        return false;
    } else {
        return account.didInvalidate;
    }
}

export function fetchAccountIfNeeded() {

    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.

    return (dispatch, getState) => {
        const state = getState();

        if (shouldFetchAccount(state)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchAccount(state));
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
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

        // let robinhood = state.robinhood;

        // Promise.join(
        //     robinhood.portfolios(),
        //     robinhood.disclosures(),
        //     robinhood.portfolioHistoricals({span: 'day', interval: '5minute'}),
        //     robinhood.portfolioHistoricals({span: 'week', interval: '10minute'}),
        //     robinhood.portfolioHistoricals({span: 'year', interval: 'day'}),
        //     robinhood.portfolioHistoricals({span: '5year', interval: 'week'}),
        //     (portfolioRes, disclosuresRes, dayRes, weekRes, yearRes, allRes) => {
        //         const portfolio = processPortfolio(portfolioRes, dayRes, weekRes, yearRes, allRes);
        //         portfolio.disclosures = disclosuresRes.responseJSON.disclosure;
        //         Windows.Storage.ApplicationData.current.localFolder.createFileAsync("portfolio.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
        //             return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(portfolio));
        //         });
        //         dispatch(changeTitle(formatCurrency(portfolio.equity), {floatingTitle: 'Portfolio'}));
        //         dispatch(changePrimaryColor((portfolio.historicals.day.total_return > 0 ? positivePrimaryColor : negativePrimaryColor)));
        //         dispatch(receivePortfolio(portfolio));
        //     }
        // );
        dispatch(changeTitle(formatCurrency(Portfolios.responseJSON.equity), {floatingTitle: 'Portfolio'}));
        dispatch(changePrimaryColor((Portfolios.responseJSON.historicals.day.total_return > 0 ? positivePrimaryColor : negativePrimaryColor)));
        dispatch(receivePortfolio(Portfolios.responseJSON));
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

        // let robinhood = state.robinhood;

        // robinhood.cards().then(function(res) {
        //     let cards = res.responseJSON.results.filter(function(card) {
        //         return card.show_if_unsupported;
        //     });
        //     Windows.Storage.ApplicationData.current.localFolder.createFileAsync("cards.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
        //         return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(cards));
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

        // let robinhood = state.robinhood;

        // robinhood.positions({nonzero: true}).then(function(positions){
        //     var promises = [];
        //     var currentPositions = positions.responseJSON.results.forEach(function(position){
        //         promises.push(robinhood.instrument(position.instrument).then(function(response){
        //             position.instrument = response.responseJSON;
        //             return response.responseJSON.symbol;
        //         }).then(function(symbol){
        //             return Promise.join(
        //                 robinhood.quote_data(symbol),
        //                 robinhood.news(symbol),
        //                 robinhood.fundamentals(symbol),
        //                 robinhood.orders(position.instrument.url),
        //                 robinhood.symbolHistoricals(symbol, {span: 'day', interval: '5minute'}),
        //                 robinhood.symbolHistoricals(symbol, {span: 'week', interval: '10minute'}),
        //                 robinhood.symbolHistoricals(symbol, {span: 'year', interval: 'day'}),
        //                 robinhood.symbolHistoricals(symbol, {span: '5year', interval: 'week'}),
        //                 function(quoteRes, newsRes, fundamentalsRes, ordersRes, dayRes, weekRes, yearRes, allRes) {
        //                     position.quote = quoteRes.responseJSON.results[0];
        //                     position.news = newsRes.responseJSON.results;
        //                     position.fundamentals = fundamentalsRes.responseJSON;
        //                     position.orders = ordersRes.responseJSON.results;
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
        //         positions = _.mapKeys(positions, stock => stock.instrument.symbol);
        //         // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("positions.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
        //         //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(positions));
        //         // });
        //         dispatch(receivePositions(positions));
        //         dispatch(updateStocks(positions));
        //     });
        // });
        dispatch(receivePositions(Positions.responseJSON));
        dispatch(updateStocks(Positions.responseJSON));
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

export const invalidateWatchlist = (watchlist) => {
  return {
    type: 'INVALIDATE_WATCHLIST',
    watchlist
  }
}

function requestWatchlist() {
    return {
        type: 'REQUEST_WATCHLIST'
    };
}

function receiveWatchlist(watchlist) {
    return {
        type: 'RECEIVE_WATCHLIST',
        watchlist,
        receivedAt: Date.now()
    };
}

function fetchWatchlist(state) {
    return dispatch => {
        dispatch(requestWatchlist());

        // let robinhood = state.robinhood;

        // robinhood.watchlists('Default').then(function(watchlist){
        //     var promises = [];
        //     var currentWatchlist = watchlist.responseJSON.results.forEach(function(stock){
        //         promises.push(robinhood.instrument(stock.instrument).then(function(response){
        //             stock.instrument = response.responseJSON;
        //             return response.responseJSON.symbol;
        //         }).then(function(symbol){
        //             if(!state.stocks[symbol]) {
        //                 return Promise.join(
        //                     robinhood.quote_data(symbol),
        //                     robinhood.news(symbol),
        //                     robinhood.fundamentals(symbol),
        //                     robinhood.orders(stock.instrument.url),
        //                     robinhood.symbolHistoricals(symbol, {span: 'day', interval: '5minute'}),
        //                     robinhood.symbolHistoricals(symbol, {span: 'week', interval: '10minute'}),
        //                     robinhood.symbolHistoricals(symbol, {span: 'year', interval: 'day'}),
        //                     robinhood.symbolHistoricals(symbol, {span: '5year', interval: 'week'}),
        //                     function(quoteRes, newsRes, fundamentalsRes, orders, dayRes, weekRes, yearRes, allRes) {
        //                         stock.quote = quoteRes.responseJSON.results[0];
        //                         stock.news = newsRes.responseJSON.results;
        //                         stock.fundamentals = fundamentalsRes.responseJSON;
        //                         stock.orders = ordersRes.responseJSON.results;
        //                         stock.historicals = {
        //                             day: dayRes.responseJSON.historicals,
        //                             week: weekRes.responseJSON.historicals,
        //                             year: yearRes.responseJSON.historicals,
        //                             all: allRes.responseJSON.historicals
        //                         };

        //                         return stock;
        //                     });
        //             }
        //         }));
        //     });
        //     return Promise.all(promises).then(function(watchlist){
        //         watchlist = _.filter(watchlist, stock => _.get(stock, 'instrument.symbol'));
        //         watchlist = _.mapKeys(watchlist, stock => _.get(stock, 'instrument.symbol'));
        //         // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("watchlist.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
        //         //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(watchlist));
        //         // });
        //         dispatch(receiveWatchlist(watchlist));
        //         dispatch(updateStocks(watchlist));
        //     });
        // });
        dispatch(receiveWatchlist(Watchlist.responseJSON));
        dispatch(updateStocks(Watchlist.responseJSON));
    }
}

function shouldFetchWatchlist(state) {
    const watchlist = state.watchlist;

    if (_.isEmpty(watchlist)) {
        return true;
    } else if (watchlist.isFetching) {
        return false;
    } else {
        return watchlist.didInvalidate;
    }
}

export function fetchWatchlistIfNeeded() {

    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.

    return (dispatch, getState) => {
        const state = getState();

        if (shouldFetchWatchlist(state)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchWatchlist(state));
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    };
}