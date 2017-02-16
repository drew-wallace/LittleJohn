import React, { Component } from 'react';
import _ from 'lodash';

import { Drawer, AppBar, MenuItem, IconButton, IconMenu, RadioButtonGroup, RadioButton, FlatButton } from 'material-ui';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import Search from 'material-ui/svg-icons/action/search';

import PorfolioPane from '../containers/portfolio-pane';
import PositionPane from '../containers/position-pane';
import WatchlistPane from '../containers/watchlist-pane';

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

	changeTitle(title) {
		this.props.toggleMenu(false);
		if(title == 'Portfolio') {
			this.props.changeTitle(this.props.portfolio.equity, title);
		} else {
			this.props.changeTitle(title, '');
		}
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

	changeTab(tab, isPosition, dayData) {
		if(tab != this.props.title.present.fixedTitle) {
			this.props.changeTitleFromTab(tab, '', false, isPosition, !isPosition);
        	this.props.changePrimaryColor(+_.last(dayData).adjusted_open_equity >= +dayData[0].adjusted_open_equity ? positivePrimaryColor : negativePrimaryColor);
		}
	}

    render() {
		let iconElementLeft = null;
		let iconElementRight = null;
		let onLeftIconButtonTouchTap = this.handleToggle.bind(this);
		let pane = (<div>If you're seeing this, I messed something up...</div>)

		if(this.props.title.present.hasBackButton) {
			iconElementLeft = (
				<IconButton>
					<ArrowBack/>
				</IconButton>
			);
			onLeftIconButtonTouchTap = this.handleBack.bind(this);
		}

		if(this.props.title.present.isStock) {
			if(this.props.title.present.isWatchlist) {
				iconElementRight = (
					<IconButton>
						<AddCircleOutline/>
					</IconButton>
				);
			} else {
				iconElementRight = (
					<IconButton>
						<RemoveCircleOutline/>
					</IconButton>
				);
			}
		}

		let titleBar = (
			<div style={{height: 55}}></div>
		);

		let watchlistBar = (<div></div>);

		switch(this.props.title.present.floatingTitle) {
			case 'Portfolio':
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
						title={this.props.title.present.floatingTitle}
						titleStyle={{alignSelf: 'center'}}
						onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
						iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
						iconElementRight={iconElementRight}
						iconStyleRight={{marginBottom: 8, alignSelf: 'center'}}
						style={{height: 130, paddingTop: 75, marginTop: -75}}
					/>
				);
				pane = (<PorfolioPane/>);
				break;
		}

		if(this.props.title.present.isStock) {

		} else if(this.props.title.present.isPosition) {
			pane = (<PositionPane/>);
			watchlistBar = (
				<div style={{display: 'flex', zIndex: 1100, backgroundColor: this.props.primaryColor, position: 'relative'}}>
				{_.map(_.extend({}, this.props.watchlist.items, this.props.positions.items), (stock, i) => (
					<FlatButton
						key={i}
						onTouchTap={() => this.changeTab(stock.instrument.name, +stock.quantity > 0, stock.historicals.day)}
						label={stock.instrument.symbol}
						labelStyle={{color: 'white'}}
						className={`chart-button ${(this.props.title.present.fixedTitle == stock.instrument.name ? 'active' : '')}`}
						style={{flex: 1, minWidth: 0}}
					/>
				))}
				</div>
			);
			titleBar = (
				<div style={{height: 91}}></div>
			);
		} else if(this.props.title.present.isWatchlist) {
			pane = (<WatchlistPane/>);
			watchlistBar = (
				<div style={{display: 'flex', zIndex: 1100, backgroundColor: this.props.primaryColor, position: 'relative'}}>
				{_.map(_.extend({}, this.props.watchlist.items, this.props.positions.items), (stock, i) => (
					<FlatButton
						key={i}
						onTouchTap={() => this.changeTab(stock.instrument.name, +stock.quantity > 0, stock.historicals.day)}
						label={stock.instrument.symbol}
						labelStyle={{color: 'white'}}
						className={`chart-button ${(this.props.title.present.fixedTitle == stock.instrument.name ? 'active' : '')}`}
						style={{flex: 1, minWidth: 0}}
					/>
				))}
				</div>
			);
			titleBar = (
				<div style={{height: 91}}></div>
			);
		}

        return (
			<div>
				<Drawer
					docked={false}
					open={this.props.menu}
					onRequestChange={(open) => this.props.toggleMenu(open)}
					width={280}
				>
					<MenuItem onTouchTap={() => this.changeTitle('Account')} style={{height: 165}}>
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
									<span style={{flex: 1, fontSize: 22, lineHeight: 'normal'}}>$0.09</span>
									<span style={{flex: 1, fontSize: 14, lineHeight: 'normal'}}>Buying Power</span>
								</div>
							</div>
						</div>
					</MenuItem>
					<MenuItem onTouchTap={() => this.changeTitle('Portfolio')}>Portfolio</MenuItem>
					<MenuItem onTouchTap={() => this.changeTitle('Account')}>Account</MenuItem>
					<MenuItem onTouchTap={() => this.changeTitle('Banking')}>Banking</MenuItem>
					<MenuItem onTouchTap={() => this.changeTitle('History')}>History</MenuItem>
					<MenuItem onTouchTap={() => this.changeTitle('Settings')}>Settings</MenuItem>
					<MenuItem onTouchTap={() => this.changeTitle('Refer friends')}>Refer friends</MenuItem>
					<MenuItem onTouchTap={() => this.changeTitle('Help')}>Help</MenuItem>
				</Drawer>
				<AppBar
					title={this.props.title.present.fixedTitle}
					titleStyle={{alignSelf: 'center'}}
					iconElementLeft={iconElementLeft}
					iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
					onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
					iconElementRight={iconElementRight}
					iconStyleRight={{marginBottom: 8, alignSelf: 'center'}}
					style={{height: 55}}
				/>
				{watchlistBar}
				<div className="scrollable-pane-content">
					{titleBar}
					{pane}
				</div>
			</div>
        );
    }
}

export default AppLayout;