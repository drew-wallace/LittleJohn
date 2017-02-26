import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';

import { Drawer, AppBar, MenuItem, IconButton, IconMenu, RadioButtonGroup, RadioButton, FlatButton, List, ListItem, Divider } from 'material-ui';
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import Search from 'material-ui/svg-icons/action/search';

import PorfolioPaneContainer from '../containers/portfolio-pane';
import StockPaneContainer from '../containers/stock-pane';

import { formatCurrency } from '../lib/formaters';
import value_equals from '../lib/value_equals';
import styles from '../styles';

const { positivePrimaryColor, negativePrimaryColor } = styles;

class AppLayout extends Component {

	constructor(props){
		super(props);
		this.state = {
			moreOpen: false
		};
	}

	handleToggle() {
		this.props.toggleMenu(!this.props.open);
	}

	handleMenuSelect(title, options) {
		this.props.toggleMenu(false);
		this.props.changeTitle(title, options);
	}

	handleClose() {
		this.props.toggleMenu(false);
	}

	handleBack() {
		this.props.undoTitle();
	}

	handleDisplayedValue(value) {
		this.props.changeDisplayedValue(value);
		this.setState({
			moreOpen: false
		});
	}

	toggleMoreMenu(open) {
		this.setState({
			moreOpen: open
		});
	}

	changeTab(stock) {
		const tab = stock.instrument.name;
		const stockType = (+stock.quantity > 0 ? 'position' : 'watchlist');
		const dayData = stock.historicals.day;
		const symbol = stock.instrument.symbol;

		if(tab != this.props.title.present.fixedTitle) {
			this.props.changeTitleFromTab(tab, {stockType, symbol, hasBackButton: true});
        	this.props.changePrimaryColor(+_.last(dayData).adjusted_open_equity >= +dayData[0].adjusted_open_equity ? positivePrimaryColor : negativePrimaryColor);
		}
	}

	componentDidUpdate() {
		let element = ReactDOM.findDOMNode(this.refs.scrollableView);
		element.scrollTop = 0;
	}

