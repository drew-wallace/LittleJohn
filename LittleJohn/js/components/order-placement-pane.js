import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { List, ListItem, Divider, IconButton, FloatingActionButton, TextField, Snackbar } from 'material-ui';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import Check from 'material-ui/svg-icons/navigation/check';

import { formatNumberBig, formatCurrency } from '../lib/formaters';
import value_equals from '../lib/value_equals';

class OrderPlacementPaneComponent extends Component {
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
		const { changePrimaryColor, primaryColor, stockType, stock, currentOrder, account } = this.props;
		const shares = currentOrder.side == 'sell' ? +stock.quantity : Math.floor(+account.buying_power / +stock.quote.last_trade_price);
		const price = currentOrder.type == 'market' ? +stock.quote.last_trade_price : currentOrder.price;
		const costOrCredit = this.validNumberOfShares * price;
		const sharesOrBuyingPower = `${currentOrder.side == 'sell' ? `${formatNumberBig(shares)} share(s)` : formatCurrency(+account.buying_power)} available`;
		// 	 (i) Shares of {symbol}                          0 <-- number input, fills to left
		//
		// 	 Market Price                                $1.03
		//   -------------------------------------------------
		//   Estimated Credit    {quantity} share(s) available <-- Becomes ${shares * Market price}

		return (
			<div>
				<List>
					<ListItem
						leftIcon={<IconButton style={{paddingTop: 0}} onTouchTap={() => this.setState({ showSharesInfo: `You can ${(currentOrder.side == 'sell' ? 'sell' : 'afford')} ${formatNumberBig(shares)} share(s) of ${currentOrder.symbol}.`})}><InfoOutline/></IconButton>}
						disabled={true}
						innerDivStyle={{ display: 'flex' }}
						primaryText={<div style={{flex: '0 1 50%', display: 'flex', alignItems: 'center', marginTop: 8}}>Shares of {currentOrder.symbol}</div>}
						secondaryText={
							<div style={{ flex: '0 1 50%', display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
								<TextField
									autoFocus={true}
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
					<ListItem
						innerDivStyle={{ display: 'flex' }}
						primaryText={(<span style={{ flex: '0 1 50%', display: 'flex', alignItems: 'center' }}>{_.capitalize(currentOrder.type)} Price</span>)}
						secondaryText={(<span style={{ flex: '0 1 50%', display: 'flex', justifyContent: 'flex-end' }}>{formatCurrency(price)}</span>)}
						disabled={true}
						insetChildren={true}
					/>
					<Divider inset={true}/>
					<ListItem
						innerDivStyle={{ display: 'flex' }}
						primaryText={(<span style={{ flex: '0 1 50%', display: 'flex', alignItems: 'center' }}>Estimated {currentOrder.side == 'sell' ? 'Credit' : 'Cost'}</span>)}
						secondaryText={(<span style={{ flex: '0 1 50%', display: 'flex', justifyContent: 'flex-end' }}>{costOrCredit > 0 ? formatCurrency(costOrCredit) : sharesOrBuyingPower}</span>)}
						disabled={true}
						insetChildren={true}
					/>
				</List>
				<FloatingActionButton
					style={{ display: (this.state.showPlaceOrderButton ? 'inline-block' : 'none') }}
					onTouchTap={() => confirmOrder({quantity: this.validNumberOfShares})}
				>
					<Check />
				</FloatingActionButton>
				<Snackbar
					open={!!this.state.showSharesInfo}
					message={this.state.showSharesInfo}
					autoHideDuration={4000}
					onRequestClose={this.handleRequestClose.bind(this)}
				/>
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