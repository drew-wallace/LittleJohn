
import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import { range, transition, easeCubicInOut } from 'd3';
import Letter from './Letter';

class FancyText extends Component {
    state = {
        text: '',
        textWithIds: [],
        lastId: 0
    };

    componentWillReceiveProps(newProps) {
        const oldText = this.state.textWithIds;
        const newText = newProps.text.split('');
        let indexOfChange = 0,
            sizeOfChange = 0,
            newLastId = this.state.lastId;

        // find change
        for (; newText[indexOfChange] == (oldText[indexOfChange] && oldText[indexOfChange][0]) && indexOfChange < newText.length; indexOfChange++);

        // calculate size of change
        if (newText.length > oldText.length) {
            while (newText[indexOfChange+sizeOfChange] != (oldText[indexOfChange] && oldText[indexOfChange][0])
                    && indexOfChange+sizeOfChange < newText.length) {
                        sizeOfChange = sizeOfChange+1;
            }
        } else {
            while (newText[indexOfChange] != (oldText[indexOfChange+sizeOfChange] && oldText[indexOfChange+sizeOfChange][0])
                    && indexOfChange+sizeOfChange < oldText.length) {
                        sizeOfChange = sizeOfChange+1;
            }
        }

        // use existing ids up to point of change
        range(0, indexOfChange).forEach((i) => newText[i] = oldText[i]);

        // use new ids for additions
        if (newText.length > oldText.length) {
            range(indexOfChange, indexOfChange+sizeOfChange).forEach((i) => {
                let letter = newText[i];
                newText[i] = [letter, newLastId++];
            });

            // use existing ids from change to end
            range(indexOfChange+sizeOfChange, newText.length).forEach((i) =>
                newText[i] = oldText[i-sizeOfChange]);
        } else {
            // use existing ids from change to end, but skip what's gone
            range(indexOfChange, newText.length).forEach((i) =>
                newText[i] = oldText[i+sizeOfChange]);
        }

        this.setState({text: newProps.text,
                    textWithIds: newText,
                    lastId: newLastId});
    }

    render() {
        let { x, y } = this.props,
            thisTransition = transition()
                           .duration(750)
                           .ease(easeCubicInOut);

        return (
            <g transform={`translate(${x}, ${y})`}>
                <ReactTransitionGroup component="g">
                    {this.state.textWithIds.map(([l, id], i) =>
                        <Letter letter={l} i={i} key={id} transition={thisTransition} />
                     )}
                </ReactTransitionGroup>
            </g>
        );
    }
}

export default FancyText;