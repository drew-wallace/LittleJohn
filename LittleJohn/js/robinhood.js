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
            portfolios: 'https://api.robinhood.com/portfolios/',
            historicals: 'https://api.robinhood.com/portfolios/historicals/'
        };
        this._isInit = false;
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
                'X-Robinhood-API-Version': '1.70.0',
                'Connection': 'keep-alive',
                'User-Agent': 'Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)'
            },
            auth_token: null
        };
    }
    _setHeaders(request) {
        Object.keys(this._private.headers).forEach(function (key) {
            request.setRequestHeader(key, this._private.headers[key]);
        }.bind(this));
    }
    _parseResponse(res) {
        return JSON.parse(res);
    }
    _formatParams(params, isPost){
        return (isPost ? '' : "?") + Object
                .keys(params)
                .map(function(key){
                    return key+"="+params[key]
                })
                .join("&")
    }
    login(username, password) {
        var request = new XMLHttpRequest();
        request.open(
            'POST',
            this._endpoints.login,
            false
        );
        this._setHeaders(request);
        request.send('username=' + (username || this._private.username) + '&password=' + (password || this._private.password));
        if (request.status == 200) {
            var body = this._parseResponse(request.response);

            this._private.auth_token = body.token;
            this._private.headers.Authorization = 'Token ' + this._private.auth_token;

            // Set account
            request.open(
                'GET',
                this._endpoints.accounts,
                false
            );
            this._setHeaders(request);
            request.send();
            if (request.status == 200) {
                var accountBody = this._parseResponse(request.response);

                if (accountBody.results) {
                    this._private.account = accountBody.results[0];
                }

                return true;
            } else {
                console.log(request);
                return false;
            }
        } else {
            console.log(request);
            return false;
        }
    }
    investment_profile() {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.investment_profile,
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    instruments(symbol) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.instruments + this._formatParams({ 'query': symbol.toUpperCase() }),
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    instrument(url) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                url,
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    quote_data(symbol) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.quotes + this._formatParams({ 'symbols': symbol.toUpperCase() }),
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    accounts() {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.accounts,
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    user() {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.user,
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    dividends() {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.dividends,
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    orders() {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.orders,
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    _place_order(options) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'POST',
                this._endpoints.orders,
                true
            );
            this._setHeaders(request);
            request.send(this._formatParams({
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
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
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
    positions(options) {
        options = options || {};

        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.positions + this._formatParams({ nonzero: options.nonzero || false, cursor: options.cursor || '', ordering: options.ordering || '' }),
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    portfolios() {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.portfolios,
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
    historicals(options) {
        options = options || {};
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(
                'GET',
                this._endpoints.historicals + this._private.account.account_number + "/" + this._formatParams({ span: options.span || '', interval: options.interval || '' }),
                true
            );
            this._setHeaders(request);
            request.send();
            request.onload = function () { request.responseJSON = JSON.parse(request.response); resolve(request);}.bind(this);
            request.onerror = function () { reject(request);}.bind(this);
        }.bind(this));
    }
}