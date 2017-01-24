import React, { Component } from 'react';

import { MuiThemeProvider, Drawer, AppBar, MenuItem} from 'material-ui'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import PorfolioPane from '../containers/portfolio-pane';

class AppLayout extends Component {

	constructor(props){
		super(props);
		console.log(props);
		// darkBaseTheme.palette.primary1Color = `#${this.props.cssColorString}`;
		// darkBaseTheme.palette.primary2Color = `#${this.props.cssColorString}`;
		darkBaseTheme.palette.primary1Color = '#6DAD62';
		darkBaseTheme.palette.primary2Color = '#6DAD62';
		// darkBaseTheme.palette.primary1Color = '#E34234';
		// darkBaseTheme.palette.primary2Color = '#E34234';
		this.muiTheme = getMuiTheme(darkBaseTheme);
	}

	handleToggle() {
		this.props.toggleMenu(!this.props.open);
	}

	changeTitle(title) {
		this.props.toggleMenu(false);
		this.props.changeTitle(title);
		if(title == 'Portfolio') {
			this.props.changeFixedTitle(this.props.portfolio.equity)
		} else {
			this.props.changeFixedTitle(title);
		}
	}

	handleClose() {
		this.props.toggleMenu(false);
	}

    render() {
		let titleBar = (
			<div style={{height: 55}}></div>
		);

		if(this.props.title == 'Portfolio') {
			titleBar = (
				<AppBar
					title={this.props.title}
					onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
					style={{height: 130, paddingTop: 75, marginTop: -75}}
					iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
					titleStyle={{alignSelf: 'center'}}
				/>
			);
		}

        return (
			<MuiThemeProvider muiTheme={this.muiTheme}>
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
						title={this.props.fixedTitle}
						onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
						style={{height: 55}}
						iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
						titleStyle={{alignSelf: 'center'}}
					/>
					<div ref="test" onTouchMove={(e) => {console.log("TEST"); e.preventDefault();}} className="scrollable-pane-content">
						{titleBar}
						<PorfolioPane robinhood={this.props.robinhood}/>
					</div>
	            </div>
            </MuiThemeProvider>
        );
    }
}

export default AppLayout;