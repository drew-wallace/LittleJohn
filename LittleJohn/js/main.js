"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import NavPane from './nav-pane';
// import Sidebar from './sidebar';
import rgbHex from 'rgb-hex';
import env from '../env.js';

let app = WinJS.Application;
const activation = Windows.ApplicationModel.Activation;

const uiSettings = new Windows.UI.ViewManagement.UISettings();
const rgba = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accent);

const cssColorString = rgbHex(rgba.r, rgba.g, rgba.b);

app.onactivated = function (args) {
    if (args.detail.kind === activation.ActivationKind.launch) {
        if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            // TODO: This application has been newly launched. Initialize your application here.
        } else {
            // TODO: This application was suspended and then terminated.
            // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
        }

        ReactDOM.render(<div style={{backgroundColor: '#6DAD62', position: 'absolute', display: 'flex', height: '100%', width: '100%'}}><NavPane color={cssColorString}/></div>, document.getElementById('main'));
        // ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}><Sidebar/></MuiThemeProvider>, document.getElementById('main'));

        // var allFeatures = [
        //     {
        //         title: "investment_profile",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "investmentProfileButton",
        //         outputId: "investmentProfileOutput"
        //     },
        //     {
        //         title: "instruments",
        //         inputArray: new WinJS.Binding.List([
        //             {
        //                 label: "Type a symbol", id: "instrumentsInput"
        //             },
        //         ]),
        //         buttonId: "instrumentsButton",
        //         outputId: "instrumentsOutput"
        //     },
        //     {
        //         title: "quote_data",
        //         inputArray: new WinJS.Binding.List([
        //             {
        //                 label: "Type a symbol", id: "quoteInput"
        //             },
        //         ]),
        //         buttonId: "quoteButton",
        //         outputId: "quoteOutput"
        //     },
        //     {
        //         title: "accounts",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "accountsButton",
        //         outputId: "accountsOutput"
        //     },
        //     {
        //         title: "portfolios",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "portfoliosButton",
        //         outputId: "portfoliosOutput"
        //     },
        //     {
        //         title: "user",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "userButton",
        //         outputId: "userOutput"
        //     },
        //     {
        //         title: "dividends",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "dividendsButton",
        //         outputId: "dividendsOutput"
        //     },
        //     {
        //         title: "orders",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "ordersButton",
        //         outputId: "ordersOutput"
        //     },
        //     {
        //         title: "place_buy_order/place_sell_order",
        //         inputArray: new WinJS.Binding.List([
        //             {label: "Type a transaction ('buy' or 'sell')", id: "placeOrderTransactionInput"},
        //             {label: "Type an instrument.url", id: "placeOrderInstrumentUrlInput"},
        //             {label: "Type a bid_price", id: "placeOrderBidPriceInput"},
        //             {label: "Type a stop_price", id: "placeOrderStopPriceInput"},
        //             {label: "Type a quantity", id: "placeOrderQuantityInput"},
        //             {label: "Type an instrument.symbol", id: "placeOrderInstrumentSymbolInput"},
        //             {label: "Type a time (???, 'gtc', or 'gfd')", id: "placeOrderTimeInput"},
        //             {label: "Type a trigger (??? or 'immediate')", id: "placeOrderTriggerInput"},
        //             {label: "Type a type (???, 'limit', or 'market')", id: "placeOrderTypeInput"}
        //         ]),
        //         buttonId: "placeOrderButton",
        //         outputId: "placeOrderOutput"
        //     },
        //     {
        //         title: "positions",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "positionsButton",
        //         outputId: "positionsOutput"
        //     },
        //     {
        //         title: "historicals",
        //         inputArray: new WinJS.Binding.List([]),
        //         buttonId: "historicalsButton",
        //         outputId: "historicalsOutput"
        //     }
        // ]

        // var loginButton = document.querySelector("#loginButton");
        // loginButton.addEventListener("click", loginButtonClickHandler, false);

        // document.querySelector('.one-day-chart').addEventListener("contextmenu", function(e){ e.preventDefault();});
        // document.querySelector(".one-week-chart").addEventListener("contextmenu", function(e){ e.preventDefault();});
        // document.querySelector(".one-month-chart").addEventListener("contextmenu", function(e){ e.preventDefault();});
        // document.querySelector(".three-month-chart").addEventListener("contextmenu", function(e){ e.preventDefault();});
        // document.querySelector(".one-year-chart").addEventListener("contextmenu", function(e){ e.preventDefault();});
        // document.querySelector(".five-year-chart").addEventListener("contextmenu", function(e){ e.preventDefault();});

        // Array.prototype.slice.call(document.querySelectorAll('.chart-tab > a')).forEach(function(e){
        //     e.addEventListener("click", chartNavClickHandler, false);
        // });

        // var investmentProfileButton = document.querySelector(".investmentProfileButton");
        // investmentProfileButton.addEventListener("click", investmentProfileButtonClickHandler, false);

        // var instrumentsButton = document.querySelector(".instrumentsButton");
        // instrumentsButton.addEventListener("click", instrumentsButtonClickHandler, false);

        // var quoteButton = document.querySelector(".quoteButton");
        // quoteButton.addEventListener("click", quoteButtonClickHandler, false);

        // var accountsButton = document.querySelector(".accountsButton");
        // accountsButton.addEventListener("click", accountsButtonClickHandler, false);

        // var userButton = document.querySelector(".userButton");
        // userButton.addEventListener("click", userButtonClickHandler, false);

        // var dividendsButton = document.querySelector(".dividendsButton");
        // dividendsButton.addEventListener("click", dividendsButtonClickHandler, false);

        // var ordersButton = document.querySelector(".ordersButton");
        // ordersButton.addEventListener("click", ordersButtonClickHandler, false);

        // var placeOrderButton = document.querySelector(".placeOrderButton");
        // placeOrderButton.addEventListener("click", placeOrderButtonClickHandler, false);

        // var positionsButton = document.querySelector(".positionsButton");
        // positionsButton.addEventListener("click", positionsButtonClickHandler, false);

        // var portfoliosButton = document.querySelector(".portfoliosButton");
        // portfoliosButton.addEventListener("click", portfoliosButtonClickHandler, false);

        // var historicalsButton = document.querySelector(".historicalsButton");
        // historicalsButton.addEventListener("click", historicalsButtonClickHandler, false);
    }
};

