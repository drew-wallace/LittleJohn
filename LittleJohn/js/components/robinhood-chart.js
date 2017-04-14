import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import { bisector, scaleLinear, line, select, extent, drag, mouse } from 'd3';

import value_equals from '../lib/value_equals';
import styles from '../styles';

import { formatCurrency, formatCurrencyDiff, formatPercentDiff, formatTime, formatRelativeTime } from '../lib/formaters';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const { positivePrimaryColor, negativePrimaryColor } = styles;

class RobinhoodChart extends Component {
    constructor(props) {
        super(props);

        this.setupChart = _.memoize(this.setupChart);
        this.generateSubtitle = _.memoize(this.generateSubtitle);

        const { subtitle, margin, width, height } = this.setupChart(this.props);
        const newPrimaryColor = (+_.last(this.props.data.day)[this.openKey] >= +this.props.previousClose ? positivePrimaryColor : negativePrimaryColor);

        this.state = {
            title: this.props.title,
            subtitle,
            data: this.props.data.day,
            tab: 'day',
            primaryColor: newPrimaryColor,
            margin,
            width,
            height
        };
    }

    setupChart(props) {
        const margin = props.margin;
		const width = 700 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

        this.x = scaleLinear().range([0, width]);
		this.y = scaleLinear().range([height, 0]);
		this.lineD3 = line()
						.x((d) => this.x(d.xVal))
						.y((d) => this.y(d.yVal));

        this.bisectDate = bisector(function(d) { return d.xVal; }).left;

        if(_.has(props.data.day[0], 'adjusted_open_equity')) {
            this.openKey = 'adjusted_open_equity';
            this.closeKey = 'adjusted_close_equity';
        } else if(_.has(props.data.day[0], 'open_price')){
            this.openKey = 'open_price';
            this.closeKey = 'close_price';
        }

        const subtitle = this.generateSubtitle('day', props.data.day, props.title);

        return { subtitle, margin, width, height };
    }

    generateSubtitle(tab=_.get(this, 'state.tab', 'day'), data=_.get(this, 'state.data', this.props.data[tab]), title=this.props.title) {
        const equityKey = (tab == 'day' ? this.openKey : this.closeKey);
        const startingEquity = +data[0][equityKey];
		const endingEquity = title;
		const netReturn = endingEquity - startingEquity;
		const netPercentReturn = netReturn / startingEquity;
		const equityChangeText = `${formatCurrencyDiff(netReturn)} (${formatPercentDiff(netPercentReturn)}) ${formatRelativeTime(data[0].begins_at, tab)}`;

        return equityChangeText;
    }

