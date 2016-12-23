import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import { timeParse, bisector, format, scaleLinear, line, select, extent, drag, mouse } from 'd3';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import { MuiThemeProvider } from 'material-ui';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Portfolios from '../data/portfolios';
import Day from '../data/day';
import Week from '../data/week';
import Year from '../data/year';
import AllTime from '../data/5year';

// import Alphabet from './Alphabet';
// import FancyText from './FancyText';

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
			chartData: null,
			tab: '1D',
			text: '',
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

		return hours + ':' + minutes + ' EDT'
	}

	handleChange(tab) {
		this.setState({
			tab
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

		// Performance issue
		// this.setState({
		// 	title: d[this.yVal],
		// 	subtitle: equityChangeText,
		// });

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

    render() {
		if(!this.state.portfolio) {
			return (<div>Loading...</div>);
		} else {
			return (
				<MuiThemeProvider muiTheme={muiTheme}>
					<Card>
						<CardHeader
							ref="header"
							title={this.formatCurrency(this.state.title)}
							subtitle={this.state.subtitle}
						/>
						<CardText>
							<Tabs value={this.state.tab} onChange={this.handleChange.bind(this)}>
								<Tab label="1D" value="1D">
									<svg className="line-chart-svg" width={this.state.width + this.state.margin.left + this.state.margin.right} height={this.state.height + this.state.margin.top + this.state.margin.bottom}>
											<g className="line-chart-container-svg" transform={`translate(${this.state.margin.left}, ${this.state.margin.top})`}>
												{this.getPath('day')}

												<g ref="focus" height={this.state.height} transform="translate(0,0)" style={{display: 'none'}}>
													<line x1='0' y1='0' x2='0' y2={this.state.height} stroke="white" strokeWidth="2.5px" className="verticalLine"></line>
												</g>

												<rect ref="overlay" width={this.state.width} height={this.state.height} style={{fill: 'transparent'}}></rect>
											</g>
									</svg>
								</Tab>
								<Tab label="1M" value="1M">
									<div>
										<h2 style={styles.headline}>Controllable Tab B</h2>
										<p>
											This is another example of a controllable tab. Remember, if you
											use controllable Tabs, you need to give all of your tabs values or else
											you wont be able to select them.
										</p>
									</div>
								</Tab>
							</Tabs>
						</CardText>
					</Card>
				</MuiThemeProvider>
			);
		}
    }
}

export default PortfolioPane;