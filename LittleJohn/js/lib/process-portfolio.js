import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';

import {formatCurrency, formatCurrencyDiff, formatPercentDiff} from './formaters';

function processPortfolioData(data) {
    let portfolio = data.responseJSON.results[0];
    portfolio.equity = +portfolio.equity;
    portfolio.extended_hours_equity = +portfolio.extended_hours_equity;

    let afterHoursReturn = portfolio.extended_hours_equity - portfolio.equity;
    let afterHoursPercentReturn = afterHoursReturn / portfolio.equity;
    let subtitle = `${formatCurrency(portfolio.extended_hours_equity)} ${formatCurrencyDiff(afterHoursReturn)} (${formatPercentDiff(afterHoursPercentReturn)}) After-hours`;

    return {portfolio, subtitle};
}

function processDayData(data) {
    let day = data.responseJSON.equity_historicals;
    day = day.map(function(d, i){
        d.xVal = i;
        d.yVal = +d.adjusted_open_equity;
        return d;
    }.bind(this));

    return day;
}

function processWeekData(data, portfolio) {
    let week = data.responseJSON.equity_historicals;
    if(moment(week[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
        week = week.map(function(d, i){
            d.xVal = i;
            d.yVal = +d.adjusted_close_equity;
            return d;
        }.bind(this));
    } else {
        week = _.filter(week, function(d, i){
            d.xVal = i;
            d.yVal = +d.adjusted_close_equity;
            return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'day'));
        }.bind(this));
    }

    return week;
}

function processYearData(data, portfolio) {
    let month = [];
    let quarter = [];
    let year = [];
    let yearData = data.responseJSON.equity_historicals;

    if(moment(yearData[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
        _.each(yearData, function(d, i){
            d.xVal = i;
            d.yVal = +d.adjusted_close_equity;

            if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(3, 'month'))) {
                quarter.push(Object.assign({}, d));
                if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(1, 'month'))) {
                    month.push(Object.assign({}, d));
                }
            }

            year.push(Object.assign({}, d));
        }.bind(this));
    } else {
        yearData = _.filter(yearData, function(d, i){
            d.xVal = i;
            d.yVal = +d.adjusted_close_equity;

            if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(3, 'month'))) {
                quarter.push(Object.assign({}, d));
                if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(1, 'month'))) {
                    month.push(Object.assign({}, d));
                }
            }

            year.push(Object.assign({}, d));
            return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'month'));
        }.bind(this));
    }

    return {month, quarter, year};
}

function processAllData(data, portfolio) {
    let all = data.responseJSON.equity_historicals;
    if(moment(all[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
        all = all.map(function(d, i){
            d.xVal = i;
            d.yVal = +d.adjusted_close_equity;
            return d;
        }.bind(this));
    } else {
        all = _.filter(all, function(d, i){
            d.xVal = i;
            d.yVal = +d.adjusted_close_equity;
            return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'month'));
        }.bind(this));
    }

    return all;
}

function processPortfolio(portfolioRes, dayRes, weekRes, yearRes, allRes) {
    let { portfolio, subtitle } = processPortfolioData(portfolioRes);
    let day = processDayData(dayRes);
    let week = processWeekData(weekRes, portfolio);
    let { month, quarter, year } = processYearData(yearRes, portfolio);
    let all = processAllData(allRes, portfolio);

    portfolio.subtitle = subtitle;
    portfolio.historicals = {
        day,
        week,
        month,
        quarter,
        year,
        all
    };

    return portfolio;
};

export default processPortfolio;