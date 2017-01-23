import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Portfolio from '../components/portfolio';

const mapStateToProps = (state) => {
    return {
        portfolio: state.portfolio
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // dismissCard: (e, elm, url) => {
        //     dispatch(dismissCard(url));
        // }
    }
}

const PortfolioPane = connect(
    mapStateToProps,
    mapDispatchToProps
)(Portfolio);

export default PortfolioPane;

// import React, { Component } from 'react';
// import numeral from 'numeral';
// import moment from 'moment';
// import _ from 'lodash';
// import Promise from 'bluebird';

// import { scaleLinear, line, extent } from 'd3';

// import {formatCurrency, formatCurrencyDiff, formatPercentDiff} from '../lib/formaters';

// import FlatButton from 'material-ui/FlatButton';
// import Avatar from 'material-ui/Avatar';

// import RobinhoodChart from '../components/chart';
// import RobinhoodCards from './robinhood-cards';
// import RobinhoodPositions from './robinhood-positions';

// import Portfolios from '../../data/portfolios';
// import Day from '../../data/day';
// import Week from '../../data/week';
// import Year from '../../data/year';
// import AllTime from '../../data/5year';

// class PortfolioPane extends Component {
// 	constructor(props) {
// 	    super(props);

// 		// this.robinhood = this.props.robinhood;
// 	}

//  	getPortfolio() {
// 		let promises = [];

// 		if(!_.get(this.state, 'portfolio')) {
// 			promises.push(Portfolios || this.robinhood.portfolios());
// 		} else {
// 			promises.push(this.state.portfolio);
// 		}
// 		if(!_.get(this.state, 'portfolio.historicals.day')) {
// 			promises.push(Day || this.robinhood.portfolioHistoricals({span: 'day', interval: '5minute'}));
// 		} else {
// 			promises.push(this.state.portfolio.historicals.day);
// 		}
// 		if(!_.get(this.state, 'portfolio.historicals.week')) {
// 			promises.push(Week || this.robinhood.portfolioHistoricals({span: 'week', interval: '10minute'}));
// 		} else {
// 			promises.push(this.state.portfolio.historicals.week);
// 		}
// 		if(!_.get(this.state, 'portfolio.historicals.year')) {
// 			promises.push(Year || this.robinhood.portfolioHistoricals({span: 'year', interval: 'day'}));
// 		} else {
// 			promises.push(this.state.portfolio.historicals.year);
// 		}
// 		if(!_.get(this.state, 'portfolio.historicals.all')) {
// 			promises.push(AllTime || this.robinhood.portfolioHistoricals({span: '5year', interval: 'week'}));
// 		} else {
// 			promises.push(this.state.portfolio.historicals.all);
// 		}
// 		Promise.all(promises).spread(function(portfolioRes, dayRes, weekRes, yearRes, allRes) {
// 				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("portfolios.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
// 				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, portfolioRes.responseText);
// 				// });
// 				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("day.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
// 				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, dayRes.responseText);
// 				// });
// 				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("week.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
// 				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, weekRes.responseText);
// 				// });
// 				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
// 				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, yearRes.responseText);
// 				// });
// 				// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("5year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
// 				// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, allRes.responseText);
// 				// });
// 				let { portfolio, afterHoursText } = this.processPortfolio(portfolioRes.responseJSON);
// 				let day = this.processDay(dayRes.responseJSON);
// 				let week = this.processWeek(weekRes.responseJSON, portfolio);
// 				let { month, quarter, year } = this.processYear(yearRes.responseJSON, portfolio);
// 				let all = this.processAll(allRes.responseJSON, portfolio);
// 				portfolio.historicals = {
// 					day,
// 					week,
// 					month,
// 					quarter,
// 					year,
// 					all
// 				};
// 				this.setState({
// 					portfolio,
// 					afterHoursText,
// 					title: portfolio.equity,
// 					subtitle: afterHoursText,
// 				});
// 			}.bind(this)
// 		);
// 	}

// 	processPortfolio(data) {
// 		let portfolio = data.results[0];
// 		portfolio.equity = +portfolio.equity;
// 		portfolio.extended_hours_equity = +portfolio.extended_hours_equity;

// 		let afterHoursReturn = portfolio.extended_hours_equity - portfolio.equity;
// 		let afterHoursPercentReturn = afterHoursReturn / portfolio.equity;
// 		let afterHoursText = `${formatCurrency(portfolio.extended_hours_equity)} ${formatCurrencyDiff(afterHoursReturn)} (${formatPercentDiff(afterHoursPercentReturn)}) After-hours`;

// 		return {portfolio, afterHoursText};
// 	}

// 	processDay(data) {
// 		let day = data.equity_historicals;
// 		day = day.map(function(d, i){
//             d.xVal = i;
//             // data key: open for day timeSpan, close for all others
//             d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
//             return d;
//         }.bind(this));

// 		return day;
// 	}

