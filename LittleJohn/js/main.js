"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger'
import _ from 'lodash';
// import rgbHex from 'rgb-hex';

import LittleJohnApp from './reducers';
import Robinhood from './lib/robinhood';
import processPortfolio from './lib/process-portfolio';

import LoginPage from './containers/login-page';

import env from "../env";

import styles from './styles';

let app = WinJS.Application;
const activation = Windows.ApplicationModel.Activation;

// const uiSettings = new Windows.UI.ViewManagement.UISettings();
// const rgba = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accent);
// const cssColorString = rgbHex(rgba.r, rgba.g, rgba.b);

const { positivePrimaryColor } = styles;
const robinhood = new Robinhood(env.robinhoodSession);

const initialState = {
    title: {
        past: [],
        present: {
            fixedTitle: '$0.00',
            floatingTitle: 'Portfolio',
            isStock: false,
            isPosition: false,
            isWatchlist: false,
        },
        future: []
    },
    menu: false,
    settings: {
        displayedValue: 'price',
    },
    portfolio: {},
    cards: {},
    positions: {},
    watchlist: {},
    robinhood,
    login: robinhood.isLoggedIn(),
    primaryColor: positivePrimaryColor
};
const loggerMiddleware = createLogger();
let store = createStore(LittleJohnApp, initialState,
    applyMiddleware(
        thunkMiddleware/*,
        loggerMiddleware*/
    )
);

app.onactivated = function (args) {
    if (args.detail.kind === activation.ActivationKind.launch) {
        if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            // TODO: This application has been newly launched. Initialize your application here.
        } else {
            // TODO: This application was suspended and then terminated.
            // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
        }


        ReactDOM.render(
            <Provider store={store}>
                <LoginPage />
            </Provider>,
            document.getElementById('main')
        );
    }
};

app.oncheckpoint = function (args) {
    // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
    // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
    // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().

    const state = store.getState();
    app.sessionState = {...state};
};

app.start();