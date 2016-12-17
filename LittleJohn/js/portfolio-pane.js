import React, { Component } from 'react';
import Alphabet from './Alphabet';
import FancyText from './FancyText';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import { MuiThemeProvider } from 'material-ui';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const styles = {
	headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class PortfolioPane extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      value: '1D',
	      text: ''
	    };
	  }

	handleChange = (value) => {
		this.setState({
			value: value,
		});
	};

    changeText(event) {
        this.setState({text: event.target.value});
    }

    render() {

        return (
        	<MuiThemeProvider>
	        	<Card>
				    <CardText>
			        	<Tabs
					        value={this.state.value}
					        onChange={this.handleChange}
					    >
					        <Tab label="1D" value="1D" >
					        	<h2>Animated typing built with React and d3js v4 transitions</h2>
				                <p>Inspired by Bostock's block <a href="https://bl.ocks.org/mbostock/a8a5baa4c4a470cda598">General Update Pattern 4.0</a></p>
				                <input type="text" value={this.state.text}
				                       onChange={this.changeText.bind(this)} placeholder="Type here"
				                       style={{padding: '.6em',
				                               fontSize: '1.2em',
				                               margin: '0px auto',
				                               width: '80%'}}/>
				                <svg width="100%" height="300">
									<FancyText x="32" y="150" text={this.state.text} />
				                </svg>
					        </Tab>
					        <Tab label="1M" value="1M">
					          	<div>
					            	<h2 style={styles.headline}>Controllable Tab B</h2>
					            	<p>
					            		This is another example of a controllable tab. Remember, if you
					            		use controllable Tabs, you need to give all of your tabs values or else
					              		you wont be able to select them.
					            	</p>
					          	</div>
					        </Tab>
				      	</Tabs>
				    </CardText>
				</Card>
			</MuiThemeProvider>
        );
    }
}

export default PortfolioPane;