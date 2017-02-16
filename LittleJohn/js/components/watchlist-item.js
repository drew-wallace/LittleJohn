import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import _ from 'lodash';
import { scaleLinear, line, extent } from 'd3';

import { formatCurrency, formatPercent } from '../lib/formaters';
import styles from '../styles';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const { positivePrimaryColor, negativePrimaryColor } = styles;

class WatchlistItemComponent extends Component {
    constructor(props) {
        super(props);
    }

    getDisplayedValue() {
        const displayedValue = this.props.settings.displayedValue;
        const { quantity, quote } = this.props.stock;

        switch(displayedValue) {
            case 'price':
                return formatCurrency(quote.last_trade_price);
            case 'equity':
                return formatCurrency(quote.last_trade_price * quantity);
            case 'percent':
                return formatPercent((quote.last_trade_price * quote.previous_close) - 1);
        }
    }

    render() {
        const changeTitle = this.props.changeTitle;
        let { historicals, instrument, quantity, quote } = this.props.stock;

        const margin = {top: 0, right: 0, bottom: 0, left: 0};
        const width = 100 - margin.left - margin.right;
        const height = 25 - margin.top - margin.bottom;
        const x = scaleLinear().range([0, width]);
        const y = scaleLinear().range([height, 0]);
        const lineD3 = line()
                    .x(function(d) { return x(d.xVal); })
                    .y(function(d) { return y(d.yVal); });

        let data = historicals.day;
        data = data.map(function(d, i){
            d.xVal = i;
            d.yVal = +d.open_price;
            return d;
        }.bind(this));

        x.domain(extent(data, function(d) { return d.xVal; }));
        y.domain(extent(data, function(d) { return d.yVal; }));

        return (
            <FlatButton onTouchTap={() => changeTitle(instrument.name)} backgroundColor="#303030" hoverColor="#434343" rippleColor='#bdbdbd' style={{width: '100%', marginBottom: 15, height: 'auto'}}>
                <div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column', flex: '0 1 25%', alignItems: 'center'}}>
                        <div style={{flex: 1}}>
                            <span>{instrument.symbol}</span>
                        </div>
                        <div style={{flex: 1}}>
                            <span>Watchlist</span>
                        </div>
                    </div>
                    <div style={{flex: '0 1 50%'}}>
                        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                            <g transform={`translate(${margin.left}, ${margin.top})`}>
                                <path fill="none" stroke={(+_.last(data).adjusted_open_equity >= +data[0].adjusted_open_equity ? positivePrimaryColor : negativePrimaryColor)} strokeWidth="2.5px" d={lineD3(data)}></path>
                            </g>
                        </svg>
                    </div>
                    <div style={{flex: '0 1 25%'}}>
                        <span>{this.getDisplayedValue()}</span>
                    </div>
                </div>
            </FlatButton>
        );
    }
};

// WatchlistItemComponent.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default WatchlistItemComponent;