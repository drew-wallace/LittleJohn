import React, { Component } from 'react';

import { Drawer, AppBar, MenuItem } from 'material-ui';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';

import PorfolioPane from '../containers/portfolio-pane';

class AppLayout extends Component {

	constructor(props){
		super(props);
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

    render() {
		let titleBar = (
			<div style={{height: 55}}></div>
		);

		if(this.props.title.present.floatingTitle == 'Portfolio') {
			titleBar = (
				<AppBar
					title={this.props.title.present.floatingTitle}
					onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
					style={{height: 130, paddingTop: 75, marginTop: -75}}
					iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
					titleStyle={{alignSelf: 'center'}}
				/>
			);
		}

		let iconElementLeft = null;
		let iconElementRight = null;
		let onLeftIconButtonTouchTap = this.handleToggle.bind(this);

		if(this.props.title.present.hasBackButton) {
			iconElementLeft = (<ArrowBack/>);
			onLeftIconButtonTouchTap = this.handleBack.bind(this);
		}

		if(this.props.title.present.isStock) {
			if(this.props.title.present.isWatchList) {
				iconElementRight = (<AddCircleOutline/>);
			} else {
				iconElementRight = (<RemoveCircleOutline/>);
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
				<div className="scrollable-pane-content">
					{titleBar}
					<PorfolioPane robinhood={this.props.robinhood}/>
				</div>
			</div>
        );
    }
}

export default AppLayout;