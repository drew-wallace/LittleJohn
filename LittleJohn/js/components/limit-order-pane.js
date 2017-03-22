import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { FloatingActionButton, TextField } from 'material-ui';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import { formatCurrency } from '../lib/formaters';
import value_equals from '../lib/value_equals';

class LimitOrderPaneComponent extends Component {
	constructor(props) {
	    super(props);

		this.state = {
			showNextButton: false,
			value: ''
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.showNextButton !== this.state.showNextButton || nextState.value !== this.state.value || !value_equals(nextProps, this.props);
	}

	toNumber(value) {
		return value.toString().match(/[0-9]*(\.[0-9]{0,4})?/)[0]
	};

	toggleNextButton() {
		this.setState({
			showNextButton: !!Number(this.validLimitPrice),
			value: this.validLimitPrice
		});
	}

	diffStrings(newVal, oldVal) {
		for (var i = 0; i < newVal.length; i++) {
			if(newVal[i] !== oldVal[i]) {
				return newVal[i];
			}
		}
	}

    render() {
		const { currentOrder, stock, setOrderPrice } = this.props;
		return (
			<div style={{ paddingLeft: 65 }}>
				<p>Specify the {(currentOrder.side == 'sell' ? 'minimum' : 'maximum')} amount you're<br />willing to {(currentOrder.side ? 'receive' : 'pay')} per share.</p>
				<span>$</span>
				<TextField
					value={this.state.value}
					hintText="0.00"
					onChange={(e, newVal) => {
						const diff = this.diffStrings(newVal, this.state.value);
						if (diff === undefined || !isNaN(diff) || (diff === '.' && !_.includes(this.state.value, '.'))) {
							newVal = this.toNumber(newVal);
							this.validLimitPrice = newVal;
							this.toggleNextButton();
						}
					}}
				/>
				<p>Current Price: {formatCurrency(stock.quote.last_trade_price)}</p>
				<FloatingActionButton
					style={{display: (this.state.showNextButton ? 'inline-block' : 'none')}}
					onTouchTap={() => setOrderPrice('Time In Force', {hasBackButton: true, activePane: 'time in force', price: Number(this.validLimitPrice)})}
				>
					<ChevronRight />
				</FloatingActionButton>
			</div>
		);
		// Large $ field 0.00 placeholder
		// Current Price: $1.04 <-- I think it fetches the latest quote on render.
		// button to take user to time in force pane
		// on screen keyboard?
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

export default LimitOrderPaneComponent;