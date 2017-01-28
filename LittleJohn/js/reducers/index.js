import { combineReducers } from 'redux';

import primaryColor from './primary-color';
import robinhood from './robinhood';
import menu from './menu';
import title from './title';
import fixedTitle from './fixed-title';
import pane from './pane';
import portfolio from './portfolio';
import cards from './cards';
import positions from './positions';
import login from './login';

const LittleJohnApp = combineReducers({
    primaryColor,
    robinhood,
    menu,
    title,
    fixedTitle,
    pane,
    portfolio,
    cards,
    positions,
    login
});

export default LittleJohnApp