	componentWillMount() {
		if(!this.props.account.lastUpdated) {
			this.props.fetchAccountIfNeeded();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.moreOpen !== this.state.moreOpen || !value_equals(nextProps, this.props);
	}

    render() {
		const { account, primaryColor } = this.props;

		if(account.lastUpdated) {
			const { changeTitle, portfolio, title, watchlist, positions } = this.props;
			let iconElementLeft = null;
			let iconElementRight = null;
			let onLeftIconButtonTouchTap = this.handleToggle.bind(this);
			let pane = (<div>If you're seeing this, I messed something up...</div>);
			let titleBar = (<div style={{height: 55, backgroundColor: primaryColor}}></div>);
			let watchlistBar = (<div></div>);
			const watchlistItems = _.extend({}, watchlist.items, positions.items);
			let { buying_power } = this.props.account.accountData;

			if(title.present.hasBackButton) {
				iconElementLeft = (
					<IconButton>
						<ArrowBack/>
					</IconButton>
				);
				onLeftIconButtonTouchTap = () => this.handleBack();
			}

			switch(title.present.stockType) {
				case 'position':
					iconElementRight = null;
					// pane = (<PositionPaneContainer/>);
					pane = (<StockPaneContainer/>);
				case 'watchlist':
					if(title.present.stockType == 'watchlist') {
						iconElementRight = (
							<IconButton>
								<RemoveCircleOutline/>
							</IconButton>
						);
						// pane = (<WatchlistPaneContainer/>);
						pane = (<StockPaneContainer/>);
					}
					titleBar = (<div style={{height: 103, backgroundColor: primaryColor}}></div>);
					watchlistBar = (
						<div style={{display: 'flex', zIndex: 1100, backgroundColor: primaryColor, position: 'relative'}}>
							<Tabs
								value={title.present.fixedTitle}
								style={{width: '100%'}}
								inkBarStyle={{backgroundColor: 'white'}}
							>
								{_.map(watchlistItems, (stock, i) => (
									<Tab
										key={i}
										value={stock.instrument.name}
										onActive={() => this.changeTab(stock)}
										label={stock.instrument.symbol}
										className={`watchlist-button ${(title.present.symbol == stock.instrument.symbol ? 'active' : '')}`}
									/>
								))}
							</Tabs>
						</div>
					);
					break;
				case 'stock':
					iconElementRight = (
						<IconButton>
							<AddCircleOutline/>
						</IconButton>
					);
					pane = (<StockPaneContainer/>);
					break;
				case 'news':
					pane = (
						<List style={{padding: 0}}>
							{watchlistItems[title.present.symbol].news.map((article, index) => (
								<div key={index}>
									<ListItem
										primaryText={article.title}
										secondaryText={moment(article.published_at).format('MMM DD, YYYY')}
										onTouchTap={() => window.location = article.url}
									/>
									<Divider />
								</div>
							))}
						</List>
					);
					break;
				case 'sell':
					// <- Market Sell                        [Order Types]
					// 	 (i) Shares of {symbol}                          0 <-- number input, fills to left
					//
					// 	 Market Price                                $1.03
					//   -------------------------------------------------
					//   Estimated Credit    {quantity} share(s) available <-- Becomes ${shares * Market price}
					break;
				case 'order':
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

					// 	sub: Total Notional
					// 	Queued, Canceled, Placed, ...

					// 	button: Cancel Order
					break;
			}

			if(!title.present.stockType) {
				switch(title.present.fixedTitle) {
					// FIX: put make `sell` a stockType and this is the result
					case 'Market Sell':
						iconElementRight = (<FlatButton label="ORDER TYPES" onTouchTap={() => this.props.changeTitle('Order Types', {hasBackButton: true})} style={{marginTop: 0}}/>);
						pane = (<PorfolioPaneContainer/>);
						break;
					default:
						if(title.present.floatingTitle == 'Portfolio') {
							iconElementRight = (
								<div style={{display: 'flex'}}>
									<IconButton onTouchTap={() => console.log('Searching here')} style={{flex: 1}}>
										<Search/>
									</IconButton>
									<IconMenu
										iconButtonElement={<IconButton><MoreVert/></IconButton>}
										open={this.state.moreOpen}
										useLayerForClickAway={true}
										onRequestChange={(open) => this.toggleMoreMenu(open)}
										anchorOrigin={{horizontal: 'right', vertical: 'top'}}
										targetOrigin={{horizontal: 'right', vertical: 'top'}}
										listStyle={{paddingLeft: 8, width: 165}}
										style={{flex: 1}}
									>
										<RadioButtonGroup
											name="stockValueDisplay"
											labelPosition="left"
											defaultSelected="price"
											valueSelected={this.props.settings.displayedValue}
											onChange={(e, value) => this.handleDisplayedValue(value)}
										>
											<RadioButton
												value="price"
												label="Last Price"
												style={{paddingTop: 8, paddingBottom: 8}}
											/>
											<RadioButton
												value="equity"
												label="Equity"
												style={{paddingTop: 8, paddingBottom: 8}}
											/>
											<RadioButton
												value="percent"
												label="Percent Change"
												style={{paddingTop: 8, paddingBottom: 8}}
											/>
										</RadioButtonGroup>
									</IconMenu>
								</div>
							);
							titleBar = (
								<AppBar
									title={title.present.floatingTitle}
									titleStyle={{alignSelf: 'center'}}
									onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
									iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
									iconElementRight={iconElementRight}
									iconStyleRight={{marginBottom: 8, alignSelf: 'center'}}
									style={{height: 130, paddingTop: 75, marginTop: -75}}
								/>
							);
							pane = (<PorfolioPaneContainer/>);
						}
				}
			}
			return (
				<div>
					<Drawer
						docked={false}
						open={this.props.menu}
						onRequestChange={(open) => this.props.toggleMenu(open)}
						width={280}
					>
						<MenuItem onTouchTap={() => this.handleMenuSelect('Account')} style={{height: 165}}>
							<div style={{height: 165, flex: 1, display: 'flex', flexDirection: 'column'}}>
								<div style={{flex: 1, display: 'flex', alignItems: 'flex-end'}}>
									<span style={{fontSize: 14, lineHeight: 'normal'}}>Drew Wallace</span>
								</div>
								<div style={{flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: 20}}>
									<div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
										<span style={{flex: 1, fontSize: 22, lineHeight: 'normal'}}>$235.60</span>
										<span style={{flex: 1, fontSize: 14, lineHeight: 'normal'}}>Portfolio Value</span>
									</div>
									<div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
										<span style={{flex: 1, fontSize: 22, lineHeight: 'normal'}}>{formatCurrency(+buying_power)}</span>
										<span style={{flex: 1, fontSize: 14, lineHeight: 'normal'}}>Buying Power</span>
									</div>
								</div>
							</div>
						</MenuItem>
						<MenuItem onTouchTap={() => this.handleMenuSelect(portfolio.equity, {floatingTitle: 'Portfolio'})}>Portfolio</MenuItem>
						<MenuItem onTouchTap={() => this.handleMenuSelect('Account')}>Account</MenuItem>
						<MenuItem onTouchTap={() => this.handleMenuSelect('Banking')}>Banking</MenuItem>
						<MenuItem onTouchTap={() => this.handleMenuSelect('History')}>History</MenuItem>
						<MenuItem onTouchTap={() => this.handleMenuSelect('Settings')}>Settings</MenuItem>
						<MenuItem onTouchTap={() => this.handleMenuSelect('Refer friends')}>Refer friends</MenuItem>
						<MenuItem onTouchTap={() => this.handleMenuSelect('Help')}>Help</MenuItem>
					</Drawer>
					<AppBar
						title={title.present.fixedTitle}
						titleStyle={{alignSelf: 'center'}}
						iconElementLeft={iconElementLeft}
						iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
						onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
						iconElementRight={iconElementRight}
						iconStyleRight={{marginBottom: 8, alignSelf: 'center'}}
						style={{height: 55}}
					/>
					{watchlistBar}
					<div ref="scrollableView" className="scrollable-pane-content">
						{titleBar}
						{pane}
					</div>
				</div>
			);
		} else {
			return (
				<div style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', position: 'absolute', marginTop: -75}}>
					<CircularProgress size={80} thickness={5} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
				</div>
			);
		}
    }
}

export default AppLayout;