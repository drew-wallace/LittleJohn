import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import moment from 'moment';
import _ from "lodash";

import { timeParse, bisector, format, scaleLinear, line, select, extent, drag, mouse } from 'd3';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import { MuiThemeProvider } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Lightbulb from 'material-ui/svg-icons/action/lightbulb-outline';
import Avatar from 'material-ui/Avatar';

import Hammer from 'react-hammerjs'

import Portfolios from '../data/portfolios';
import Positions from '../data/positions';
import Day from '../data/day';
import Week from '../data/week';
import Year from '../data/year';
import AllTime from '../data/5year';

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

		let portfolio = Portfolios.results[0];
		portfolio.equity = +portfolio.equity;
		portfolio.extended_hours_equity = +portfolio.extended_hours_equity;

		let afterHoursReturn = portfolio.extended_hours_equity - portfolio.equity;
		let afterHoursPercentReturn = afterHoursReturn / portfolio.equity;
		let afterHoursText = `${this.formatCurrency(portfolio.extended_hours_equity)} ${this.formatCurrencyDiff(afterHoursReturn)} (${this.formatPercentDiff(afterHoursPercentReturn)}) After-hours`;

		this.timeSpan = 'day';
		let day = Day.equity_historicals;
		day = day.map(function(d, i){
            d.xVal = i;
            // data key: open for day timeSpan, close for all others
            d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
            return d;
        }.bind(this));


		let week = Week.equity_historicals;
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

		let month = [];
		let quarter = [];
		let year = [];
		let yearData = Year.equity_historicals;

		if(moment(yearData[0].begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0))) {
			_.each(yearData, function(d, i){
				d.xVal = i;
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];

				if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(Year.equity_historicals).begins_at).hour(0).minute(0).second(0).subtract(3, 'month'))) {
					quarter.push(Object.assign({}, d));
					if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(Year.equity_historicals).begins_at).hour(0).minute(0).second(0).subtract(1, 'month'))) {
						month.push(Object.assign({}, d));
					}
				}

				year.push(Object.assign({}, d));
			}.bind(this));
		} else {
			yearData = _.filter(yearData, function(d, i){
				d.xVal = i;
				d.yVal = +d[this.timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];

				if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(Year.equity_historicals).begins_at).hour(0).minute(0).second(0).subtract(3, 'month'))) {
					quarter.push(Object.assign({}, d));
					if(moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(_.last(Year.equity_historicals).begins_at).hour(0).minute(0).second(0).subtract(1, 'month'))) {
						month.push(Object.assign({}, d));
					}
				}

				year.push(Object.assign({}, d));
				return moment(d.begins_at).hour(0).minute(0).second(0).isAfter(moment(portfolio.start_date).hour(0).minute(0).second(0).subtract(1, 'month'));
			}.bind(this));
		}

		let all = AllTime.equity_historicals;
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
			portfolio,
			afterHoursText,
			title: portfolio.equity,
			subtitle: afterHoursText,
			day,
			week,
			month,
			quarter,
			year,
			all,
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

	componentDidMount() {
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

	handleSwipe(e) {
		let element = ReactDOM.findDOMNode(this.refs.article);
		element.style.transform =  `translate(${e.deltaX}px,0px)`;
	}

	handleSwipeEnd(e) {
		let element = ReactDOM.findDOMNode(this.refs.article);
		element.style.transform =  `translate(${e.deltaX}px,0px)`;
		if(Math.abs(e.deltaX / this.state.width) >= 0.5) {
			// pop article off stack
			// setstate
			element.parentNode.removeChild(element);
		} else {
			ReactDOM.findDOMNode(this.refs.article).style.transform =  `translate(0px,0px)`;
		}
	}

	getPositions() {
		let positionList = [];
		_.each(Positions, function(v, i) {
			const margin = {top: 0, right: 0, bottom: 0, left: 0};
			const width = 100 - margin.left - margin.right;
			const height = 25 - margin.top - margin.bottom;
			const x = scaleLinear().range([0, width]);
			const y = scaleLinear().range([height, 0]);
			const lineD3 = line()
						.x(function(d) { return x(d.xVal); })
						.y(function(d) { return y(d.yVal); });

			// untested
			let data = this.state.day;
			// let day = v.equity_historicals;
			// day = day.map(function(d, i){
			// 	d.xVal = i;
			// 	// data key: open for day timeSpan, close for all others
			// 	d.yVal = +d.adjusted_open_equity;
			// 	return d;
			// }.bind(this));

			// hard-coding portfolio day amount for now
			x.domain(extent(data, function(d) { return d.xVal }));
			y.domain(extent(data, function(d) { return d.yVal; }));

			positionList.push(
				<Card style={{marginBottom: 15}} key={i}>
					<CardText>
						<div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
							<div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
								<div style={{flex: 1}}><span className="card-title">{v.instrument.symbol}</span></div>
								<div style={{flex: 1}}>
									{v.quantity} Shares
								</div>
							</div>
							<div style={{flex: 1}}>
								<svg className="line-chart-svg" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
									<g className="line-chart-container-svg" transform={`translate(${margin.left}, ${margin.top})`}>
										<path className="line" d={lineD3(data)}></path>
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

    render() {
		if(!this.state.portfolio) {
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
							<Hammer onPan={this.handleSwipe.bind(this)} onPanEnd={this.handleSwipeEnd.bind(this)}>
								<Card ref="article" style={{marginBottom: 15}}>
									<CardText>
										<div style={{display: 'flex'}}>
											<div style={{flex: 1}}><Lightbulb/> <span className="card-title">Introduction</span></div>
											<div style={{flex: 0}}>
												<Badge badgeContent={4} primary={true}/>
											</div>
										</div>
										<div>Hello</div>
										<p>Welcome! We've added a new  home for your personalized content and notifications</p>
										<div>SWIPE TO LEARN MORE</div>
									</CardText>
								</Card>
							</Hammer>
							{this.getPositions()}
						</div>
					</MuiThemeProvider>
				</div>
			);
		}
    }
}

export default PortfolioPane;