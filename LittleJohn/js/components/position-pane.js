import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import moment from 'moment';

import CircularProgress from 'material-ui/CircularProgress';

import RobinhoodChartComponent from './robinhood-chart';

import { formatCurrency, formatCurrencyDiff, formatPercentDiff, formatTime } from '../lib/formaters';

class PositionPaneComponent extends Component {
	constructor(props) {
	    super(props);
	}

    render() {
		console.log(this.props.position);
		// if(this.props.position.lastUpdated) {
			let changePrimaryColor = this.props.changePrimaryColor;
			let primaryColor = this.props.primaryColor;
			let { historicals, quote, quantity } = this.props.position;
			// let subtitle = `${formatCurrencyDiff(quote.previous_close - quote.last_trade_price)} (${formatPercentDiff((quote.previous_close - quote.last_trade_price) / quote.last_trade_price)}) ${formatTime(quote.updated_at, 'day')}`;
			let { day/*, week, month, quarter, year, all*/ } = historicals;

			return (
				<div>
					<RobinhoodChartComponent
						title={formatCurrency(quote.last_trade_price * +quantity)}
						margin={{top: 0, right: 0, bottom: 0, left: 0}}
						data={{day/*, week, quarter, month, year, all*/}}
						changePrimaryColor={changePrimaryColor}
					/>
				</div>
			);
		// } else {
		// 	this.props.fetchPortfolioIfNeeded();
		// 	return (
		// 		<div style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', marginTop: -75}}>
		// 			<CircularProgress size={80} thickness={5} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
		// 		</div>
		// 	);
		// }
	}
}

// RobinhoodPosition.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default PositionPaneComponent;