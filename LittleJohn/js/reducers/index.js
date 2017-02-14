﻿import { combineReducers } from 'redux';

import primaryColor from './primary-color';
import robinhood from './robinhood';
import menu from './menu';
import settings from './settings';
import title from './title';
import pane from './pane';
import portfolio from './portfolio';
import cards from './cards';
import positions from './positions';
import login from './login';
import stocks from './stocks';

const LittleJohnApp = combineReducers({
    primaryColor,
    robinhood,
    menu,
    settings,
    title,
    pane,
    portfolio,
    cards,
    positions,
    login,
    stocks
});

export default LittleJohnApp