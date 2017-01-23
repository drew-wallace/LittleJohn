"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rgbHex from 'rgb-hex';

import LittleJohnApp from './reducers';
import Robinhood from './robinhood';
import processPortfolio from './lib/process-portfolio';

import LoginPage from './containers/login-page';

import env from "../env";
import Portfolios from '../data/portfolios';
import Day from '../data/day';
import Week from '../data/week';
import Year from '../data/year';
import AllTime from '../data/5year';
import Positions from '../data/positions';

let app = WinJS.Application;
const activation = Windows.ApplicationModel.Activation;

const uiSettings = new Windows.UI.ViewManagement.UISettings();
const rgba = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accent);
const cssColorString = rgbHex(rgba.r, rgba.g, rgba.b);

let portfolio = processPortfolio(Portfolios, Day, Week, Year, AllTime);

let sessionState = app.sessionState;

const initialState = {
    title: 'Portfolio',
    menu: false,
    portfolio: portfolio || [],
    cards: env.cards.results || [],
    positions: Positions.responseJSON || [],
    robinhood: new Robinhood(env.robinhoodSession || sessionState.robinhoodSession)
};
let store = createStore(LittleJohnApp, initialState);


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
                <LoginPage app={app} cssColorString={cssColorString}/>
            </Provider>,
            document.getElementById('main')
        );
    }
};

app.oncheckpoint = function (args) {
    // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
    // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
    // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
};

app.start();