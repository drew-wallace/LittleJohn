import React, { Component } from 'react';
import numeral from 'numeral';
import { timeParse, bisector, format, scaleLinear, line, extent } from 'd3';
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
			tab: '1D',
			text: '',
			margin,
			width,
			height,
			equity: '$0',
			focusDisplay: 'none'
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

	day(equity) {
		let data = Day.equity_historicals;
		let startingEquity = +data[0].adjusted_open_equity;
		let endingEquity = equity;
		let netReturn = endingEquity - startingEquity;
		let netPercentReturn = netReturn / startingEquity;
		let equityChangeText = this.formatCurrencyDiff(netReturn) + ' (' + this.formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

		// document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;
		// document.getElementById('current-equity-change-sub-header').originalValue = equityChangeText;
		// document.getElementById('current-equity-change-sub-header').oneDayValue = equityChangeText;

		// oneDayChart.setup(data, 'adjusted_open_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
		// oneDayChart.redrawChart();

		return this.buildChart(data, 'day');
	}

	buildChart(data, timeSpan) {
        data = data.map(function(d, i){
            d.xVal = i;
            // data key: open for day timeSpan, close for all others
            d.yVal = +d[timeSpan == 'day' ? 'adjusted_open_equity' : 'adjusted_close_equity'];
            return d;
        });

        this.x.domain(extent(data, function(d) { return d.xVal; }));
        this.y.domain(extent(data, function(d) { return d.yVal; }));

		return (
			<g className="line-chart-container-svg" transform={`translate(${this.state.margin.left}, ${this.state.margin.top})`}>
				{/*<g className="axis axis--x hide" transform={`translate(0, ${this.height})`}></g>*/}
				{/*.call(axisBottom(this.x));*/}

				{/*<g className="axis axis--y hide">
					<text className="axis-title" transform="rotate(-90)" y="6" dy=".71em" fill="#FFF" style={{textAnchor: 'end'}}>Price ($)</text>
				</g>*/}
				{/*.call(axisLeft(this.y));*/}

				<path className="line" d={this.lineD3(data)}></path>

				<g height={this.state.height} className="focus" style={{display: this.state.focusDisplay}}>
					<line x1='0' y1='0' x2='0' y2={this.state.height} stroke="white" stroke-width="2.5px" className="verticalLine"></line>
				</g>

				<rect className="overlay" width={this.state.width} height={this.state.height} style={{fill: 'transparent'}} onMouseout={() => this.setState({focusDisplay: 'none'})}></rect>
					{/*.call(drag()
					    .on("start", this._startdrag.bind(this))
					    .on("drag", this._dragging.bind(this))
					    .on("end", this._enddrag.bind(this))
					    .container(function() { return this; })*/}
			</g>
		);
	}

    render() {
		let data = Portfolios.results[0];
		data.equity = +data.equity;
		data.extended_hours_equity = +data.extended_hours_equity;

		// document.getElementById('portfolio-header').innerText = this.formatCurrency(data.equity);

		let afterHoursReturn = data.extended_hours_equity - data.equity;
		let afterHoursPercentReturn = afterHoursReturn / data.equity;
		let afterHoursText = `${this.formatCurrency(data.extended_hours_equity)} ${this.formatCurrencyDiff(afterHoursReturn)} (${this.formatPercentDiff(afterHoursPercentReturn)}) After-hours`;

		// document.getElementById('after-hours-sub-header').innerText = afterHoursText;

        return (
        	<MuiThemeProvider muiTheme={muiTheme}>
	        	<Card>
					<CardHeader
						title={this.formatCurrency(data.equity)}
						subtitle={afterHoursText}
					/>
				    <CardText>
						<Tabs value={this.state.tab} onChange={this.handleChange.bind(this)}>
					        <Tab label="1D" value="1D">
					        	<svg className="line-chart-svg" width={this.state.width + this.state.margin.left + this.state.margin.right} height={this.state.height + this.state.margin.top + this.state.margin.bottom}>
										{this.day(data.equity)}
										{/*<FancyText x="32" y="150" text={this.state.text} />*/}
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

export default PortfolioPane;