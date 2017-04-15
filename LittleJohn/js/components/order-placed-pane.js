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

import { formatCurrency } from '../lib/formaters';
import value_equals from '../lib/value_equals';

class OrderPlacementPaneComponent extends Component {
	constructor(props) {
	    super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !value_equals(nextState, this.state) || !value_equals(nextProps, this.props);
	}

    render() {
		const { primaryColor, currentOrder, stock, backToStockPane } = this.props;
		const price = currentOrder.type == 'market' ? +stock.quote.last_trade_price : currentOrder.price;
		const costOrCredit = currentOrder.quantity * price;

		return (
			<div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', position: 'absolute', width: '100%' }}>
				<div style={{ margin: 15, backgroundColor: '#000000', position: 'relative' }}>
					<List style={{display: 'flex', justifyContent: 'space-around', width: '80%', margin: '0 auto'}}>
						<ListItem
							primaryText={<div style={{textAlign: 'center', width: '100%'}}>{currentOrder.quantity}</div>}
							secondaryText="Share(s) Entered"
							disabled={true}
						/>
						<ListItem
							primaryText={<div style={{ textAlign: 'center', width: '100%' }}>{formatCurrency(costOrCredit)}</div>}
							secondaryText={`Estimated ${currentOrder.side == 'sell' ? 'Credit' : 'Cost'}`}
							disabled={true}
						/>
					</List>
					<Divider/>
					<p style={{padding: '0 16px'}}>Markets are closed right now. Your limit order, placed Apr 14, 2017 3:09:12 PM, will be sent at the start of the next trading session. Your order will expire if unexecuted by Apr 17, 4:00:00 PM.</p>
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