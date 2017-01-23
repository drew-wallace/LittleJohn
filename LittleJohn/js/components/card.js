import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'react-hammerjs';

import {Card, CardText} from 'material-ui/Card';
import Lightbulb from 'material-ui/svg-icons/action/lightbulb-outline';
import Badge from 'material-ui/Badge';

class RobinhoodCard extends Component {
    constructor(props) {
        super(props);
    }

    handleSwipe(e, elm) {
        let element = ReactDOM.findDOMNode(elm);
        element.style.transform = `translate(${e.deltaX}px,0px)`;
        element.style.transitionDuration = `0ms`;
    }
    handleSwipeEnd(e, elm) {
        let {url, width, dismissCard, robinhood} = this.props;
        let element = ReactDOM.findDOMNode(elm);
        element.style.transitionDuration = `450ms`;
        element.style.transform =  `translate(${e.deltaX}px,0px)`;
        if(Math.abs(e.deltaX / width) >= 0.5) {
            url = url.split('/');
            const id = url[url.length - 2];
            robinhood.dismissCard(id).then(function(data) {
                dismissCard(url);
            });
        } else {
            element.style.transform =  `translate(0px,0px)`;
        }
    }

    render() {
        let {index, url, title, message, call_to_action, width, robinhood, dismissCard, numberOfCards} = this.props;

        return (
            <Hammer ref={url} onPan={(e) => this.handleSwipe(e, this.refs[url])} onPanEnd={(e) => this.handleSwipeEnd(e, this.refs[url])}>
                <Card style={{width: '100%', position: 'absolute', height: 140, zIndex: numberOfCards - index}}>
                    <CardText>
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 1}}><Lightbulb/> <span className="card-title">{title}</span></div>
                            <div style={{flex: 0}}>
                                <Badge badgeContent={numberOfCards - index} primary={true}/>
                            </div>
                        </div>
                        <p>{message}</p>
                        <p>{call_to_action}</p>
                    </CardText>
                </Card>
            </Hammer>
        );
    }
};

// RobinhoodCards.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default RobinhoodCard;