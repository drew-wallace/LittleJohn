import React, { Component } from 'react';
// import RaisedButton from 'material-ui/RaisedButton';
// import TextField from 'material-ui/TextField';

import { MuiThemeProvider, RaisedButton, TextField } from 'material-ui';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import env from '../../env';

import AppLayout from '../containers/app-layout';

class LoginPage extends Component {
  	constructor(props) {
		super(props);
	}

  	render() {
		darkBaseTheme.palette.primary1Color = this.props.primaryColor;
		darkBaseTheme.palette.primary2Color = this.props.primaryColor;

		const muiTheme = getMuiTheme(darkBaseTheme);

		if(this.props.robinhood.isLoggedIn()) {
			return (
				<MuiThemeProvider muiTheme={muiTheme}>
					<AppLayout/>
            	</MuiThemeProvider>
			);
		} else {
			return (
				<MuiThemeProvider muiTheme={muiTheme}>
					<div style={{position: 'absolute', display: 'flex', height: '100%', width: '100%'}}>
						<div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%', flex: 1, margin: 'auto 0'}}>
							<TextField
								floatingLabelText="Robinhood Username"
								onChange={(e, username) => this.username = username}
							/>
							<TextField
								floatingLabelText="Robinhood Password"
								type="password"
								onChange={(e, password) => this.password = password}
							/>
							<RaisedButton
								label="Login"
								primary={true}
								onTouchTap={this.submit.bind(this)}
								style={{marginTop: 14}}
							/>
						</div>
					</div>
            	</MuiThemeProvider>
			);
		}
  	}

	submit(){
		const username = env.username || this.username;
		const password = env.password || this.password;

		this.props.robinhood.login(username, password).then(function() {
			this.props.login();
		}.bind(this)).catch(function(error) {
			// show some error message for a failed login. errorText on inputs
			console.error(error);
		}.bind(this));
	}
}

export default LoginPage;