import React, { Component } from 'react';

import { MuiThemeProvider, Drawer, AppBar, MenuItem} from 'material-ui'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


class Menu extends Component {

	constructor(props){
		super(props);
		// darkBaseTheme.palette.primary1Color = `#${this.props.cssColorString}`;
		// darkBaseTheme.palette.primary2Color = `#${this.props.cssColorString}`;
		darkBaseTheme.palette.primary1Color = '#6DAD62';
		darkBaseTheme.palette.primary2Color = '#6DAD62';
		this.muiTheme = getMuiTheme(darkBaseTheme);
		this.state = {
			open: false,
			title: 'Portfolio'
		};
	}

	handleToggle() {
		this.setState({open: !this.state.open});
	}

	changeTitle(title) {
		this.setState({
			title,
			open: false
		});
	}

	handleClose() {
		this.setState({open: false});
	}

    render() {
		console.log(darkBaseTheme);
        return (
			<MuiThemeProvider muiTheme={this.muiTheme}>
	            <div>
	            	<Drawer
		              docked={false}
		              open={this.state.open}
					  onRequestChange={(open) => this.setState({open})}
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
							title="$200.89"
							onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
							style={{height: 55}}
							iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
							titleStyle={{alignSelf: 'center'}}
						/>
					<div className="scrollable-pane-content">
						<AppBar
							title={this.state.title}
							onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
							style={{height: 55}}
							iconStyleLeft={{marginBottom: 8, alignSelf: 'center'}}
							titleStyle={{alignSelf: 'center'}}
						/>
						<p>0</p>
						<p>1</p>
						<p>2</p>
						<p>3</p>
						<p>4</p>
						<p>5</p>
						<p>6</p>
						<p>7</p>
						<p>8</p>
						<p>9</p>
						<p>10</p>
						<p>11</p>
						<p>12</p>
						<p>13</p>
						<p>14</p>
						<p>15</p>
						<p>16</p>
						<p>17</p>
						<p>18</p>
						<p>19</p>
						<p>20</p>
						<p>21</p>
						<p>22</p>
						<p>23</p>
						<p>24</p>
						<p>25</p>
						<p>26</p>
						<p>27</p>
						<p>28</p>
						<p>29</p>
						<p>30</p>
						<p>31</p>
						<p>32</p>
						<p>33</p>
						<p>34</p>
						<p>35</p>
						<p>36</p>
						<p>37</p>
						<p>38</p>
						<p>39</p>
						<p>40</p>
						<p>41</p>
						<p>42</p>
						<p>43</p>
						<p>44</p>
						<p>45</p>
						<p>46</p>
						<p>47</p>
					</div>
	            </div>
            </MuiThemeProvider>
        );
    }
}

// Header.childContextTypes = {
// 	muiTheme: React.PropTypes.object.isRequired,
// };

export default Menu;