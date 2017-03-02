import { combineReducers } from 'redux';

import primaryColor from './primary-color';
import robinhood from './robinhood';
import menu from './menu';
import settings from './settings';
import title from './title';
import pane from './pane';
import account from './account';
import portfolio from './portfolio';
import cards from './cards';
import positions from './positions';
import watchlist from './watchlist';
import login from './login';
import stocks from './stocks';
import currentOrder from './current-order';

const LittleJohnApp = combineReducers({
    primaryColor,
    robinhood,
    menu,
    settings,
    title,
    pane,
    account,
    portfolio,
    cards,
    positions,
    watchlist,
    login,
    stocks,
    currentOrder
});

export default LittleJohnApp