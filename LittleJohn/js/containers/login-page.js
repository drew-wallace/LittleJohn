import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TextInput, Button } from 'react-desktop/windows';
import AppLayout from './app-layout';
import Robinhood from '../robinhood';
import env from '../../env';

export default class extends Component {
  	constructor(props) {
		super(props);
		this.app = this.props.app;
		let sessionState = this.app.sessionState;
		this.robinhood = new Robinhood(env.robinhoodSession || sessionState.robinhoodSession);
		this.state = {
			loggedIn: this.robinhood.isLoggedIn()
		};
	}

  	render() {
		if(this.state.loggedIn) {
			return (
				<AppLayout cssColorString={`#${this.props.cssColorString}`} robinhood={this.robinhood}/>
			);
		} else {
			return (
				<div style={{backgroundColor: '#6DAD62', position: 'absolute', display: 'flex', height: '100%', width: '100%'}}>
					<div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%', flex: 1, margin: 'auto 0'}}>
						<TextInput placeholder="Username" onChange={(e) => this.username = e.target.value}/>
						<TextInput placeholder="Password" type="password" onChange={(e) => this.password = e.target.value}/>
						<Button color={`#${this.props.cssColorString}`} onClick={this.submit.bind(this)}>Login</Button>
					</div>
				</div>
			);
		}
  	}

	submit(){
		const username = env.username || this.username;
		const password = env.password || this.password;
		const loggedIn = this.robinhood.login(username, password);

		loggedIn.then(function() {
			let sessionState = this.app.sessionState;
			sessionState.robinhoodSession = this.robinhood.getSession();
			this.setState({loggedIn: this.robinhood.isLoggedIn()});
		}.bind(this)).catch(function(error) {
			// show some error message for a failed login
			console.error(error);
		}.bind(this));
	}
}