app.oncheckpoint = function (args) {
    // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
    // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
    // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
};

// function loginButtonClickHandler(eventInfo) {
//     // var usernameInput = document.querySelector("#username").value;
//     // var passwordInput = document.querySelector("#password").value;
//     // var loggedIn = robinhood.login(usernameInput, passwordInput);
//     var loggedIn = robinhood.login(env.username, env.password);
//     if(loggedIn) {
//         document.getElementById("loginScreen").classList.remove("display-table");
//         document.getElementById("loginScreen").classList.add("hide");
//         document.getElementById("app").classList.remove("hide");

//         var oneDayChart = new D3LineChart("#oneDay > .one-day-chart", ".tab-content"),
//             oneWeekChart = new D3LineChart("#oneWeek > .one-week-chart", ".tab-content"),
//             oneMonthChart = new D3LineChart("#oneMonth > .one-month-chart", ".tab-content"),
//             threeMonthChart = new D3LineChart("#threeMonth > .three-month-chart", ".tab-content"),
//             oneYearChart = new D3LineChart("#oneYear > .one-year-chart", ".tab-content"),
//             fiveYearChart = new D3LineChart("#fiveYear > .five-year-chart", ".tab-content");

//         window.addEventListener('resize', function() {
//             oneDayChart.redrawChart();
//             oneWeekChart.redrawChart();
//             oneMonthChart.redrawChart();
//             threeMonthChart.redrawChart();
//             oneYearChart.redrawChart();
//             fiveYearChart.redrawChart();
//         });