// 	processWeek(data, portfolio) {
// 		let week = data.equity_historicals;
// 		if(moment(week[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
// 			week = week.map(function(d, i){
// 				d.xVal = i;
// 				// data key: open for day timeSpan, close for all others
// 				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
// 				return d;
// 			}.bind(this));
// 		} else {
// 			week = _.filter(week, function(d, i){
// 				d.xVal = i;
// 				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
// 				return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'day'));
// 			}.bind(this));
// 		}

// 		return week;
// 	}

// 	processYear(data, portfolio) {
// 		let month = [];
// 		let quarter = [];
// 		let year = [];
// 		let yearData = data.equity_historicals;

// 		if(moment(yearData[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
// 			_.each(yearData, function(d, i){
// 				d.xVal = i;
// 				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];

// 				if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(3, 'month'))) {
// 					quarter.push(Object.assign({}, d));
// 					if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(1, 'month'))) {
// 						month.push(Object.assign({}, d));
// 					}
// 				}

// 				year.push(Object.assign({}, d));
// 			}.bind(this));
// 		} else {
// 			yearData = _.filter(yearData, function(d, i){
// 				d.xVal = i;
// 				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];

// 				if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(3, 'month'))) {
// 					quarter.push(Object.assign({}, d));
// 					if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(yearData).begins_at).hour(0).minute(0).second(0).subtract(1, 'month'))) {
// 						month.push(Object.assign({}, d));
// 					}
// 				}

// 				year.push(Object.assign({}, d));
// 				return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'month'));
// 			}.bind(this));
// 		}

// 		return {month, quarter, year};
// 	}

// 	processAll(data, portfolio) {
// 		let all = data.equity_historicals;
// 		if(moment(all[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
// 			all = all.map(function(d, i){
// 				d.xVal = i;
// 				// data key: open for day timeSpan, close for all others
// 				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
// 				return d;
// 			}.bind(this));
// 		} else {
// 			all = _.filter(all, function(d, i){
// 				d.xVal = i;
// 				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
// 				return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'month'));
// 			}.bind(this));
// 		}

// 		return all;
// 	}

// 	getCards() {
// 		if(!this.state.cards) {
// 			this.robinhood.cards().then(function(res) {
// 				let cards = res.responseJSON.results.filter(function(card) {
// 					return card.show_if_unsupported;
// 				});
// 				this.setState({cards: res.responseJSON.results});
// 			}.bind(this)).catch(function(res) {
// 				console.error(res);
// 			});

// 			return (<div>Loading...</div>);
// 		} else {
// 			return (
// 				<div style={{marginBottom: 15, height: 140, position: 'relative'}}>
// 					<RobinhoodCards data={this.state.cards}/>
// 				</div>
// 			);
// 		}
// 	}

// 	getPositions() {
// 		if(!this.state.positions) {
// 			this.robinhood.positions({nonzero: true}).then(function(positions){
//                 var promises = [];
//                 var currentPositions = positions.responseJSON.results.forEach(function(position){
//                     promises.push(this.robinhood.instrument(position.instrument).then(function(response){
//                         position.instrument = response.responseJSON;
//                         return response.responseJSON.symbol;
//                     }).then(function(symbol){
// 						return Promise.join(
//                         	this.robinhood.quote_data(symbol),
// 							this.robinhood.symbolHistoricals(symbol, {span: 'day', interval: '5minute'}),
// 							this.robinhood.symbolHistoricals(symbol, {span: 'week', interval: '10minute'}),
// 							this.robinhood.symbolHistoricals(symbol, {span: 'year', interval: 'day'}),
// 							this.robinhood.symbolHistoricals(symbol, {span: '5year', interval: 'week'}),
// 							function(quoteRes, dayRes, weekRes, yearRes, allRes) {
// 								position.quote = quoteRes.responseJSON.results[0];
// 								position.historicals = {
// 									day: dayRes.responseJSON.historicals,
// 									week: weekRes.responseJSON.historicals,
// 									year: yearRes.responseJSON.historicals,
// 									all: allRes.responseJSON.historicals
// 								};

// 								return position;
// 							});
//                     }.bind(this)));
//                 }.bind(this));
//                 return Promise.all(promises).then(function(positions){
//                     // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("positions.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
//                     //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(positions));
//                     // });
//                     this.setState({positions});
//                 }.bind(this));
//             }.bind(this));

// 			return (<div>Loading...</div>)
// 		} else {
// 			return (<RobinhoodPositions data={this.state.positions} showStockOverlay={this.showStockOverlay.bind(this)} />);
// 		}
// 	}

//     render() {
// 		if(!this.state.portfolio) {
// 			this.getPortfolio();

// 			return (<div>Loading...</div>);
// 		} else {
// 			return (
// 				<div>
// 					<RobinhoodChart
// 						title={this.state.title}
// 						subtitle={this.state.subtitle}
// 						margin={{top: 0, right: 0, bottom: 0, left: 0}}
// 						getChartData={this.getChartData.bind(this)}
// 					/>
// 					<RobinhoodCards/>
// 					<RobinhoodPositions/>
// 				</div>
// 			);
// 		}
//     }
// }

// export default PortfolioPane;