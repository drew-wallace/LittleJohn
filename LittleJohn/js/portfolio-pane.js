import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import Promise from 'bluebird';

import env from "../env";

import { timeParse, bisector, format, scaleLinear, line, select, extent, drag, mouse } from 'd3';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import { MuiThemeProvider } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Lightbulb from 'material-ui/svg-icons/action/lightbulb-outline';
import Avatar from 'material-ui/Avatar';

import Hammer from 'react-hammerjs'

import Portfolios from '../data/portfolios';
import Day from '../data/day';
import Week from '../data/week';
import Year from '../data/year';
import AllTime from '../data/5year';
import Positions from '../data/positions';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const styles = {
	headline: {
		fontSize: 24,
		paddingTop: 16,
		marginBottom: 12,
		fontWeight: 400,
	}
};

const muiTheme = getMuiTheme(darkBaseTheme);

class PortfolioPane extends Component {
	constructor(props) {
	    super(props);

		this.robinhood = this.props.robinhood;
		this.timeSpan = 'day';
        this.parseTime = timeParse("%d-%b-%y");
		this.bisectDate = bisector(function(d) { return d.xVal; }).left;
        this.formatValue = format(",.2f");

		const margin = {top: 0, right: 0, bottom: 0, left: 0};
		const width = 683 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;
		const x = scaleLinear().range([0, width]);
		const y = scaleLinear().range([height, 0]);
		this.lineD3 = line()
						.x(function(d) { return x(d.xVal); })
						.y(function(d) { return y(d.yVal); });

		this.x = x;
		this.y = y;

		this.state = {
			portfolio: null,
			positions: Positions.responseJSON || null,
			day: null,
			week: null,
			month: null,
			quarter: null,
			year: null,
			all: null,
			afterHoursText: '',
			title: '$0',
			subtitle: '',
			cards: env.cards.results || null,
			tab: 'day',
			margin,
			width,
			height,
			equity: '$0'
	    };
	}

	formatCurrencyD3(d) {
		return "$" + this.formatValue(d);
	}

	formatCurrency(d) {
		return numeral(d).format('$0,0.00');
	}

	formatCurrencyDiff(d) {
		return numeral(d).format('+$0,0.00');
	}

	formatPercentDiff(d) {
		return numeral(d).format('+0.00%');
	}

	formatPercent(d) {
		return this.formatValue(d * 100) + '%';
	}

	formatTime(d) {
		let hours = d.getHours();
		let minutes = d.getMinutes();

		if(hours > 12) hours -= 12;
		if(hours < 10) hours = '0' + hours;
		if(minutes < 10) minutes = '0' + minutes;

		switch(this.timeSpan) {
			case 'day':
				return `${hours}:${minutes} EDT`;
			case 'week':
				return `${hours}:${minutes} EDT ${moment(d).format('MMM D')}`;
			case 'month':
				return `${moment(d).format('MMM D YYYY')}`;
			case 'quarter':
				return `${moment(d).format('MMM D YYYY')}`;
			case 'year':
				return `${moment(d).format('MMM D YYYY')}`;
			case 'all':
				return `${moment(d).format('MMM D YYYY')}`;
		}
	}

	handleChange(e) {
		this.setState({
			tab: e.currentTarget.id
		});
	}

	getPath(timeSpan) {
		this.timeSpan = timeSpan;

        this.x.domain(extent(this.state[this.timeSpan], function(d) { return d.xVal }));
		this.y.domain(extent(this.state[this.timeSpan], function(d) { return d.yVal; }));

		return (
			<path ref="mainLine" className="line" d={this.lineD3(this.state[this.timeSpan])}></path>
		);
	}

	componentDidUpdate() {
		const overlay = select(ReactDOM.findDOMNode(this.refs.overlay));
		overlay.call(drag()
					    .on("start", this._startdrag.bind(this))
					    .on("drag", this._dragging.bind(this))
					    .on("end", this._enddrag.bind(this))
					    .container(function() { return this; }));

		this.onResizeThrottled = _.throttle(this.onResize.bind(this), 10);
		window.addEventListener("resize", this.onResizeThrottled);
	}