//         function getAndShowChartData() {
//             var data = Portfolios.results[0];
//             data.equity = +data.equity;
//             data.extended_hours_equity = +data.extended_hours_equity;

//             document.getElementById('portfolio-header').innerText = _formatCurrency(data.equity);

//             var afterHoursReturn = data.extended_hours_equity - data.equity,
//                 afterHoursPercentReturn = afterHoursReturn / data.equity,
//                 afterHoursText = _formatCurrency(data.extended_hours_equity) + ' ' + _formatCurrencyDiff(afterHoursReturn) + ' (' + _formatPercentDiff(afterHoursPercentReturn) + ') After-hours';

//             document.getElementById('after-hours-sub-header').innerText = afterHoursText;

//             // time
//             function day(equity) {
//                 var data = Day.equity_historicals,
//                     startingEquity = +data[0].adjusted_open_equity,
//                     endingEquity = equity,
//                     netReturn = endingEquity - startingEquity,
//                     netPercentReturn = netReturn / startingEquity,
//                     equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//                 document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;
//                 document.getElementById('current-equity-change-sub-header').originalValue = equityChangeText;
//                 document.getElementById('current-equity-change-sub-header').oneDayValue = equityChangeText;

//                 oneDayChart.setup(data, 'adjusted_open_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//                 oneDayChart.redrawChart();
//             };

//             // time and Month Day
//             function week(equity) {
//                 var data = Week.equity_historicals,
//                     startingEquity = +data[0].adjusted_open_equity,
//                     endingEquity = equity,
//                     netReturn = endingEquity - startingEquity,
//                     netPercentReturn = netReturn / startingEquity,
//                     equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//                 document.getElementById('current-equity-change-sub-header').oneWeekValue = equityChangeText;

//                 oneWeekChart.setup(data, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//                 oneWeekChart.redrawChart();
//             };

//             // Month Day, Year
//             function year(equity) {
//                 // var data = Year.equity_historicals.slice(Year.equity_historicals.length - 30, Year.equity_historicals.length),
//                 var threeMonthData = [],
//                     monthData = [],
//                     data = [];

//                 Year.equity_historicals.forEach(function(v,i){
//                     if(!moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment('08/13/2015').hour(0).minute(0).second(0))) return;
//                     if(moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment().hour(0).minute(0).second(0).subtract(3, 'month'))) {
//                         threeMonthData.push(Object.assign({}, v));
//                         if(moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment().hour(0).minute(0).second(0).subtract(1, 'month'))) {
//                             monthData.push(Object.assign({}, v));
//                         }
//                     }
//                     data.push(Object.assign({}, v));
//                 });


//                 // STARTS SEPT 3, 2015, ENDS SEPT 1
//                 var startingEquity = +data[0].adjusted_open_equity,
//                     endingEquity = equity,
//                     netReturn = endingEquity - startingEquity,
//                     netPercentReturn = netReturn / startingEquity,
//                     equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//                 document.getElementById('current-equity-change-sub-header').oneYearValue = equityChangeText;

//                 oneYearChart.setup(data, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//                 oneYearChart.redrawChart();


//                 // STARTS JUNE 7, ENDS SEPT 1
//                 startingEquity = +threeMonthData[0].adjusted_open_equity;
//                 endingEquity = equity;
//                 netReturn = endingEquity - startingEquity;
//                 netPercentReturn = netReturn / startingEquity;
//                 equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//                 document.getElementById('current-equity-change-sub-header').threeMonthValue = equityChangeText;

//                 threeMonthChart.setup(threeMonthData, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//                 threeMonthChart.redrawChart();


//                 // STARTS AUG 7, ENDS SEPT 1
//                 startingEquity = +monthData[0].adjusted_open_equity;
//                 endingEquity = equity;
//                 netReturn = endingEquity - startingEquity;
//                 netPercentReturn = netReturn / startingEquity;
//                 equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//                 document.getElementById('current-equity-change-sub-header').oneMonthValue = equityChangeText;

