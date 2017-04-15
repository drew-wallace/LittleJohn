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

		this.state = {
			showSharesInfo: '',
			showPlaceOrderButton: false,
			value: '',
			showSwipeView: false
		};

		this.validNumberOfShares = 0;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !value_equals(nextState, this.state) || !value_equals(nextProps, this.props);
	}

	componentWillReceiveProps(newProps) {
		if(newProps.title.activePane == 'confirm order') {
			this.setState({
				showPlaceOrderButton: false,
				showSwipeView: true
			});
		} else {
			this.setState({
				showPlaceOrderButton: !!Number(this.validNumberOfShares),
				showSwipeView: false
			});
		}
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

	handleSwipe(e, elm) {
		let element = ReactDOM.findDOMNode(elm);
		element.style.transitionDuration = `0ms`;
		element.style.transform = `translate(0px,${e.deltaY}px)`;
		element.style.zIndex = '1100';
	}
	handleSwipeEnd(e, elm) {
		let { url, dismissCard, robinhood } = this.props;
		let element = ReactDOM.findDOMNode(elm);
		const height = element.offsetHeight;
		element.style.transitionDuration = `200ms`;
		element.style.transform = `translate(0px,${e.deltaY}px)`;
		if (e.deltaY < 0 && Math.abs(e.deltaY / height) >= 0.5) {
			this.props.placedOrder();
			// won't need this after action code is placed here
			// element.style.transform = `translate(0px,0px)`;
		} else {
			function fixOverlay() {
				element.style.zIndex = '0';
				element.removeEventListener('transitionend', fixOverlay);
			}
			element.addEventListener('transitionend', fixOverlay, false);
			element.style.transform = `translate(0px,0px)`;
		}
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
		// 	 (i) Shares of {symbol}                          0 <-- number input, fills to left
		//
		// 	 Market Price                                $1.03
		//   -------------------------------------------------
		//   Estimated Credit    {quantity} share(s) available <-- Becomes ${shares * Market price}

		return (
			<Hammer onPan={(e) => this.handleSwipe(e, this.refs.order)} onPanEnd={(e) => this.handleSwipeEnd(e, this.refs.order)} options={{recognizers: {pan: {enable: this.state.showSwipeView, direction: HammerJS.DIRECTION_VERTICAL}}}}>
				<div ref="order" style={(this.state.showSwipeView ? {display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', position: 'absolute', width: '100%', marginTop: -55} : {})}>
					<div style={(this.state.showSwipeView ? { margin: 15, backgroundColor: '#000000', position: 'relative', top: 55} : {})}>
						<List>
							<ListItem
								leftIcon={!this.state.showSwipeView && (<IconButton style={{paddingTop: 0}} onTouchTap={() => this.setState({ showSharesInfo: `You can ${(currentOrder.side == 'sell' ? 'sell' : 'afford')} ${formatNumberBig(shares)} share(s) of ${currentOrder.symbol}.`})}><InfoOutline/></IconButton>)}
								disabled={true}
								innerDivStyle={{ display: 'flex' }}
								primaryText={<div style={{flex: '0 1 50%', display: 'flex', alignItems: 'center', marginTop: 8}}>Shares of {currentOrder.symbol}</div>}
								secondaryText={
									<div style={{ flex: '0 1 50%', display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
										<TextField
											ref="sharesTextField"
											autoFocus={true}
											value={this.state.value}
											hintText="0"
											style={{height: 16, lineHeight: 16}}
											underlineShow={false}
											inputStyle={{textAlign: 'right'}}
											hintStyle={{textAlign: 'right', bottom: 0, width: '100%', height: 16}}
											disabled={this.state.showSwipeView}
											onChange={(e, newVal) => {
												const diff = this.diffStrings(newVal, this.state.value);
												if (diff === undefined || !isNaN(diff)) {
													newVal = this.toNumber(newVal);
													this.validNumberOfShares = +newVal;
													this.toggleNextButton();
												}
											}}
											onKeyDown={(e) => {
												if (!e.key.match(/^[0-9]$/) && this.refs.sharesTextField.input.value == '') {
													e.preventDefault();
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
								insetChildren={!this.state.showSwipeView}
							/>
							<Divider inset={!this.state.showSwipeView}/>
							<ListItem
								innerDivStyle={{ display: 'flex' }}
								primaryText={(<span style={{ flex: '0 1 50%', display: 'flex', alignItems: 'center' }}>Estimated {currentOrder.side == 'sell' ? 'Credit' : 'Cost'}</span>)}
								secondaryText={(<span style={{ flex: '0 1 50%', display: 'flex', justifyContent: 'flex-end' }}>{costOrCredit > 0 ? formatCurrency(costOrCredit) : sharesOrBuyingPower}</span>)}
								disabled={true}
								insetChildren={!this.state.showSwipeView}
							/>
						</List>
						<FloatingActionButton
							style={{ display: (this.state.showPlaceOrderButton ? 'inline-block' : 'none'), float: 'right' }}
							onTouchTap={() => confirmOrder(this.validNumberOfShares)}
						>
							<Check />
						</FloatingActionButton>
						<div style={{display: (this.state.showSwipeView ? 'block' : 'none'), padding: 15}}>
							You are placing a {time_in_force} {currentOrder.type} order to {currentOrder.side} {currentOrder.quantity} share(s) of {currentOrder.symbol}. Your pending order, if executed, will execute at {formatCurrency(price)} per share or better.
						</div>
						<Snackbar
							open={!!this.state.showSharesInfo}
							message={this.state.showSharesInfo}
							autoHideDuration={4000}
							onRequestClose={this.handleRequestClose.bind(this)}
						/>
					</div>
					<div style={{ display: (this.state.showSwipeView ? 'flex' : 'none'), flexDirection: 'column', paddingBottom: 30}}>
						<KeyboardArrowUp style={{margin: '0 auto'}}/>
						<span style={{margin: '0 auto'}}>Swipe up to trade</span>
					</div>
				</div>
			</Hammer>
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