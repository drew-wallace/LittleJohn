import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import moment from 'moment';

import { RaisedButton, Divider, List, ListItem, FlatButton } from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardText} from 'material-ui/Card';

import RobinhoodChartComponent from './robinhood-chart';

import { formatCurrency, formatCurrencyDiff, formatPercentDiff } from '../lib/formaters';

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

	handleMoreNews() {
		this.props.initTitle(`${this.props.stock.instrument.symbol} News`, {symbol: this.props.stock.instrument.symbol, stockType: 'news', hasBackButton: true});
	}

    render() {
		// if(this.props.stock.lastUpdated) {
			const { changePrimaryColor, primaryColor, stockType } = this.props;
			const { historicals, quote, instrument } = this.props.stock;
			const { buying_power } = this.props.account.accountData;

			const news = this.props.stock.news.slice(0, 3);

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
							<CardText>
								<div style={{display: 'flex', flexDirection: 'column'}}>
									<div style={{flex: '0 1 30%', display: 'flex', padding: '0px 0 0px'}}>
										<div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
											<span style={{flex: 1}}>{numeral(+quantity).format('0,0')}</span>
											<span style={{flex: 1}}>Shares</span>
										</div>
										<div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
											<span style={{flex: 1}}>{formatCurrency(+quote.last_trade_price * +quantity)}</span>
											<span style={{flex: 1}}>Equity Value</span>
										</div>
									</div>
									<Divider className="card-divider"/>
									<div style={{flex: '0 1 6%', display: 'flex', flexDirection: 'column'}}>
										<div style={{flex: 1, display: 'flex'}}>
											<span style={{flex: 1}}>Average Cost</span>
											<span style={{flex: 1}}>{formatCurrency(+average_buy_price)}</span>
										</div>
										<div style={{flex: 1, display: 'flex'}}>
											<span style={{flex: 1}}>Total Return</span>
											<span style={{flex: 1}}>{'Ignore this for now'/*`${formatCurrencyDiff((+quote.last_trade_price - +historicals.all[0].open_price) * +quantity)} (${formatPercentDiff((+quote.last_trade_price - +historicals.all[0].open_price) / +historicals.all[0].open_price)})`*/}</span>
										</div>
										<div style={{flex: 1, display: 'flex'}}>
											<span style={{flex: 1}}>Today's Return</span>
											<span style={{flex: 1}}>{`${formatCurrencyDiff((+quote.last_trade_price - +historicals.day[0].open_price) * +quantity)} (${formatPercentDiff((+quote.last_trade_price - +historicals.day[0].open_price) / +historicals.day[0].open_price)})`}</span>
										</div>
									</div>
								</div>
							</CardText>
						</Card>
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
						<CardText>
							<div style={{display: 'flex', flexDirection: 'column'}}>
								<div style={{flex: 1, display: 'flex'}}>
									<span style={{flex: 1}}>Volatility</span>
									<span style={{flex: 1}}>{(+instrument.maintenance_ratio < 0.5 ? 'Low' : 'High')}</span>
								</div>
								<div style={{flex: 1, display: 'flex'}}>
									<span style={{flex: 1}}>Buying Power</span>
									<span style={{flex: 1}}>{formatCurrency(+buying_power)}</span>
								</div>
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