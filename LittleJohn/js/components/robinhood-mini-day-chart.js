import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import _ from 'lodash';
import { scaleLinear, line, extent } from 'd3';

import styles from '../styles';

const { positivePrimaryColor, negativePrimaryColor } = styles;

class RobinhoodMiniDayChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { historicals } = this.props.stock;

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
            <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <path fill="none" stroke={(+_.last(data).adjusted_open_equity >= +data[0].adjusted_open_equity ? positivePrimaryColor : negativePrimaryColor)} strokeWidth="2.5px" d={lineD3(data)}></path>
                </g>
            </svg>
        );
    }
};

// RobinhoodMiniDayChart.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default RobinhoodMiniDayChart;