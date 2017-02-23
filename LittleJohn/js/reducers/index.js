import { combineReducers } from 'redux';

import primaryColor from './primary-color';
import robinhood from './robinhood';
import menu from './menu';
import settings from './settings';
import title from './title';
import account from './account';
import portfolio from './portfolio';
import cards from './cards';
import positions from './positions';
import watchlist from './watchlist';
import login from './login';
import stocks from './stocks';

const LittleJohnApp = combineReducers({
    primaryColor,
    robinhood,
    menu,
    settings,
    title,
    account,
    portfolio,
    cards,
    positions,
    watchlist,
    login,
    stocks
});

export default LittleJohnApp