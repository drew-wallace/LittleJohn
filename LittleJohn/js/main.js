(function () {
    "use strict";
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var robinhood = new Robinhood();

    var uiSettings = new Windows.UI.ViewManagement.UISettings();
    var rgba = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accent);
    var cssColorString = "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + ", " + rgba.a + ")";
    // document.querySelector('.nav-row').style.background = cssColorString;

    // item param is an HTML element.
    function _listenForSwipe (item) {
        var context = new Object();
        item.addEventListener("MSGestureStart", function (e) {
            console.log("STARTING...");
            //if (e.pointerType == 2) {
            // if (e.pointerType == "touch") {
                context._gestureInfos = new Object();
                context._gestureInfos.started = true;
                context._gestureInfos.position = new Object();
                context._gestureInfos.position.x = e.screenX;
                context._gestureInfos.position.y = e.screenY;
                context._gestureInfos.startTime = Math.round(new Date().getTime() / 1000); //Unix Timestamp
            // }
        });

        item.addEventListener("MSGestureEnd", function (e) {
            console.log("ENDING...", context._gestureInfos.started);
            console.log(context._gestureInfos);
            if (/*e.pointerType == "touch" && */context._gestureInfos && context._gestureInfos.started) {
                var ts = Math.round(new Date().getTime() / 1000);
                if (
                    // Math.abs(e.screenY - context._gestureInfos.position.y) < 50 &&
                    // ts - context._gestureInfos.startTime <= 1 &&
                    Math.abs(e.screenX - context._gestureInfos.position.x) > window.screen.availWidth * 0.2) {
                    //Gesture done - valid swipe!
                    if (e.screenX > context._gestureInfos.position.x)
                        console.log("right swipe!");
                    else
                        console.log("left swipe!");
                }
                context._gestureInfos.started = false;
            }
        });
    }

    function _getValue(obj, path) {
        if (path) {
            for (var i = 0, len = path.length; i < len && (obj !== null && obj !== undefined) ; i++) {
                obj = obj[path[i]];
            }
        }
        return obj;
    }

    WinJS.Namespace.define("BindingHelpers", {
        appendToClasses: WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var appendHelper = function () {
                WinJS.Utilities.addClass(dest, _getValue(source, sourceProperty));
            };
            return WinJS.Binding.bind(source, { sourceProperty: appendHelper });
        })
    });

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize your application here.
            } else {
                // TODO: This application was suspended and then terminated.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
            }

            // var myGesture = new MSGesture();
            // var elm = document.getElementById("portfolio-news-card");
            // _listenForSwipe(elm);
            // myGesture.target = elm;
            // elm.addEventListener("pointerdown", function (evt) {
            //     // adds the current mouse, pen, or touch contact for gesture recognition
            //     console.log(myGesture.target, evt.pointerId, evt.pointerType);
            //     if(!myGesture.target) myGesture.target = this;
            //     myGesture.addPointer(evt.pointerId);
            // });

            var nodesArray = [].slice.call(document.querySelectorAll(".news-card")).map(function(card){
                var myGesture = new MSGesture();
                _listenForSwipe(card);
                myGesture.target = card;
                card.addEventListener("pointerdown", function (evt) {
                    // adds the current mouse, pen, or touch contact for gesture recognition
                    console.log(evt);
                    // console.log(myGesture.target, evt.pointerId, evt.pointerType);
                    if(!myGesture.target) myGesture.target = this;
                    myGesture.addPointer(evt.pointerId);
                });
            });

            //SPLIT VIEW
            var mySplitView = window.mySplitView = {
                splitView: null,
                tabClicked: WinJS.UI.eventHandler(function (ev) {
                    var tabId = ev.currentTarget.dataset.tabId,
                        activeTab = document.querySelector(".main-tab.active"),
                        clickedTab = document.getElementById(tabId+"-ui");

                    activeTab.classList.add("hide");
                    activeTab.classList.remove("active");
                    clickedTab.classList.add("active");
                    clickedTab.classList.remove("hide");
                }),
            };
            //END SPLIT VIEW

            var allFeatures = [
                {
                    title: "investment_profile",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "investmentProfileButton",
                    outputId: "investmentProfileOutput"
                },
                {
                    title: "instruments",
                    inputArray: new WinJS.Binding.List([
                        {
                            label: "Type a symbol", id: "instrumentsInput"
                        },
                    ]),
                    buttonId: "instrumentsButton",
                    outputId: "instrumentsOutput"
                },
                {
                    title: "quote_data",
                    inputArray: new WinJS.Binding.List([
                        {
                            label: "Type a symbol", id: "quoteInput"
                        },
                    ]),
                    buttonId: "quoteButton",
                    outputId: "quoteOutput"
                },
                {
                    title: "accounts",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "accountsButton",
                    outputId: "accountsOutput"
                },
                {
                    title: "user",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "userButton",
                    outputId: "userOutput"
                },
                {
                    title: "dividends",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "dividendsButton",
                    outputId: "dividendsOutput"
                },
                {
                    title: "orders",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "ordersButton",
                    outputId: "ordersOutput"
                },
                {
                    title: "place_buy_order/place_sell_order",
                    inputArray: new WinJS.Binding.List([
                        {label: "Type a transaction ('buy' or 'sell')", id: "placeOrderTransactionInput"},
                        {label: "Type an instrument.url", id: "placeOrderInstrumentUrlInput"},
                        {label: "Type a bid_price", id: "placeOrderBidPriceInput"},
                        {label: "Type a stop_price", id: "placeOrderStopPriceInput"},
                        {label: "Type a quantity", id: "placeOrderQuantityInput"},
                        {label: "Type an instrument.symbol", id: "placeOrderInstrumentSymbolInput"},
                        {label: "Type a time (???, 'gtc', or 'gfd')", id: "placeOrderTimeInput"},
                        {label: "Type a trigger (??? or 'immediate')", id: "placeOrderTriggerInput"},
                        {label: "Type a type (???, 'limit', or 'market')", id: "placeOrderTypeInput"}
                    ]),
                    buttonId: "placeOrderButton",
                    outputId: "placeOrderOutput"
                },
                {
                    title: "positions",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "positionsButton",
                    outputId: "positionsOutput"
                },
                {
                    title: "portfolios",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "portfoliosButton",
                    outputId: "portfoliosOutput"
                },
                {
                    title: "historicals",
                    inputArray: new WinJS.Binding.List([]),
                    buttonId: "historicalsButton",
                    outputId: "historicalsOutput"
                }
            ]

            //create an array of trails to turn the allTrails object into an array
            var featuresArray = [];

            //add each trail in the allTrails object into the trailArray
            for (var i = 0; i < allFeatures.length ; ++i) {
                featuresArray.push(allFeatures[i]);
            }

            //create a binding list out of the trailArray we just created
            var myFeatureList = window.myFeaturesList = {
                data: new WinJS.Binding.List(featuresArray)
            };

            args.setPromise(WinJS.UI.processAll().then(function () {
                mySplitView.splitView = document.querySelector(".splitView").winControl;
                new WinJS.UI._WinKeyboard(mySplitView.splitView.paneElement);
            }));

            // Retrieve the button and register our event handler.
            var loginButton = document.querySelector("#loginButton");
            loginButton.addEventListener("click", loginButtonClickHandler, false);

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


    function loginButtonClickHandler(eventInfo) {
        // var usernameInput = document.querySelector("#username").value;
        // var passwordInput = document.querySelector("#password").value;
        // var loggedIn = robinhood.login(usernameInput, passwordInput);
        if(loggedIn) {
            document.getElementById("loginScreen").classList.remove("display-table");
            document.getElementById("loginScreen").classList.add("hide");
            document.getElementById("app").classList.remove("hide");

            var chart = new D3LineChart("#oneDay > .day-chart");

            robinhood.historicals({span: 'day', interval: '5minute'}).then(function (res) {
                console.log(JSON.parse(res.response));
                var data = JSON.parse(res.response).equity_historicals
                chart.setup(data, "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
                chart.redrawChart();
                window.addEventListener('resize', function() {chart.redrawChart()});
            });
        }
    }

    function investmentProfileButtonClickHandler(eventInfo) {
        var investmentProfileOutput = document.querySelector(".investmentProfileOutput");
        var loadingString = "Loading...";
        investmentProfileOutput.innerText = loadingString;

        robinhood.investment_profile().then(function (res) {
            investmentProfileOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function instrumentsButtonClickHandler(eventInfo) {
        var instrumentsOutput = document.querySelector(".instrumentsOutput");
        var instrumentsInput = document.querySelector(".instrumentsInput").value;
        var loadingString = "Loading...";
        instrumentsOutput.innerText = loadingString;

        robinhood.instruments(instrumentsInput).then(function (res) {
            instrumentsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function quoteButtonClickHandler(eventInfo) {
        var quoteInput = document.querySelector(".quoteInput").value;
        var quoteOutput = document.querySelector(".quoteOutput");
        var loadingString = "Loading...";
        quoteOutput.innerText = loadingString;

        robinhood.quote_data(quoteInput).then(function (res) {
            quoteOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function accountsButtonClickHandler(eventInfo) {
        var accountsOutput = document.querySelector(".accountsOutput");
        var loadingString = "Loading...";
        accountsOutput.innerText = loadingString;

        robinhood.accounts().then(function (res) {
            accountsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function userButtonClickHandler(eventInfo) {
        var userOutput = document.querySelector(".userOutput");
        var loadingString = "Loading...";
        userOutput.innerText = loadingString;

        robinhood.user().then(function (res) {
            userOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function dividendsButtonClickHandler(eventInfo) {
        var dividendsOutput = document.querySelector(".dividendsOutput");
        var loadingString = "Loading...";
        dividendsOutput.innerText = loadingString;

        robinhood.dividends().then(function (res) {
            dividendsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function ordersButtonClickHandler(eventInfo) {
        var ordersOutput = document.querySelector(".ordersOutput");
        var loadingString = "Loading...";
        ordersOutput.innerText = loadingString;

        robinhood.orders().then(function (res) {
            ordersOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function placeOrderButtonClickHandler(eventInfo) {
        var placeOrderTransactionInput = document.querySelector(".placeOrderTransactionInput").value;
        var placeOrderInstrumentUrlInput = document.querySelector(".placeOrderInstrumentUrlInput").value;
        var placeOrderBidPriceInput = document.querySelector(".placeOrderBidPriceInput").value;
        var placeOrderStopPriceInput = document.querySelector(".placeOrderStopPriceInput").value;
        var placeOrderQuantityInput = document.querySelector(".placeOrderQuantityInput").value;
        var placeOrderInstrumentSymbolInput = document.querySelector(".placeOrderInstrumentSymbolInput").value;
        var placeOrderTimeInput = document.querySelector(".placeOrderTimeInput").value;
        var placeOrderTriggerInput = document.querySelector(".placeOrderTriggerInput").value;
        var placeOrderTypeInput = document.querySelector(".placeOrderTypeInput").value;
        var placeOrderOutput = document.querySelector(".placeOrderOutput");
        var loadingString = "Loading...";
        var options = {
            transaction: placeOrderTransactionInput,
            instrument: {
                url: placeOrderInstrumentUrlInput,
                symbol: placeOrderInstrumentSymbolInput.toUpperCase()
            },
            bid_price: placeOrderBidPriceInput,
            stop_price: placeOrderStopPriceInput,
            quantity: placeOrderQuantityInput,
            time: placeOrderTimeInput,
            trigger: placeOrderTriggerInput,
            type: documentplaceOrderTypeInput
        };
        placeOrderOutput.innerText = loadingString;

        if (placeOrderTransactionInput === 'buy') {
            robinhood.place_buy_order(options).then(function (res) {
                placeOrderOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
            });
        } else if (placeOrderTransactionInput === 'buy') {
            robinhood.place_sell_order(options).then(function (res) {
                placeOrderOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
            });
        }
    }

    function positionsButtonClickHandler(eventInfo) {
        var positionsOutput = document.querySelector(".positionsOutput");
        var loadingString = "Loading...";
        positionsOutput.innerText = loadingString;

        robinhood.positions().then(function (res) {
            positionsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function portfoliosButtonClickHandler(eventInfo) {
        var portfoliosOutput = document.querySelector(".portfoliosOutput");
        var loadingString = "Loading...";
        portfoliosOutput.innerText = loadingString;

        robinhood.portfolios().then(function (res) {
            portfoliosOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    function historicalsButtonClickHandler(eventInfo) {
        var historicalsOutput = document.querySelector(".historicalsOutput");
        var loadingString = "Loading...";
        historicalsOutput.innerText = loadingString;

        robinhood.historicals({span: 'day', interval: '5minute'}).then(function (res) {
            console.log(res);
            historicalsOutput.innerText = JSON.stringify(JSON.parse(res.response), null, '    ');
        });
    }

    app.start();
})();