	onResize() {
		if(document.getElementById('chart-container')) {
			let position = document.getElementById(`${this.timeSpan}-chart`).style.position;
			document.getElementById(`${this.timeSpan}-chart`).style.position = 'absolute';
			const width = document.getElementById('chart-container').offsetWidth - this.state.margin.left - this.state.margin.right;
			const height = (document.getElementById('chart-container').offsetWidth * 0.5) - this.state.margin.top - this.state.margin.bottom;
			document.getElementById(`${this.timeSpan}-chart`).style.position = position;
			this.setState({
				width,
				height
			});
		}
	}

	componentWillMount() {
		this.onResize();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onResizeThrottled);
	}

	_startdrag() {
    	select(ReactDOM.findDOMNode(this.refs.focus))
			.style('display', null);

		let startingEquity = +this.state[this.timeSpan][0].adjusted_open_equity;
		let endingEquity = this.state.portfolio.equity;
		let netReturn = endingEquity - startingEquity;
		let netPercentReturn = netReturn / startingEquity;
		let equityChangeText = this.formatCurrencyDiff(netReturn) + ' (' + this.formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

		this.setState({
			title: startingEquity,
			subtitle: equityChangeText
		});
    }

    _dragging(ignoreThis, elmIndex, elms) {
    	// -$7.41 (-3.11%) 10:55 AM EDT
    	var x0 = this.x.invert(mouse(elms[elmIndex])[0]),
			i = this.bisectDate(this.state[this.timeSpan], x0, 1);

		if(i >= this.state[this.timeSpan].length) return false;

		var d0 = this.state[this.timeSpan][i - 1],
			d1 = this.state[this.timeSpan][i],
            d = x0 - d0.xVal > d1.xVal - x0 ? d1 : d0;

		var netReturn = d.yVal - this.state[this.timeSpan][0].yVal,
			netPercentReturn = netReturn / this.state[this.timeSpan][0].yVal,
            sign = (netReturn >= 0 ? '+' : '-'),
            equityChangeText = sign + this.formatCurrency(Math.abs(netReturn)) + ' (' + sign + this.formatPercent(Math.abs(netPercentReturn)) + ') ' + this.formatTime(new Date(d.begins_at));


        var xPos = mouse(elms[elmIndex])[0];

		var pathLength = ReactDOM.findDOMNode(this.refs.mainLine).getTotalLength();
        var thisX = xPos;
        var beginning = thisX,
            end = pathLength,
            target, pos;

        while (true) {
            target = Math.floor((beginning + end) / 2);
			pos = ReactDOM.findDOMNode(this.refs.mainLine).getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== thisX) {
                break;
            }
            if (pos.x > thisX) end = target;
            else if (pos.x < thisX) beginning = target;
            else break; //position found
        }

		select(ReactDOM.findDOMNode(this.refs.header))
			.select("div span:nth-child(1)")
			.text(this.formatCurrency(d.yVal));
		select(ReactDOM.findDOMNode(this.refs.header))
			.select("div span:nth-child(2)")
			.text(equityChangeText);

		select(ReactDOM.findDOMNode(this.refs.focus))
			.attr('transform', `translate(${xPos},0)`);
    }

    _enddrag() {
		select(ReactDOM.findDOMNode(this.refs.focus))
			.style('display', 'none');

		this.setState({
			title: this.state.portfolio.equity,
			subtitle: this.state.afterHoursText
		});
    }

	processPortfolio(data) {
		let portfolio = data.results[0];
		portfolio.equity = +portfolio.equity;
		portfolio.extended_hours_equity = +portfolio.extended_hours_equity;

		let afterHoursReturn = portfolio.extended_hours_equity - portfolio.equity;
		let afterHoursPercentReturn = afterHoursReturn / portfolio.equity;
		let afterHoursText = `${this.formatCurrency(portfolio.extended_hours_equity)} ${this.formatCurrencyDiff(afterHoursReturn)} (${this.formatPercentDiff(afterHoursPercentReturn)}) After-hours`;

		return {portfolio, afterHoursText};
	}

	processDay(data) {
		let day = data.equity_historicals;
		day = day.map(function(d, i){
            d.xVal = i;
            // data key: open for day timeSpan, close for all others
            d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
            return d;
        }.bind(this));

		return day;
	}

	processWeek(data, portfolio) {
		let week = data.equity_historicals;
		if(moment(week[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
			week = week.map(function(d, i){
				d.xVal = i;
				// data key: open for day timeSpan, close for all others
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
				return d;
			}.bind(this));
		} else {
			week = _.filter(week, function(d, i){
				d.xVal = i;
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
				return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'day'));
			}.bind(this));
		}

		return week;
	}

	processYear(data, portfolio) {
		let month = [];
		let quarter = [];
		let year = [];
		let yearData = data.equity_historicals;

		if(moment(yearData[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
			_.each(yearData, function(d, i){
				d.xVal = i;
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];

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
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];

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

	process5Year(data, portfolio) {
		let all = data.equity_historicals;
		if(moment(all[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
			all = all.map(function(d, i){
				d.xVal = i;
				// data key: open for day timeSpan, close for all others
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
				return d;
			}.bind(this));
		} else {
			all = _.filter(all, function(d, i){
				d.xVal = i;
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
				return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'month'));
			}.bind(this));
		}

		return all;
	}

	handleSwipe(e) {
		let element = ReactDOM.findDOMNode(this.refs[this.state.cards[0].url]);
		element.style.transform = `translate(${e.deltaX}px,0px)`;
		element.style.transitionDuration = `0ms`;
	}

	handleSwipeEnd(e) {
		let element = ReactDOM.findDOMNode(this.refs[this.state.cards[0].url]);
		element.style.transitionDuration = `450ms`;
		element.style.transform =  `translate(${e.deltaX}px,0px)`;
		if(Math.abs(e.deltaX / this.state.width) >= 0.5) {
			// pop article off stack
			// setstate
			// element.parentNode.removeChild(element);
			const url = this.state.cards[0].url.split('/');
			const id = url[url.length - 2];
			this.robinhood.dismissCard(id).then(function(data) {
				console.log(data);
			});
			this.setState({cards: this.state.cards.slice(1)});
		} else {
			ReactDOM.findDOMNode(this.refs[this.state.cards[0].url]).style.transform =  `translate(0px,0px)`;
		}
	}

	getCards() {
		if(!this.state.cards) {
			this.robinhood.cards().then(function(res) {
				let cards = res.responseJSON.results.filter(function(card) {
					return card.show_if_unsupported;
				});
				this.setState({cards: res.responseJSON.results});
			}.bind(this)).catch(function(res) {
				console.error(res);
			});

			return (<div>Loading...</div>);
		} else {
			let cards = [];
			this.state.cards.forEach(function(card, index) {
				cards.push(
					<Hammer ref={card.url} key={index} onPan={this.handleSwipe.bind(this)} onPanEnd={this.handleSwipeEnd.bind(this)}>
						<Card style={{width: '100%', position: 'absolute', height: 140, zIndex: this.state.cards.length - index}}>
							<CardText>
								<div style={{display: 'flex'}}>
									<div style={{flex: 1}}><Lightbulb/> <span className="card-title">{card.title}</span></div>
									<div style={{flex: 0}}>
										<Badge badgeContent={this.state.cards.length - index} primary={true}/>
									</div>
								</div>
								<p>{card.message}</p>
								<div>{card.call_to_action}</div>
							</CardText>
						</Card>
					</Hammer>
				);
			}.bind(this));
			cards.push(
				<Card key="last-card" style={{width: '100%', position: 'absolute', height: 140, zIndex: 0}}>
					<CardText>
						<div style={{fontSize: 16, textAlign: 'center', paddingTop: '1.6em'}}>You're all caught up!<br/>New cards will be added here as they<br/>become available.</div>
					</CardText>
				</Card>
			);
			return (
				<div style={{marginBottom: 15, height: 140, position: 'relative'}}>
					{cards}
				</div>
			);
		}
	}

	getPositions() {
		if(!this.state.positions) {
			this.robinhood.positions({nonzero: true}).then(function(positions){
                var promises = [];
                var currentPositions = positions.responseJSON.results.forEach(function(position){
                    promises.push(this.robinhood.instrument(position.instrument).then(function(response){
                        position.instrument = response.responseJSON;
                        return response.responseJSON.symbol;
                    }).then(function(symbol){
						return Promise.join(
                        	this.robinhood.quote_data(symbol),
							this.robinhood.symbolHistoricals(symbol, {span: 'day', interval: '5minute'}),
							// this.robinhood.symbolHistoricals(symbol, {span: 'week', interval: '10minute'}),
							// this.robinhood.symbolHistoricals(symbol, {span: 'year', interval: 'day'}),
							// this.robinhood.symbolHistoricals(symbol, {span: '5year', interval: 'week'}),
							function(quoteRes, dayRes, weekRes, yearRes, allRes) {
								position.quote = quoteRes.responseJSON.results[0];
								position.historicals = {
									day: dayRes.responseJSON.historicals/*,
									week: weekRes.responseJSON.historicals,
									year: yearRes.responseJSON.historicals,
									all: allRes.responseJSON.historicals*/
								};

								return position;
							});
                    }.bind(this)));
                }.bind(this));
                return Promise.all(promises).then(function(positions){
                    // Windows.Storage.ApplicationData.current.localFolder.createFileAsync("positions.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
                    //     return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(positions));
                    // });
                    this.setState({positions});
                }.bind(this));
            }.bind(this));

			return (<div>Loading...</div>)
		} else {
			let positionList = [];
			_.each(this.state.positions, function(v, i) {
				const margin = {top: 0, right: 0, bottom: 0, left: 0};
				const width = 100 - margin.left - margin.right;
				const height = 25 - margin.top - margin.bottom;
				const x = scaleLinear().range([0, width]);
				const y = scaleLinear().range([height, 0]);
				const lineD3 = line()
							.x(function(d) { return x(d.xVal); })
							.y(function(d) { return y(d.yVal); });

				let day = v.historicals.day;
				console.log(v.historicals.day);
				day = day.map(function(d, i){
					d.xVal = i;
					// data key: open for day timeSpan, close for all others
					d.yVal = +d.open_price;
					return d;
				}.bind(this));

				// hard-coding portfolio day amount for now
				x.domain(extent(day, function(d) { return d.xVal }));
				y.domain(extent(day, function(d) { return d.yVal; }));

				positionList.push(
					<Card style={{marginBottom: 15}} key={i}>
						<CardText>
							<div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
								<div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
									<div style={{flex: 1}}><span className="card-title">{v.instrument.symbol}</span></div>
									<div style={{flex: 1}}>
										{numeral(v.quantity).format('0,0')} Shares
									</div>
								</div>
								<div style={{flex: 1}}>
									<svg className="line-chart-svg" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
										<g className="line-chart-container-svg" transform={`translate(${margin.left}, ${margin.top})`}>
											<path className="line" d={lineD3(day)}></path>
										</g>
									</svg>
								</div>
								<div style={{flex: 0}}>
									{this.formatCurrency(v.quote.last_trade_price)}
								</div>
							</div>
						</CardText>
					</Card>
				);
			}.bind(this));

			return positionList;
		}
	}

    render() {
		if(!this.state.portfolio && !this.state.day && !this.state.week && !this.state.month && !this.state.quarter && !this.state.year && !this.state.all) {
			Promise.join(
				// this.robinhood.portfolios(),
				Portfolios,
				// this.robinhood.portfolioHistoricals({span: 'day', interval: '5minute'}),
				Day,
				// this.robinhood.portfolioHistoricals({span: 'week', interval: '10minute'}),
				Week,
				// this.robinhood.portfolioHistoricals({span: 'year', interval: 'day'}),
				Year,
				// this.robinhood.portfolioHistoricals({span: '5year', interval: 'week'}),
				AllTime,
				function(portfolioRes, dayRes, weekRes, yearRes, allRes) {
					// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("portfolios.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
					// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, portfolioRes.responseText);
					// });
					// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("day.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
					// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, dayRes.responseText);
					// });
					// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("week.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
					// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, weekRes.responseText);
					// });
					// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
					// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, yearRes.responseText);
					// });
					// Windows.Storage.ApplicationData.current.localFolder.createFileAsync("5year.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (sampleFile) {
					// 	return Windows.Storage.FileIO.writeTextAsync(sampleFile, allRes.responseText);
					// });
					let { portfolio, afterHoursText } = this.processPortfolio(portfolioRes.responseJSON);
					let day = this.processDay(dayRes.responseJSON);
					let week = this.processWeek(weekRes.responseJSON, portfolio);
					let { month, quarter, year } = this.processYear(yearRes.responseJSON, portfolio);
					let all = this.process5Year(allRes.responseJSON, portfolio);
					this.setState({
						portfolio,
						day,
						week,
						month,
						quarter,
						year,
						all,
						afterHoursText,
						title: portfolio.equity,
						subtitle: afterHoursText,
					});
				}.bind(this)
			);

			return (<div>Loading...</div>);
		} else {
			this.x = scaleLinear()
				.range([0, this.state.width]);

			this.y = scaleLinear()
				.range([this.state.height, 0]);

			this.lineD3 = line()
				.x(function(d) { return this.x(d.xVal); }.bind(this))
				.y(function(d) { return this.y(d.yVal); }.bind(this));

			return (
				<div>
					<MuiThemeProvider muiTheme={muiTheme}>
						<div>
							<Card style={{marginBottom: 15}}>
								<CardHeader
									ref="header"
									title={this.formatCurrency(this.state.title)}
									subtitle={this.state.subtitle}
								/>
								<CardText>
									<div id="chart-container">
										<svg id={`${this.state.tab}-chart`} className="line-chart-svg" width={this.state.width + this.state.margin.left + this.state.margin.right} height={this.state.height + this.state.margin.top + this.state.margin.bottom}>
											<g className="line-chart-container-svg" transform={`translate(${this.state.margin.left}, ${this.state.margin.top})`}>
												{this.getPath(this.state.tab)}

												<g ref="focus" height={this.state.height} transform="translate(0,0)" style={{display: 'none'}}>
													<line x1='0' y1='0' x2='0' y2={this.state.height} stroke="white" strokeWidth="2.5px" className="verticalLine"></line>
												</g>

												<rect ref="overlay" width={this.state.width} height={this.state.height} style={{fill: 'transparent'}}></rect>
											</g>
										</svg>
									</div>
								</CardText>
								<CardActions style={{display: 'flex'}}>
									<FlatButton id="day" style={{flex: 1, minWidth: 0}} onTouchTap={this.handleChange.bind(this)} label="1D" labelStyle={{color: (this.state.tab == 'day' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'day' ? 'active' : '')}`}/>
									<FlatButton id="week" style={{flex: 1, minWidth: 0}} onTouchTap={this.handleChange.bind(this)} label="1W" labelStyle={{color: (this.state.tab == 'week' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'week' ? 'active' : '')}`}/>
									<FlatButton id="month" style={{flex: 1, minWidth: 0}} onTouchTap={this.handleChange.bind(this)} label="1M" labelStyle={{color: (this.state.tab == 'month' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'month' ? 'active' : '')}`}/>
									<FlatButton id="quarter" style={{flex: 1, minWidth: 0}} onTouchTap={this.handleChange.bind(this)} label="3W" labelStyle={{color: (this.state.tab == 'quarter' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'quarter' ? 'active' : '')}`}/>
									<FlatButton id="year" style={{flex: 1, minWidth: 0}} onTouchTap={this.handleChange.bind(this)} label="1Y" labelStyle={{color: (this.state.tab == 'year' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'year' ? 'active' : '')}`}/>
									<FlatButton id="all" style={{flex: 1, minWidth: 0}} onTouchTap={this.handleChange.bind(this)} label="ALL" labelStyle={{color: (this.state.tab == 'all' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'all' ? 'active' : '')}`}/>
								</CardActions>
							</Card>
							{this.getCards()}
							{this.getPositions()}
						</div>
					</MuiThemeProvider>
				</div>
			);
		}
    }
}

export default PortfolioPane;