    changeTab(tab) {
        const equityKey = (tab == 'day' ? this.openKey : this.closeKey);
        const subtitle = this.generateSubtitle(tab, this.props.data[tab]);
        const primaryColor = (+_.last(this.props.data[tab])[equityKey] >= +this.props.previousClose ? positivePrimaryColor : negativePrimaryColor)
        this.props.changePrimaryColor(primaryColor);
		this.setState({
            tab,
            data: this.props.data[tab],
            subtitle,
            primaryColor
        });
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

    componentWillReceiveProps(nextProps) {
        if(nextProps.title != this.props.title) {
            if(_.has(nextProps.data.day[0], 'adjusted_open_equity')) {
                this.openKey = 'adjusted_open_equity';
                this.closeKey = 'adjusted_close_equity';
            } else if(_.has(nextProps.data.day[0], 'open_price')){
                this.openKey = 'open_price';
                this.closeKey = 'close_price';
            }

            const subtitle = this.generateSubtitle('day', nextProps.data.day, nextProps.title);
            const primaryColor = (+_.last(nextProps.data.day)[this.openKey] >= +nextProps.previousClose ? positivePrimaryColor : negativePrimaryColor);

            this.setState({
                title: nextProps.title,
                subtitle,
                data: nextProps.data.day,
                tab: 'day',
                primaryColor,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.primaryColor != this.state.primaryColor) {
            this.props.changePrimaryColor(this.state.primaryColor);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(!this.state.dragging) {
            this.x.domain(extent(nextState.data, function(d) { return d.xVal; }));
            this.y.domain(extent(nextState.data, function(d) { return d.yVal; }));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
		return !value_equals(nextState, this.state) || !value_equals(nextProps, this.props);
	}

	_startdrag() {
		this.setState({
            dragging: true
		});
    }

    _dragging(ignoreThis, elmIndex, elms) {
        select(ReactDOM.findDOMNode(this.refs.focus))
			.style('display', null);

    	const x0 = this.x.invert(mouse(elms[elmIndex])[0]);
        const i = this.bisectDate(this.state.data, x0, 1);

		if(i >= this.state.data.length) return false;

		const d0 = this.state.data[i - 1];
        const d1 = this.state.data[i];
        const d = x0 - d0.xVal > d1.xVal - x0 ? d1 : d0;

		const netReturn = d.yVal - this.state.data[0].yVal;
        const netPercentReturn = netReturn / this.state.data[0].yVal;
        const equityChangeText = `${formatCurrencyDiff(netReturn)} (${formatPercentDiff(netPercentReturn)}) ${formatTime(d.begins_at, this.state.tab)}`;


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
			.text(formatCurrency(d.yVal));
		select(ReactDOM.findDOMNode(this.refs.header))
			.select("div span:nth-child(2)")
			.text(equityChangeText);

		select(ReactDOM.findDOMNode(this.refs.focus))
			.attr('transform', `translate(${xPos},0)`);
    }

    _enddrag() {
		select(ReactDOM.findDOMNode(this.refs.focus))
			.style('display', 'none')
			.attr('transform', 'translate(0,0)');

        select(ReactDOM.findDOMNode(this.refs.header))
			.select("div span:nth-child(1)")
			.text(formatCurrency(this.state.title));
		select(ReactDOM.findDOMNode(this.refs.header))
			.select("div span:nth-child(2)")
			.text(this.state.subtitle);

		this.setState({
            dragging: false
		});
    }

    render() {
        let previousClosePoint = this.y(this.props.previousClose);
        if (previousClosePoint < 0) {
            previousClosePoint = 0;
        }
        return (
            <Card style={{marginBottom: 15}}>
                <CardHeader
                    ref="header"
                    title={formatCurrency(this.state.title)}
                    subtitle={this.state.subtitle}
                />
                <CardText>
                    <div ref="chart_container">
                        <svg ref="chart" width={this.state.width + this.state.margin.left + this.state.margin.right} height={this.state.height + this.state.margin.top + this.state.margin.bottom}>
                            <g transform={`translate(${this.state.margin.left}, ${this.state.margin.top})`}>
                                <path ref="mainLine" fill="none" stroke={this.state.primaryColor} strokeWidth="2.5px" d={this.lineD3(this.state.data)}></path>

                                <line className="dashed-line" x1='0' y1={previousClosePoint} x2={this.state.width} y2={previousClosePoint} stroke="white" strokeWidth="1px"></line>

                                <g ref="focus" height={this.state.height} transform="translate(0,0)" style={{display: 'none'}}>
                                    <line x1='0' y1='0' x2='0' y2={this.state.height} stroke="white" strokeWidth="2.5px"></line>
                                </g>

                                <rect ref="overlay" width={this.state.width} height={this.state.height} style={{fill: 'transparent'}}></rect>
                            </g>
                        </svg>
                    </div>
                </CardText>
                <CardActions style={{display: 'flex'}}>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('day')} label="1D" labelStyle={{color: (this.state.tab == 'day' ? 'white' : this.state.primaryColor)}} className={`chart-button ${(this.state.tab == 'day' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('week')} label="1W" labelStyle={{color: (this.state.tab == 'week' ? 'white' : this.state.primaryColor)}} className={`chart-button ${(this.state.tab == 'week' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('month')} label="1M" labelStyle={{color: (this.state.tab == 'month' ? 'white' : this.state.primaryColor)}} className={`chart-button ${(this.state.tab == 'month' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('quarter')} label="3M" labelStyle={{color: (this.state.tab == 'quarter' ? 'white' : this.state.primaryColor)}} className={`chart-button ${(this.state.tab == 'quarter' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('year')} label="1Y" labelStyle={{color: (this.state.tab == 'year' ? 'white' : this.state.primaryColor)}} className={`chart-button ${(this.state.tab == 'year' ? 'active' : '')}`}/>
                    <FlatButton style={{flex: 1, minWidth: 0}} onTouchTap={() => this.changeTab('all')} label="ALL" labelStyle={{color: (this.state.tab == 'all' ? 'white' : this.state.primaryColor)}} className={`chart-button ${(this.state.tab == 'all' ? 'active' : '')}`}/>
                </CardActions>
            </Card>
        );
    }
};

export default RobinhoodChart;