import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import { bisector, scaleLinear, line, select, extent, drag, mouse } from 'd3';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class RobinhoodChart extends Component {
    constructor(props) {
        super(props);

        const margin = this.props.margin;
		const width = 700 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

        this.x = scaleLinear().range([0, width]);
		this.y = scaleLinear().range([height, 0]);
		this.lineD3 = line()
						.x((d) => this.x(d.xVal))
						.y((d) => this.y(d.yVal));

        this.bisectDate = bisector(function(d) { return d.xVal; }).left;

        this.state = {
            title: this.props.title,
            subtitle: this.props.subtitle,
            data: this.props.getChartData('day'),
            tab: 'day',
            margin,
            width,
            height
        };
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

    formatTime(d) {
		let hours = d.getHours();
		let minutes = d.getMinutes();

		if(hours > 12) hours -= 12;
		if(hours < 10) hours = '0' + hours;
		if(minutes < 10) minutes = '0' + minutes;

		switch(this.state.tab) {
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

    changeTab(tab) {
        const data = this.props.getChartData(tab);
		this.setState({tab, data});
	}

	onResize() {
        const chartContainer = ReactDOM.findDOMNode(this.refs.chart_container);

        if(chartContainer) {
            const chart = ReactDOM.findDOMNode(this.refs.chart);
			let position = chart.style.position;

            chart.style.position = 'absolute';
			const width = chartContainer.offsetWidth - this.state.margin.left - this.state.margin.right;
			const height = (chartContainer.offsetWidth * 0.5) - this.state.margin.top - this.state.margin.bottom;
			chart.style.position = position;

            if(this.state.width != width || this.state.height != height) {
                this.x = scaleLinear()
                    .range([0, width]);
                this.y = scaleLinear()
                    .range([height, 0]);
                this.lineD3 = line()
                    .x(function(d) { return this.x(d.xVal); }.bind(this))
                    .y(function(d) { return this.y(d.yVal); }.bind(this));

                this.setState({width, height});
            }
		}
	}

    setupDragAndResize() {
        const overlay = select(ReactDOM.findDOMNode(this.refs.overlay));
		overlay.call(drag()
					    .on("start", this._startdrag.bind(this))
					    .on("drag", this._dragging.bind(this))
					    .on("end", this._enddrag.bind(this))
					    .container(function() { return this; }));

		this.onResizeThrottled = _.throttle(this.onResize.bind(this), 10);
		window.addEventListener("resize", this.onResizeThrottled);
    }

    componentDidMount() {
		this.onResize();
		this.setupDragAndResize();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onResizeThrottled);
	}

    componentWillUpdate(nextProps, nextState) {
        if(!this.state.dragging) {
            this.x.domain(extent(nextState.data, function(d) { return d.xVal; }));
            this.y.domain(extent(nextState.data, function(d) { return d.yVal; }));
        }
    }

	_startdrag() {
    	select(ReactDOM.findDOMNode(this.refs.focus))
			.style('display', null);

		const startingEquity = +this.state.data[0].adjusted_open_equity;
		const endingEquity = this.props.title;
		const netReturn = endingEquity - startingEquity;
		const netPercentReturn = netReturn / startingEquity;
		const equityChangeText = `${this.formatCurrencyDiff(netReturn)} (${this.formatPercentDiff(netPercentReturn)}) 04:00 PM EDT`;

		this.setState({
			title: startingEquity,
			subtitle: equityChangeText,
            dragging: true
		});
    }

    _dragging(ignoreThis, elmIndex, elms) {
    	// -$7.41 (-3.11%) 10:55 AM EDT

    	const x0 = this.x.invert(mouse(elms[elmIndex])[0]);
        const i = this.bisectDate(this.state.data, x0, 1);

		if(i >= this.state.data.length) return false;

		const d0 = this.state.data[i - 1];
        const d1 = this.state.data[i];
        const d = x0 - d0.xVal > d1.xVal - x0 ? d1 : d0;

		const netReturn = d.yVal - this.state.data[0].yVal;
        const netPercentReturn = netReturn / this.state.data[0].yVal;
        // TODO: fix this +/- dollar format
        const equityChangeText = `${this.formatCurrencyDiff(Math.abs(netReturn))} (${this.formatPercentDiff(Math.abs(netPercentReturn))}) ${this.formatTime(new Date(d.begins_at))}`;


        const xPos = mouse(elms[elmIndex])[0];

		const pathLength = ReactDOM.findDOMNode(this.refs.mainLine).getTotalLength();
        const thisX = xPos;
        let beginning = thisX;
        let end = pathLength;
        let target;
        let pos;

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
			title: this.props.title,
			subtitle: this.props.subtitle,
            dragging: false
		});
    }

    render() {
        return (
            <Card style={{marginBottom: 15}}>
                <CardHeader
                    ref="header"
                    title={this.formatCurrency(this.state.title)}
                    subtitle={this.state.subtitle}
                />
                <CardText>
                    <div ref="chart_container">
                        <svg ref="chart" className="line-chart-svg" width={this.state.width + this.state.margin.left + this.state.margin.right} height={this.state.height + this.state.margin.top + this.state.margin.bottom}>
                            <g className="line-chart-container-svg" transform={`translate(${this.state.margin.left}, ${this.state.margin.top})`}>
                                <path ref="mainLine" className="line" d={this.lineD3(this.state.data)}></path>

                                <g ref="focus" height={this.state.height} transform="translate(0,0)" style={{display: 'none'}}>
                                    <line x1='0' y1='0' x2='0' y2={this.state.height} stroke="white" strokeWidth="2.5px" className="verticalLine"></line>
                                </g>

                                <rect ref="overlay" width={this.state.width} height={this.state.height} style={{fill: 'transparent'}}></rect>
                            </g>
                        </svg>
                    </div>
                </CardText>
                <CardActions style={{display: 'flex'}}>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('day')} label="1D" labelStyle={{color: (this.state.tab == 'day' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'day' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('week')} label="1W" labelStyle={{color: (this.state.tab == 'week' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'week' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('month')} label="1M" labelStyle={{color: (this.state.tab == 'month' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'month' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('quarter')} label="3W" labelStyle={{color: (this.state.tab == 'quarter' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'quarter' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('year')} label="1Y" labelStyle={{color: (this.state.tab == 'year' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'year' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('all')} label="ALL" labelStyle={{color: (this.state.tab == 'all' ? 'white' : '#6DAD62')}} className={`chart-button ${(this.state.tab == 'all' ? 'active' : '')}`}/>
                </CardActions>
            </Card>
        );
    }
};

export default RobinhoodChart;