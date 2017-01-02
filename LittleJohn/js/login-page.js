import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TextInput, Button } from 'react-desktop/windows';
import NavPane from './nav-pane';
import Robinhood from './robinhood';
import env from '../env';

export default class extends Component {
  	constructor(props) {
		super(props);
		let sessionState = WinJS.Application.sessionState;
		this.robinhood = sessionState.robinhood || new Robinhood();
		this.state = {
			loggedIn: this.robinhood.isLoggedIn()
		};
	}

  	render() {
		if(this.state.loggedIn) {
			return (
				<NavPane color={`#${this.props.cssColorString}`}/>
			);
		} else {
			return (
				<div style={{flex: 1, alignItems: 'center'}}>
					<TextInput placeholder="Username" onChange={(e) => this.username = e.target.value}/>
					<TextInput placeholder="Password" type="password" onChange={(e) => this.password = e.target.value}/>
					<Button color={`#${this.props.cssColorString}`} onClick={this.submit.bind(this)}>Login</Button>
				</div>
			);
		}
  	}

	submit(){
			const username = env.username || this.username;
			const password = env.password || this.password;
			const loggedIn = this.robinhood.login(username, password);

			loggedIn.then(function() {
				let sessionState = WinJS.Application.sessionState;
				sessionState.robinhood = this.robinhood;
				this.setState({loggedIn: this.robinhood.isLoggedIn()});
			}.bind(this)).catch(function(error) {
				// show some error message for a failed login
				console.error(error);
			}.bind(this));
	}
}