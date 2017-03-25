import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { FloatingActionButton, TextField } from 'material-ui';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import { formatCurrency } from '../lib/formaters';
import value_equals from '../lib/value_equals';

class StopOrderPaneComponent extends Component {
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
			showNextButton: !!Number(this.validStopPrice),
			value: this.validStopPrice
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
		const { currentOrder, stock, setStopPrice, title } = this.props;
		return (
			<div style={{ paddingLeft: 65 }}>
				<p>A price below the current price that<br />converts your order to a {(title.activePane == 'stop loss' ? 'market' : 'limit')} order.</p>
				<span>$</span>
				<TextField
					ref="priceTextField"
					autoFocus={true}
					value={this.state.value}
					hintText="0.00"
					onChange={(e, newVal) => {
						const diff = this.diffStrings(newVal, this.state.value);
						if (diff === undefined || !isNaN(diff) || (diff === '.' && !_.includes(this.state.value, '.'))) {
							newVal = this.toNumber(newVal);
							this.validStopPrice = newVal;
							this.toggleNextButton();
						}
					}}
					onKeyDown={(e) => {
						if (!e.key.match(/^[0-9]|\.$/) && this.refs.priceTextField.input.value == '') {
							e.preventDefault();
						}
					}}
				/>
				<p>Current Price: {formatCurrency(stock.quote.last_trade_price)}</p>
				<FloatingActionButton
					style={{display: (this.state.showNextButton ? 'inline-block' : 'none')}}
					onTouchTap={() => (title.activePane == 'stop loss' ? setStopPrice('Time In Force', { hasBackButton: true, activePane: 'time in force', stop_price: Number(this.validStopPrice) }) : setStopPrice('Limit Price', { activePane: 'limit', orderType: 'limit', hasBackButton: true, stop_price: Number(this.validStopPrice)}))}
				>
					<ChevronRight />
				</FloatingActionButton>
			</div>
		);
		// A price below the current price that\nconverts your order to a {market || limit} order.
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

export default StopOrderPaneComponent;