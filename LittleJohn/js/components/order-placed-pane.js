import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { List, ListItem, Divider, IconButton, FloatingActionButton, TextField, Snackbar } from 'material-ui';
import Hammer from 'react-hammerjs';
import HammerJS from 'hammerjs';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Check from 'material-ui/svg-icons/navigation/check';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import styles from '../styles';

import { formatNumberBig, formatCurrency } from '../lib/formaters';
import value_equals from '../lib/value_equals';

class OrderPlacementPaneComponent extends Component {
	constructor(props) {
	    super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !value_equals(nextState, this.state) || !value_equals(nextProps, this.props);
	}

    render() {
		const { changePrimaryColor, primaryColor, stockType, stock, currentOrder, account, confirmOrder } = this.props;
		const shares = currentOrder.side == 'sell' ? +stock.quantity : Math.floor(+account.buying_power / +stock.quote.last_trade_price);
		const price = currentOrder.type == 'market' ? +stock.quote.last_trade_price : currentOrder.price;
		const costOrCredit = this.validNumberOfShares * price;
		const sharesOrBuyingPower = `${currentOrder.side == 'sell' ? `${formatNumberBig(shares)} share(s)` : formatCurrency(+account.buying_power)} available`;
		let time_in_force = currentOrder.time_in_force;
		switch (time_in_force) {
			case 'gfd':
				time_in_force = 'good for day';
				break;
			case 'gtc':
				time_in_force = 'good till canceled';
				break;
		}

		return (
			<div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'absolute', width: '100%', marginTop: -55 }}>
				<div style={{ margin: 15, backgroundColor: '#000000', position: 'relative', top: '50%' }}>
					<List>
						<ListItem
							primaryText={currentOrder.quantity}
							secondaryText="Share(s) Entered"
							disabled={true}
						/>
						<ListItem
							primaryText={currentOrder.quantity * currentOrder.price}
							secondaryText={`Estimated ${currentOrder.side == 'sell' ? 'Credit' : 'Cost'}`}
							disabled={true}
						/>
						<Divider/>
					</List>
					<span>Markets are closed right now. Your limit order, placed Apr 14, 2017 3:09:12 PM, will be sent at the start of the next trading session. Your order will expire if unexecuted by Apr 17, 4:00:00 PM.</span>
				</div>
			</div>
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

export default OrderPlacementPaneComponent;