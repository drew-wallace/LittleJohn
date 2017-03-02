import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';

import { RaisedButton, Divider, List, ListItem, FlatButton } from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardText} from 'material-ui/Card';
import Truncate from 'react-truncate';

import RobinhoodChartComponent from './robinhood-chart';

import { formatCurrency, formatCurrencyDiff, formatPercentDiff, formatNumberBig, formatCurrencyBig } from '../lib/formaters';
import value_equals from '../lib/value_equals';

class PositionPaneComponent extends Component {
	constructor(props) {
	    super(props);

		this.state = {
			descriptionExpanded: false,
			showMoreDescription: false
		};
	}

	handleSell() {
		this.props.selectedOrderSide('Market Sell', {symbol: this.props.stock.instrument.symbol, stockType: 'sell', hasBackButton: true});
	}

	handleBuy() {
		this.props.selectedOrderSide('Market Buy', {symbol: this.props.stock.instrument.symbol, stockType: 'buy', hasBackButton: true});
	}

	handleMoreNews() {
		this.props.initTitle(`${this.props.stock.instrument.symbol} News`, {symbol: this.props.stock.instrument.symbol, stockType: 'news', hasBackButton: true});
	}

	handleDescriptionExpanded() {
		this.setState({
			descriptionExpanded: !this.state.descriptionExpanded
		});
	}

