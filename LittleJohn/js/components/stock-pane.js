import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import moment from 'moment';

import { RaisedButton } from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';

import RobinhoodChartComponent from './robinhood-chart';


class PositionPaneComponent extends Component {
	constructor(props) {
	    super(props);
	}

	handleSell() {
		this.props.changeTitle('Market Sell', {symbol: this.props.stock.instrument.symbol, hasBackButton: true});
	}

	handleBuy() {
		this.props.changeTitle('Market Buy', {symbol: this.props.stock.instrument.symbol, hasBackButton: true});
	}

    render() {
		// if(this.props.stock.lastUpdated) {
			let changePrimaryColor = this.props.changePrimaryColor;
			let primaryColor = this.props.primaryColor;
			let { historicals, quote } = this.props.stock;

			return (
				<div>
					<RobinhoodChartComponent
						title={+quote.last_trade_price}
						margin={{top: 0, right: 0, bottom: 0, left: 0}}
						data={historicals}
						changePrimaryColor={changePrimaryColor}
					/>
					<div style={{display: 'flex', justifyContent: 'space-around'}}>
						<RaisedButton
							label="SELL"
							primary={true}
							style={{flex: '0 0 49%'}}
							onTouchTap={() => this.handleSell()}
						/>
						<RaisedButton
							label="BUY"
							primary={true}
							style={{flex: '0 0 49%'}}
							onTouchTap={() => this.handleBuy()}
						/>
					</div>
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