//                 oneMonthChart.setup(monthData, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//                 oneMonthChart.redrawChart();
//             };

//             // Month Day, Year
//             function fiveYear(equity) {
//                 // STARTS SEPT 21, 2015, ENDS SEPT 1
//                 var data = FiveYear.equity_historicals.filter(function(v,i){
//                         return moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment('08/13/2015').hour(0).minute(0).second(0));
//                     }),
//                     startingEquity = +data[0].adjusted_open_equity,
//                     endingEquity = equity,
//                     netReturn = endingEquity - startingEquity,
//                     netPercentReturn = netReturn / startingEquity,
//                     equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//                 document.getElementById('current-equity-change-sub-header').fiveYearValue = equityChangeText;

//                 fiveYearChart.setup(data, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//                 fiveYearChart.redrawChart();
//             };

//             function positions(){
//                 window.positionsList = new WinJS.Binding.List(Positions);
//                 document.getElementById('positionsListView').winControl.data = window.positionsList;
//             };

//             day(data.equity);
//             week(data.equity);
//             year(data.equity);
//             fiveYear(data.equity);
//             positions();
//         }

//         getAndShowChartData();

//         // robinhood.portfolios().then(function (res) {
//         //     var data = res.responseJSON.results[0];
//         //     // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("portfolios.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
//         //     //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, res.responseText);
//         //     // });
//         //     data.equity = +data.equity;
//         //     data.extended_hours_equity = +data.extended_hours_equity;

//         //     document.getElementById('portfolio-header').innerText = _formatCurrency(data.equity);

//         //     var afterHoursReturn = data.extended_hours_equity - data.equity,
//         //         afterHoursPercentReturn = afterHoursReturn / data.equity,
//         //         afterHoursText = _formatCurrency(data.extended_hours_equity) + ' ' + _formatCurrencyDiff(afterHoursReturn) + ' (' + _formatPercentDiff(afterHoursPercentReturn) + ') After-hours';

//         //     document.getElementById('after-hours-sub-header').innerText = afterHoursText;

//         //     return data.equity;
//         // }).then(function(equity) {
//         //     // time
//         //     robinhood.historicals({span: 'day', interval: '5minute'}).then(function (res) {
//         //         var data = res.responseJSON.equity_historicals,
//         //             startingEquity = +data[0].adjusted_open_equity,
//         //             endingEquity = equity,
//         //             netReturn = endingEquity - startingEquity,
//         //             netPercentReturn = netReturn / startingEquity,
//         //             equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//         //         // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("day.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
//         //         //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, res.responseText);
//         //         // });

//         //         document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;

//         //         oneDayChart.setup(data, "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//         //         oneDayChart.redrawChart();
//         //     });

//         //     // time and Month Day
//         //     robinhood.historicals({span: 'week', interval: '10minute'}).then(function (res) {
//         //         var data = res.responseJSON.equity_historicals,
//         //             startingEquity = +data[0].adjusted_open_equity,
//         //             endingEquity = equity,
//         //             netReturn = endingEquity - startingEquity,
//         //             netPercentReturn = netReturn / startingEquity,
//         //             equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//         //         // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("week.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
//         //         //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, res.responseText);
//         //         // });

//         //         document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;

//         //         oneWeekChart.setup(data, "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//         //         oneWeekChart.redrawChart();
//         //     });

//         //     // Month Day, Year
//         //     robinhood.historicals({span: 'year', interval: 'day'}).then(function (res) {
//         //         var data = res.responseJSON.equity_historicals.slice(res.responseJSON.equity_historicals.length - 1 - 30, res.responseJSON.equity_historicals.length),
//         //             startingEquity = +data[0].adjusted_open_equity,
//         //             endingEquity = equity,
//         //             netReturn = endingEquity - startingEquity,
//         //             netPercentReturn = netReturn / startingEquity,
//         //             equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//         //         // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
//         //         //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, res.responseText);
//         //         // });

//         //         document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;