	handleShowMoreDescription(isTruncated) {
		if(isTruncated && !this.state.showMoreDescription) {
			this.setState({
				showMoreDescription: true
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.descriptionExpanded !== this.state.descriptionExpanded || nextState.showMoreDescription !== this.state.showMoreDescription || !value_equals(nextProps, this.props);
	}

    render() {
		// if(this.props.stock.lastUpdated) {
			const { changePrimaryColor, primaryColor, stockType } = this.props;
			const { historicals, quote, instrument, fundamentals, orders } = this.props.stock;
			const { buying_power } = this.props.account.accountData;
			const news = this.props.stock.news.slice(0, Math.min(this.props.stock.news.length, 3));
			let yourPosition = (<div></div>);
			let sellButton = (<div></div>);
			let buyButton = (
				<RaisedButton
					label="BUY"
					primary={true}
					style={{flex: 1}}
					onTouchTap={() => this.handleBuy()}
				/>
			);
			let recentTransactions = (<div></div>);
			let description = fundamentals.description;
			let moreDescription = (<div></div>);

			if(stockType == 'position') {
				let { quantity, average_buy_price } = this.props.stock;
				sellButton = (
					<RaisedButton
						label="SELL"
						primary={true}
						style={{flex: '0 0 49%'}}
						onTouchTap={() => this.handleSell()}
					/>
				);
				buyButton = (
					<RaisedButton
						label="BUY"
						primary={true}
						style={{flex: '0 0 49%'}}
						onTouchTap={() => this.handleBuy()}
					/>
				);
				yourPosition = (
					<div>
						<div style={{marginBottom: 15}}><span>Your Position</span></div>
						<Card style={{marginBottom: 15}}>
							<CardText style={{padding: 0}}>
								<div style={{display: 'flex'}}>
									<List style={{flex: 1, padding: 0}}>
										<ListItem
											primaryText={formatNumberBig(+quantity)}
											secondaryText="Shares"
											disabled={true}
										/>
										<Divider/>
										<ListItem
											primaryText="Average Cost"
											disabled={true}
										/>
										<ListItem
											primaryText="Total Return"
											disabled={true}
										/>
										<ListItem
											primaryText="Today's Return"
											disabled={true}
										/>
									</List>
									<List style={{flex: 1, padding: 0}}>
										<ListItem
											primaryText={formatCurrency(+quote.last_trade_price * +quantity)}
											secondaryText="Equity Value"
											disabled={true}
										/>
										<Divider/>
										<ListItem
											primaryText={formatCurrency(+average_buy_price)}
											disabled={true}
										/>
										<ListItem
											primaryText={'Ignore this for now'/*`${formatCurrencyDiff((+quote.last_trade_price - +historicals.all[0].open_price) * +quantity)} (${formatPercentDiff((+quote.last_trade_price - +historicals.all[0].open_price) / +historicals.all[0].open_price)})`*/}
											disabled={true}
										/>
										<ListItem
											primaryText={`${formatCurrencyDiff((+quote.last_trade_price - +historicals.day[0].open_price) * +quantity)} (${formatPercentDiff((+quote.last_trade_price - +historicals.day[0].open_price) / +historicals.day[0].open_price)})`}
											disabled={true}
										/>
									</List>
								</div>
							</CardText>
						</Card>
					</div>
				);
			}

			if(orders && orders.length > 0) {
				const lessOrders = orders.slice(0, Math.min(orders.length, 4));
				recentTransactions = (
					<div>
						<div style={{marginBottom: 15}}><span>Recent Transactions</span></div>
						<Card style={{marginBottom: 15}} containerStyle={{padding: 0}}>
							<CardText style={{padding: 0}}>
								<List style={{padding: 0}}>
									{lessOrders.map((order, index) => {
										let status = order.state;
										if(status == 'filled') {
											status = formatCurrency(+order.price * +order.quantity);
										} else {
											status = _.capitalize(status);
										}

										return (
											<div key={index}>
												<ListItem
													innerDivStyle={{display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap'}}
													primaryText={(<span style={{flex: '0 1 50%'}}>{moment(order.updated_at).format('MMM DD, YYYY')}</span>)}
													secondaryText={(<span style={{flex: '0 1 100%'}}>{`${_.capitalize(order.type)} ${_.capitalize(order.side)}`}</span>)}
													onTouchTap={() => console.log(order.id)}
												>
													<div style={{flex: '0 1 50%', display: 'flex', justifyContent: 'flex-end'}}>
														<span style={{position: 'relative', top: '50%'}}>{status}</span>
													</div>
												</ListItem>
											</div>
										);
									})}
								</List>
							</CardText>
						</Card>
					</div>
				);
			}

			if(!this.state.descriptionExpanded) {
				description = (
					<div className="stock-description-container">
						<div>
							<Truncate
								ref="description"
								onTruncate={(isTruncated) => this.handleShowMoreDescription(isTruncated)}
								lines={7}
							>
								{description}
							</Truncate>
						</div>
					</div>
				);
			}

			if(this.state.showMoreDescription) {
				moreDescription = (
					<div>
						<Divider />
						<ListItem
							innerDivStyle={{display: 'flex', justifyContent: 'flex-end'}}
							primaryText={(<FlatButton label={(this.state.descriptionExpanded ? "LESS" : "MORE")} primary={true} onTouchTap={() => this.handleDescriptionExpanded()} style={{flex: 0}}/>)}
							disabled={true}
						/>
					</div>
				);
			}

			return (
				<div>
					<RobinhoodChartComponent
						title={+quote.last_trade_price}
						margin={{top: 0, right: 0, bottom: 0, left: 0}}
						data={historicals}
						changePrimaryColor={changePrimaryColor}
					/>
					<div style={{display: 'flex', justifyContent: 'space-around', marginBottom: 15}}>
						{sellButton}
						{buyButton}
					</div>
					{yourPosition}
					<div style={{marginBottom: 15}}><span>Volatitlity</span></div>
					<Card style={{marginBottom: 15}}>
						<CardText style={{padding: 0}}>
							<div style={{display: 'flex'}}>
								<List style={{flex: 1, padding: 0}}>
									<ListItem
										primaryText="Volatility"
										disabled={true}
									/>
									<ListItem
										primaryText="Buying Power"
										disabled={true}
									/>
								</List>
								<List style={{flex: 1, padding: 0}}>
									<ListItem
										primaryText={(+instrument.maintenance_ratio < 0.5 ? 'Low' : 'High')}
										disabled={true}
									/>
									<ListItem
										primaryText={formatCurrency(+buying_power)}
										disabled={true}
									/>
								</List>
							</div>
						</CardText>
					</Card>
					<div style={{marginBottom: 15}}><span>Recent News</span></div>
					<Card style={{marginBottom: 15}} containerStyle={{padding: 0}}>
						<CardText style={{padding: 0}}>
							<List style={{padding: 0}}>
								{news.map((article, index) => (
									<div key={index}>
										<ListItem
											primaryText={article.title}
											secondaryText={moment(article.published_at).format('MMM DD, YYYY')}
											onTouchTap={() => window.location = article.url}
										/>
										<Divider />
									</div>
								))}
								<ListItem
									innerDivStyle={{display: 'flex', justifyContent: 'flex-end'}}
									primaryText={(<FlatButton label="MORE" primary={true} onTouchTap={() => this.handleMoreNews()} style={{flex: 0}}/>)}
									disabled={true}
								/>
							</List>
						</CardText>
					</Card>
					<div style={{marginBottom: 15}}><span>Statistics</span></div>
					<Card style={{marginBottom: 15}}>
						<CardText>
							<div style={{display: 'flex'}}>
								<List style={{flex: 1, padding: 0}}>
									<ListItem
										primaryText={formatCurrency(+fundamentals.open)}
										secondaryText="Open"
										disabled={true}
									/>
									<ListItem
										primaryText={formatCurrency(+fundamentals.high)}
										secondaryText="Today's High"
										disabled={true}
									/>
									<ListItem
										primaryText={formatCurrency(+fundamentals.low)}
										secondaryText="Today's Low"
										disabled={true}
									/>
									<ListItem
										primaryText={formatCurrency(+fundamentals.high_52_weeks)}
										secondaryText="52 Wk High"
										disabled={true}
									/>
									<ListItem
										primaryText={formatCurrency(+fundamentals.low_52_weeks)}
										secondaryText="52 Wk Low"
										disabled={true}
									/>
								</List>
								<List style={{flex: 1, padding: 0}}>
									<ListItem
										primaryText={formatNumberBig(+fundamentals.volume)}
										secondaryText="Volume"
										disabled={true}
									/>
									<ListItem
										primaryText={formatNumberBig(+fundamentals.average_volume)}
										secondaryText="Average Volume"
										disabled={true}
									/>
									<ListItem
										primaryText={formatCurrencyBig(+fundamentals.market_cap)}
										secondaryText="Market Cap"
										disabled={true}
									/>
									<ListItem
										primaryText={(fundamentals.pe_ratio ? formatNumberBig(+fundamentals.pe_ratio) : 'N/A')}
										secondaryText="P/E Ratio"
										disabled={true}
									/>
									<ListItem
										primaryText={(fundamentals.dividend_yield ? formatNumberBig(+fundamentals.dividend_yield) : 'N/A')}
										secondaryText="Div/Yield"
										disabled={true}
									/>
								</List>
							</div>
						</CardText>
					</Card>
					{recentTransactions}
					<div style={{marginBottom: 15}}><span>About</span></div>
					<Card style={{marginBottom: 15}} containerStyle={{padding: 0}}>
						<CardText style={{padding: 0}}>
							<List style={{padding: 0}}>
								<ListItem disabled={true}>
									{description}
								</ListItem>
								{moreDescription}
							</List>
						</CardText>
					</Card>
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