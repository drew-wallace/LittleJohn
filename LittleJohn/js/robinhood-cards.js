import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'react-hammerjs';

import {Card, CardText} from 'material-ui/Card';
import Lightbulb from 'material-ui/svg-icons/action/lightbulb-outline';
import Badge from 'material-ui/Badge';

class RobinhoodCards extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data || []
        };
    }

    handleSwipe(e) {
		let element = ReactDOM.findDOMNode(this.refs[this.state.data[0].url]);
		element.style.transform = `translate(${e.deltaX}px,0px)`;
		element.style.transitionDuration = `0ms`;
	}

	handleSwipeEnd(e) {
		let element = ReactDOM.findDOMNode(this.refs[this.state.data[0].url]);
		element.style.transitionDuration = `450ms`;
		element.style.transform =  `translate(${e.deltaX}px,0px)`;
		if(Math.abs(e.deltaX / this.state.width) >= 0.5) {
			// pop article off stack
			// setstate
			// element.parentNode.removeChild(element);
			const url = this.state.data[0].url.split('/');
			const id = url[url.length - 2];
			this.robinhood.dismissCard(id).then(function(data) {
				console.log(data);
			});
			this.setState({cards: this.state.data.slice(1)});
		} else {
			ReactDOM.findDOMNode(this.refs[this.state.data[0].url]).style.transform =  `translate(0px,0px)`;
		}
	}

    render() {
        let cards = [];
        this.state.data.forEach(function(card, index) {
            cards.push(
                <Hammer ref={card.url} key={index} onPan={this.handleSwipe.bind(this)} onPanEnd={this.handleSwipeEnd.bind(this)}>
                    <Card style={{width: '100%', position: 'absolute', height: 140, zIndex: this.state.data.length - index}}>
                        <CardText>
                            <div style={{display: 'flex'}}>
                                <div style={{flex: 1}}><Lightbulb/> <span className="card-title">{card.title}</span></div>
                                <div style={{flex: 0}}>
                                    <Badge badgeContent={this.state.data.length - index} primary={true}/>
                                </div>
                            </div>
                            <p>{card.message}</p>
                            <p>{card.call_to_action}</p>
                        </CardText>
                    </Card>
                </Hammer>
            );
        }.bind(this));
        cards.push(
            <Card key="last-card" style={{width: '100%', position: 'absolute', height: 140, zIndex: 0}}>
                <CardText>
                    <div style={{fontSize: 16, textAlign: 'center', paddingTop: '1.6em'}}>You're all caught up!<br/>New cards will be added here as they<br/>become available.</div>
                </CardText>
            </Card>
        );
        return (<div>{cards}</div>);
    }
};

export default RobinhoodCards;