//         //         oneMonthChart.setup(data, "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//         //         oneMonthChart.redrawChart();

//         //         data = res.responseJSON.equity_historicals.slice(res.responseJSON.equity_historicals.length - 1 - 90, res.responseJSON.equity_historicals.length);
//         //         startingEquity = +data[0].adjusted_open_equity;
//         //         endingEquity = equity;
//         //         netReturn = endingEquity - startingEquity;
//         //         netPercentReturn = netReturn / startingEquity;
//         //         equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//         //         document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;

//         //         threeMonthChart.setup(data, "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//         //         threeMonthChart.redrawChart();

//         //         data = res.responseJSON.equity_historicals;
//         //         startingEquity = +data[0].adjusted_open_equity;
//         //         endingEquity = equity;
//         //         netReturn = endingEquity - startingEquity;
//         //         netPercentReturn = netReturn / startingEquity;
//         //         equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//         //         document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;

//         //         oneYearChart.setup(data, "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//         //         oneYearChart.redrawChart();
//         //     });

//         //     // Month Day, Year
//         //     robinhood.historicals({span: '5year', interval: 'week'}).then(function (res) {
//         //         var data = res.responseJSON.equity_historicals,
//         //             startingEquity = +data[0].adjusted_open_equity,
//         //             endingEquity = equity,
//         //             netReturn = endingEquity - startingEquity,
//         //             netPercentReturn = netReturn / startingEquity,
//         //             equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

//         //         // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("5year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
//         //         //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, res.responseText);
//         //         // });

//         //         document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;

//         //         fiveYearChart.setup(data, "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
//         //         fiveYearChart.redrawChart();
//         //     });

//         //     robinhood.positions({nonzero: false}).then(function(positions){
//         //         var promises = [];
//         //         var currentPositions = positions.responseJSON.results.filter(function(position){
//         //             promises.push(robinhood.instrument(position.instrument).then(function(response){
//         //                 position.instrument = response.responseJSON;
//         //                 return response.responseJSON.symbol;
//         //             }).then(function(symbol){
//         //                 return robinhood.quote_data(symbol);
//         //             }).then(function(response){
//         //                 position.quote = response.responseJSON.results[0];
//         //                 position.quote.last_trade_price_text = _formatCurrency(position.quote.last_trade_price);
//         //                 return position;
//         //             }));
//         //         });
//         //         return Promise.all(promises).then(function(positions){
//         //             // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("positions.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
//         //             //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(positions));
//         //             // });
//         //             window.positionsList = new WinJS.Binding.List(positions);
//         //             document.getElementById('positionsListView').winControl.data = window.positionsList;
//         //         })
//         //     });
//         // });
//     }
// }

// function chartNavClickHandler(eventInfo){
//     var tab = this.getAttribute('href').substring(1);
//     document.getElementById('current-equity-change-sub-header').innerText = document.getElementById('current-equity-change-sub-header')[tab + 'Value'];
// }

// function investmentProfileButtonClickHandler(eventInfo) {
//     var investmentProfileOutput = document.querySelector(".investmentProfileOutput");
//     var loadingString = "Loading...";
//     investmentProfileOutput.innerText = loadingString;

//     robinhood.investment_profile().then(function (res) {
//         investmentProfileOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function instrumentsButtonClickHandler(eventInfo) {
//     var instrumentsOutput = document.querySelector(".instrumentsOutput");
//     var instrumentsInput = document.querySelector(".instrumentsInput").value;
//     var loadingString = "Loading...";
//     instrumentsOutput.innerText = loadingString;

//     robinhood.instruments(instrumentsInput).then(function (res) {
//         instrumentsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function quoteButtonClickHandler(eventInfo) {
//     var quoteInput = document.querySelector(".quoteInput").value;
//     var quoteOutput = document.querySelector(".quoteOutput");
//     var loadingString = "Loading...";
//     quoteOutput.innerText = loadingString;

