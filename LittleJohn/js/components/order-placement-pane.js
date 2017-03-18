import React, { Component, PropTypes } from 'react';

import { List, ListItem, IconButton, FloatingActionButton, TextField } from 'material-ui';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Check from 'material-ui/svg-icons/navigation/check';

import value_equals from '../lib/value_equals';

class OrderPlacementPaneComponent extends Component {
	constructor(props) {
	    super(props);

		this.state = {
			showPlaceOrderButton: false,
			value: ''
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.showPlaceOrderButton !== this.state.showPlaceOrderButton || nextState.value !== this.state.value || !value_equals(nextProps, this.props);
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

    render() {
		const { changePrimaryColor, primaryColor, stockType, stock, currentOrder } = this.props;
		// 	 (i) Shares of {symbol}                          0 <-- number input, fills to left
		//
		// 	 Market Price                                $1.03
		//   -------------------------------------------------
		//   Estimated Credit    {quantity} share(s) available <-- Becomes ${shares * Market price}
		return (
			<div>
				<List>
					<ListItem
						leftIcon={<InfoOutline/>}
						disabled={true}
						innerDivStyle={{ display: 'flex' }}
						primaryText={<div style={{flex: '0 1 50%', display: 'flex', alignItems: 'center', marginTop: 8}}>Shares of {currentOrder.symbol}</div>}
						secondaryText={
							<div style={{ flex: '0 1 50%', display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
								<TextField
									value={this.state.value}
									hintText="0"
									style={{height: 16, lineHeight: '16px'}}
									underlineShow={false}
									inputStyle={{textAlign: 'right'}}
									hintStyle={{textAlign: 'right', bottom: 0, width: '100%'}}
									onChange={(e, newVal) => {
										const diff = this.diffStrings(newVal, this.state.value);
										if (diff === undefined || !isNaN(diff)) {
											newVal = this.toNumber(newVal);
											this.validNumberOfShares = newVal;
											this.toggleNextButton();
										}
									}}
								/>
							</div>
						}
					/>
				</List>
				<FloatingActionButton
					style={{ display: (this.state.showPlaceOrderButton ? 'inline-block' : 'none') }}
					onTouchTap={() => confirmOrder({quantity: this.validNumberOfShares})}
				>
					<Check />
				</FloatingActionButton>
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