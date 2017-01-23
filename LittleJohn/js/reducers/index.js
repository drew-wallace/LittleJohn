import { combineReducers } from 'redux';
import auth from './auth';
import api from './api';
import menu from './menu';
import title from './title';
import pane from './pane';
import portfolio from './portfolio';
import cards from './cards';
import positions from './positions';

const LittleJohnApp = combineReducers({
    auth,
    api,
    menu,
    title,
    pane,
    portfolio,
    cards,
    positions,
})

export default LittleJohnApp