//     robinhood.quote_data(quoteInput).then(function (res) {
//         quoteOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function accountsButtonClickHandler(eventInfo) {
//     var accountsOutput = document.querySelector(".accountsOutput");
//     var loadingString = "Loading...";
//     accountsOutput.innerText = loadingString;

//     robinhood.accounts().then(function (res) {
//         accountsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function userButtonClickHandler(eventInfo) {
//     var userOutput = document.querySelector(".userOutput");
//     var loadingString = "Loading...";
//     userOutput.innerText = loadingString;

//     robinhood.user().then(function (res) {
//         userOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function dividendsButtonClickHandler(eventInfo) {
//     var dividendsOutput = document.querySelector(".dividendsOutput");
//     var loadingString = "Loading...";
//     dividendsOutput.innerText = loadingString;

//     robinhood.dividends().then(function (res) {
//         dividendsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function ordersButtonClickHandler(eventInfo) {
//     var ordersOutput = document.querySelector(".ordersOutput");
//     var loadingString = "Loading...";
//     ordersOutput.innerText = loadingString;

//     robinhood.orders().then(function (res) {
//         ordersOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function placeOrderButtonClickHandler(eventInfo) {
//     var placeOrderTransactionInput = document.querySelector(".placeOrderTransactionInput").value;
//     var placeOrderInstrumentUrlInput = document.querySelector(".placeOrderInstrumentUrlInput").value;
//     var placeOrderBidPriceInput = document.querySelector(".placeOrderBidPriceInput").value;
//     var placeOrderStopPriceInput = document.querySelector(".placeOrderStopPriceInput").value;
//     var placeOrderQuantityInput = document.querySelector(".placeOrderQuantityInput").value;
//     var placeOrderInstrumentSymbolInput = document.querySelector(".placeOrderInstrumentSymbolInput").value;
//     var placeOrderTimeInput = document.querySelector(".placeOrderTimeInput").value;
//     var placeOrderTriggerInput = document.querySelector(".placeOrderTriggerInput").value;
//     var placeOrderTypeInput = document.querySelector(".placeOrderTypeInput").value;
//     var placeOrderOutput = document.querySelector(".placeOrderOutput");
//     var loadingString = "Loading...";
//     var options = {
//         transaction: placeOrderTransactionInput,
//         instrument: {
//             url: placeOrderInstrumentUrlInput,
//             symbol: placeOrderInstrumentSymbolInput.toUpperCase()
//         },
//         bid_price: placeOrderBidPriceInput,
//         stop_price: placeOrderStopPriceInput,
//         quantity: placeOrderQuantityInput,
//         time: placeOrderTimeInput,
//         trigger: placeOrderTriggerInput,
//         type: documentplaceOrderTypeInput
//     };
//     placeOrderOutput.innerText = loadingString;

//     if (placeOrderTransactionInput === 'buy') {
//         robinhood.place_buy_order(options).then(function (res) {
//             placeOrderOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//         });
//     } else if (placeOrderTransactionInput === 'buy') {
//         robinhood.place_sell_order(options).then(function (res) {
//             placeOrderOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//         });
//     }
// }

// function positionsButtonClickHandler(eventInfo) {
//     var positionsOutput = document.querySelector(".positionsOutput");
//     var loadingString = "Loading...";
//     positionsOutput.innerText = loadingString;

//     robinhood.positions().then(function (res) {
//         positionsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function portfoliosButtonClickHandler(eventInfo) {
//     var portfoliosOutput = document.querySelector(".portfoliosOutput");
//     var loadingString = "Loading...";
//     portfoliosOutput.innerText = loadingString;

//     robinhood.portfolios().then(function (res) {
//         portfoliosOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

// function historicalsButtonClickHandler(eventInfo) {
//     var historicalsOutput = document.querySelector(".historicalsOutput");
//     var loadingString = "Loading...";
//     historicalsOutput.innerText = loadingString;

//     robinhood.historicals({span: 'day', interval: '5minute'}).then(function (res) {
//         console.log(res);
//         historicalsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
//     });
// }

app.start();