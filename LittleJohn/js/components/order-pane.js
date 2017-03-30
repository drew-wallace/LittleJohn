import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';

import { List, ListItem, Divider, IconButton, FloatingActionButton, TextField, Snackbar } from 'material-ui';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Check from 'material-ui/svg-icons/navigation/check';

import { formatNumberBig, formatCurrency, formatCurrencyDiff } from '../lib/formaters';
import value_equals from '../lib/value_equals';

class OrderPaneComponent extends Component {
	constructor(props) {
	    super(props);

		this.state = {
			showSharesInfo: '',
			showPlaceOrderButton: false,
			value: ''
		};

		this.validNumberOfShares = 0;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !value_equals(nextState, this.state) || !value_equals(nextProps, this.props);
	}

	toNumber(value) {
		return value.toString().match(/[0-9]*/)[0]
	};

	toggleNextButton() {
		this.setState({
			showPlaceOrderButton: !!Number(this.validNumberOfShares),
			value: this.validNumberOfShares
		});
	}

	diffStrings(newVal, oldVal) {
		for (var i = 0; i < newVal.length; i++) {
			if (newVal[i] !== oldVal[i]) {
				return newVal[i];
			}
		}
	}

	handleRequestClose() {
		this.setState({
			showSharesInfo: ''
		});
	}

    render() {
		const { stock, account, order } = this.props;
		let time_in_force = order.time_in_force;
		let totalNotional = _.capitalize(order.state);

		switch(time_in_force) {
			case 'gfd':
				time_in_force = 'Good For Day';
				break;
			case 'gtc':
				time_in_force = 'Good Till Canceled';
				break;
		}

		if (+order.average_price > 0) {
			totalNotional = formatCurrencyDiff(+order.average_price * +order.cumulative_quantity * (order.side == 'sell' ? 1 : -1));
		}
		// <-
		// 	Limit Sell
		// 	instrument name
		// ==============================

		// 	sub: Order Status
		// 	status

		// 	sub: Time In Force
		// 	gtc or gfd

		// 	sub: Submitted
		// 	MMM DD, YYYY

		// 	sub: Estimated Price
		// 	price (tried to buy/sell for)

		// 	sub: Entered Quantity
		// 	quantity

		// 	sub: Filled Quantity
		// 	filled quantity

		// sub: Settlement Date
		// last_transaction_at if state is filled

		// 	sub: Total Notional
		// 	Queued, Canceled, Placed, total amount subtracted or added to my portfolio based on filled quantity * price

		// 	button: Cancel Order

		return (
			<List style={{ padding: 0 }}>
				<ListItem
					primaryText="Order Status"
					secondaryText={_.capitalize(order.state == 'filled' ? 'completed' : order.state)}
					insetChildren={true}
					disabled={true}
				/>
				<ListItem
					primaryText="Time In Force"
					secondaryText={time_in_force}
					insetChildren={true}
					disabled={true}
				/>
				<ListItem
					primaryText="Submitted"
					secondaryText={moment(order.created_at).format('MMM D YYYY')}
					insetChildren={true}
					disabled={true}
				/>
				<ListItem
					primaryText="Entered Price"
					secondaryText={formatCurrency(+order.price)}
					insetChildren={true}
					disabled={true}
				/>
				<ListItem
					primaryText="Entered Quantity"
					secondaryText={formatNumberBig(+order.quantity)}
					insetChildren={true}
					disabled={true}
				/>
				<ListItem
					primaryText="Filled Quantity"
					secondaryText={+order.cumulative_quantity ? `${formatNumberBig(+order.cumulative_quantity)} shares at ${formatCurrency(+order.average_price)}` : 'N/A'}
					insetChildren={true}
					disabled={true}
				/>
				{order.state == 'filled' && (
					<ListItem
						primaryText="Settlement Date"
						secondaryText={moment(order.last_transaction_at).format('MMM D YYYY')}
						insetChildren={true}
						disabled={true}
					/>
				)}
				<ListItem
					primaryText="Total Notional"
					secondaryText={totalNotional}
					insetChildren={true}
					disabled={true}
				/>
			</List>
		);
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

export default OrderPaneComponent;