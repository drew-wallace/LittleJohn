/**
 * Robinhood API Javascript Wrapper
 * @author Drew Wallace
 */

'use strict';

class Robinhood{
    constructor(opts) {
        this._options = opts || {};
        this._endpoints = {
            login: 'https://api.robinhood.com/api-token-auth/',
            investment_profile: 'https://api.robinhood.com/user/investment_profile/',
            accounts: 'https://api.robinhood.com/accounts/',
            ach_iav_auth: 'https://api.robinhood.com/ach/iav/auth/',
            ach_relationships: 'https://api.robinhood.com/ach/relationships/',
            ach_transfers: 'https://api.robinhood.com/ach/transfers/',
            applications: 'https://api.robinhood.com/applications/',
            dividends: 'https://api.robinhood.com/dividends/',
            edocuments: 'https://api.robinhood.com/documents/',
            instruments: 'https://api.robinhood.com/instruments/',
            margin_upgrade: 'https://api.robinhood.com/margin/upgrades/',
            markets: 'https://api.robinhood.com/markets/',
            notifications: 'https://api.robinhood.com/notifications/',
            orders: 'https://api.robinhood.com/orders/',
            password_reset: 'https://api.robinhood.com/password_reset/request/',
            quotes: 'https://api.robinhood.com/quotes/',
            document_requests: 'https://api.robinhood.com/upload/document_requests/',
            user: 'https://api.robinhood.com/user/',
            watchlists: 'https://api.robinhood.com/watchlists/',
            positions: 'https://api.robinhood.com/positions/',
            portfolio: 'https://api.robinhood.com/portfolios/',
            historicals: 'https://api.robinhood.com/portfolios/historicals/'
        };
        this._isInit = false;
        this._request = new XMLHttpRequest();
        this._private = {
            session: {},
            account: null,
            username: this._options.username,
            password: this._options.password,
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'X-Robinhood-API-Version': '1.0.0',
                'Connection': 'keep-alive',
                'User-Agent': 'Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)'
            },
            auth_token: null
        };
    }

    _setHeaders() {
        Object.keys(this._private.headers).forEach(function (key) {
            this._request.setRequestHeader(key, this._private.headers[key]);
        }.bind(this));
    }

    login(username, password) {
        this._request.open(
            'POST',
            this._endpoints.login,
            false
        );
        this._setHeaders();
        this._request.send('username=' + (username || this._private.username) + '&password=' + (password || this._private.password));
        if (this._request.status == 200) {
            var body = JSON.parse(this._request.response);

            this._private.auth_token = body.token;
            this._private.headers.Authorization = 'Token ' + this._private.auth_token;

            // Set account
            this._request.open(
                'GET',
                this._endpoints.accounts,
                false
            );
            this._setHeaders();
            this._request.send();
            if (this._request.status == 200) {
                var accountBody = JSON.parse(this._request.response);

                if (accountBody.results) {
                    this._private.account = accountBody.results[0];
                }

                return true;
            } else {
                console.log(this._request);
                return false;
            }
        } else {
            console.log(this._request);
            return false;
        }
    }

    formatParams(params, isPost){
        return (isPost ? '' : "?") + Object
                .keys(params)
                .map(function(key){
                    return key+"="+params[key]
                })
                .join("&")
    }

    /* +--------------------------------+ *
     * |      Define API methods        | *
     * +--------------------------------+ */
    investment_profile() {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.investment_profile,
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    instruments(symbol) {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.instruments + this.formatParams({ 'query': symbol.toUpperCase() }),
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    quote_data(symbol) {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.quotes + this.formatParams({ 'symbols': symbol.toUpperCase() }),
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    accounts() {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.accounts,
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    user() {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.user,
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    dividends() {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.dividends,
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    orders() {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.orders,
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    _place_order(options) {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'POST',
                this._endpoints.orders,
                true
            );
            this._setHeaders();
            this._request.send(this.formatParams({
                    account: this._private.account.url,
                    instrument: options.instrument.url,
                    price: options.bid_price,
                    stop_price: options.stop_price,
                    quantity: options.quantity,
                    side: options.transaction,
                    symbol: options.instrument.symbol.toUpperCase(),
                    time_in_force: options.time || 'gfd',
                    trigger: options.trigger || 'immediate',
                    type: options.type || 'market'
                }, true));
            this._request.onload = function () { resolve(this._request);}.bind(this);
        }.bind(this));
    }

    place_buy_order(options) {
        options.transaction = 'buy';
        return this._place_order(options);
    }

    place_sell_order(options) {
        options.transaction = 'sell';
        return this._place_order(options);
    }

    positions() {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.positions,
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    portfolios() {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.portfolio,
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }

    historicals(options) {
        return new Promise(function(resolve, reject) {
            this._request.open(
                'GET',
                this._endpoints.historicals + this._private.account.account_number + this.formatParams({ span: options.span, interval: options.interval }),
                true
            );
            this._setHeaders();
            this._request.send();
            this._request.onload = function () { resolve(this._request);}.bind(this);
            this._request.onerror = function () { reject(this._request);}.bind(this);
        }.bind(this));
    }
}

// // function RobinhoodWebApi(opts, callback) {
// function RobinhoodWebApi(opts) {

//     /* +--------------------------------+ *
//     * |      Internal variables        | *
//     * +--------------------------------+ */
//     var _options = opts || {},
//         // Private API Endpoints
//         _endpoints = {
//             login: 'https://api.robinhood.com/api-token-auth/',
//             investment_profile: 'https://api.robinhood.com/user/investment_profile/',
//             accounts: 'https://api.robinhood.com/accounts/',
//             ach_iav_auth: 'https://api.robinhood.com/ach/iav/auth/',
//             ach_relationships: 'https://api.robinhood.com/ach/relationships/',
//             ach_transfers: 'https://api.robinhood.com/ach/transfers/',
//             applications: 'https://api.robinhood.com/applications/',
//             dividends: 'https://api.robinhood.com/dividends/',
//             edocuments: 'https://api.robinhood.com/documents/',
//             instruments: 'https://api.robinhood.com/instruments/',
//             margin_upgrade: 'https://api.robinhood.com/margin/upgrades/',
//             markets: 'https://api.robinhood.com/markets/',
//             notifications: 'https://api.robinhood.com/notifications/',
//             orders: 'https://api.robinhood.com/orders/',
//             password_reset: 'https://api.robinhood.com/password_reset/request/',
//             quotes: 'https://api.robinhood.com/quotes/',
//             document_requests: 'https://api.robinhood.com/upload/document_requests/',
//             user: 'https://api.robinhood.com/user/',
//             watchlists: 'https://api.robinhood.com/watchlists/',
//             positions: 'https://api.robinhood.com/positions/'
//         },
//         _isInit = false,
//         _request = new XMLHttpRequest(),
//         _private = {
//             session: {},
//             account: null,
//             username: _options.username,
//             password: _options.password,
//             headers: {
//                 'Accept': '*/*',
//                 'Accept-Encoding': 'gzip, deflate',
//                 'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5',
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
//                 'X-Robinhood-API-Version': '1.0.0',
//                 'Connection': 'keep-alive',
//                 'User-Agent': 'Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)'
//             },
//             auth_token: null
//         },
//         api = {};

//     // function _init() {
//     //     _private.username = _options.username;
//     //     _private.password = _options.password;
//     //     _private.headers = {
//     //         'Accept': '*/*',
//     //         'Accept-Encoding': 'gzip, deflate',
//     //         'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5',
//     //         'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
//     //         'X-Robinhood-API-Version': '1.0.0',
//     //         'Connection': 'keep-alive',
//     //         'User-Agent': 'Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)'
//     //     };
//     //     // _setHeaders();
//     //     // _login(function () {
//     //     //     _isInit = true;

//     //     //     if (callback) {
//     //     //         callback.call();
//     //     //     }
//     //     // });
//     //     return _login().then(function(account) {
//     //         _isInit = true;
//     //         console.log(account);
//     //     });
//     // }

//     function _setHeaders() {
//         Object.keys(_private.headers).forEach(function (key) {
//             _request.setRequestHeader(key, _private.headers[key]);
//         });
//     }

//     // api.login = function(callback) {
//     //     _request.onload = function () {
//     //         if (_request.readyState == 4 && _request.status == 200) {
//     //             var body = JSON.parse(_request.response);

//     //             _private.auth_token = body.token;
//     //             _private.headers.Authorization = 'Token ' + _private.auth_token;

//     //             // Set account
//     //             return api.accounts(function (httpResponse) {
//     //                 if (httpResponse.readyState == 4 && httpResponse.status == 200) {
//     //                     var accountBody = JSON.parse(httpResponse.response);

//     //                     if (accountBody.results) {
//     //                         _private.account = accountBody.results[0].url;
//     //                     }
//     //                 } else {
//     //                     throw (err);
//     //                 }

//     //                 callback.call();
//     //             });
//     //         } else {
//     //             throw (err);
//     //         }
//     //     }
//     //     _request.open(
//     //         'POST',
//     //         _endpoints.login,
//     //         true
//     //     );
//     //      _setHeaders();
//     //     _request.send('username=' + _private.username + '&password=' + _private.password);
//     // }
//     api.login = function() {
//         _request.open(
//             'POST',
//             _endpoints.login,
//             false
//         );
//         _setHeaders();
//         _request.send('username=' + _private.username + '&password=' + _private.password);
//         if (_request.status == 200) {
//             var body = JSON.parse(_request.response);

//             _private.auth_token = body.token;
//             _private.headers.Authorization = 'Token ' + _private.auth_token;

//             // Set account
//             _request.open(
//                 'GET',
//                 _endpoints.accounts,
//                 false
//             );
//             _setHeaders();
//             _request.send();
//             if (_request.status == 200) {
//                 var accountBody = JSON.parse(_request.response);

//                 if (accountBody.results) {
//                     _private.account = accountBody.results[0].url;
//                 }

//                 return true;
//             } else {
//                 throw (_request);
//             }
//         } else {
//             throw (_request);
//         }
//     }

//     function formatParams(params, isPost){
//         return (isPost ? '' : "?") + Object
//                 .keys(params)
//                 .map(function(key){
//                     return key+"="+params[key]
//                 })
//                 .join("&")
//     }

//     /* +--------------------------------+ *
//      * |      Define API methods        | *
//      * +--------------------------------+ */
//     // api.investment_profile = function (callback) {
//     //     //return _request.get({
//     //     //    uri: _endpoints.investment_profile
//     //     //}, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.investment_profile,
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.investment_profile = function () {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.investment_profile,
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // api.instruments = function (symbol, callback) {
//     //     // return _request.get({
//     //     //     uri: _endpoints.instruments,
//     //     //     qs: { 'query': symbol.toUpperCase() }
//     //     // }, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.instruments + formatParams({ 'query': symbol.toUpperCase() }),
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.instruments = function (symbol) {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.instruments + formatParams({ 'query': symbol.toUpperCase() }),
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // api.quote_data = function (symbol, callback) {
//     //     // return _request.get({
//     //     //     uri: _endpoints.quotes,
//     //     //     qs: { 'symbols': symbol.toUpperCase() }
//     //     // }, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.quotes + formatParams({ 'symbols': symbol.toUpperCase() }),
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.quote_data = function (symbol) {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.quotes + formatParams({ 'symbols': symbol.toUpperCase() }),
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // api.accounts = function (callback) {
//     //     // return _request.get({
//     //     //     uri: _endpoints.accounts
//     //     // }, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.accounts,
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.accounts = function () {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.accounts,
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // api.user = function (callback) {
//     //     // return _request.get({
//     //     //     uri: _endpoints.user
//     //     // }, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.user,
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.user = function () {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.user,
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // api.dividends = function (callback) {
//     //     // return _request.get({
//     //     //     uri: _endpoints.dividends
//     //     // }, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.dividends,
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.dividends = function () {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.dividends,
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // api.orders = function (callback) {
//     //     // return _request.get({
//     //     //     uri: _endpoints.orders
//     //     // }, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.orders,
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.orders = function () {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.orders,
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // var _place_order = function (options, callback) {
//     //     // return _request.post({
//     //     //     uri: _endpoints.orders,
//     //     //     form: {
//     //     //         account: _private.account,
//     //     //         instrument: options.instrument.url,
//     //     //         price: options.bid_price,
//     //     //         stop_price: options.stop_price,
//     //     //         quantity: options.quantity,
//     //     //         side: options.transaction,
//     //     //         symbol: options.instrument.symbol.toUpperCase(),
//     //     //         time_in_force: options.time || 'gfd',
//     //     //         trigger: options.trigger || 'immediate',
//     //     //         type: options.type || 'market'
//     //     //     }
//     //     // }, callback);
//     //     _request.open(
//     //         'POST',
//     //         _endpoints.orders,
//     //         true
//     //     );
//     //     _setHeaders();
//     //     _request.send(formatParams({
//     //             account: _private.account,
//     //             instrument: options.instrument.url,
//     //             price: options.bid_price,
//     //             stop_price: options.stop_price,
//     //             quantity: options.quantity,
//     //             side: options.transaction,
//     //             symbol: options.instrument.symbol.toUpperCase(),
//     //             time_in_force: options.time || 'gfd',
//     //             trigger: options.trigger || 'immediate',
//     //             type: options.type || 'market'
//     //         }, true));
//     //     _request.onload = function () { callback(_request);};
//     // };

//     var _place_order = function (options) {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'POST',
//                 _endpoints.orders,
//                 true
//             );
//             _setHeaders();
//             _request.send(formatParams({
//                     account: _private.account,
//                     instrument: options.instrument.url,
//                     price: options.bid_price,
//                     stop_price: options.stop_price,
//                     quantity: options.quantity,
//                     side: options.transaction,
//                     symbol: options.instrument.symbol.toUpperCase(),
//                     time_in_force: options.time || 'gfd',
//                     trigger: options.trigger || 'immediate',
//                     type: options.type || 'market'
//                 }, true));
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // api.place_buy_order = function (options, callback) {
//     //     options.transaction = 'buy';
//     //     return _place_order(options, callback);
//     // };

//     api.place_buy_order = function (options) {
//         options.transaction = 'buy';
//         return _place_order(options);
//     };

//     // api.place_sell_order = function (options, callback) {
//     //     options.transaction = 'sell';
//     //     return _place_order(options, callback);
//     // };

//     api.place_sell_order = function (options) {
//         options.transaction = 'sell';
//         return _place_order(options);
//     };

//     // api.positions = function (callback) {
//     //     // return _request.get({
//     //     //     uri: _endpoints.positions
//     //     // }, callback);
//     //     _request.open(
//     //         'GET',
//     //         _endpoints.positions,
//     //         true
//     //     );
//     //     _request.send();
//     //     _request.onload = function () { callback(_request);};
//     // };

//     api.positions = function () {
//         return new Promise(function(resolve, reject) {
//             _request.open(
//                 'GET',
//                 _endpoints.positions,
//                 true
//             );
//             _setHeaders();
//             _request.send();
//             _request.onload = function () { resolve(_request);};
//         });
//     };

//     // _init(_options);

//     return api;
// }