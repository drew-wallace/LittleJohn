import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import { interval, shuffle, transition, easeCubicInOut } from 'd3';

import Letter from './Letter';

class Alphabet extends Component {
    static letters = "abcdefghijklmnopqrstuvwxyz".split('');
    state = {alphabet: []};

    componentWillMount() {
        interval(() => this.setState({
            alphabet: shuffle(Alphabet.letters)
                       .slice(0, Math.floor(Math.random() * Alphabet.letters.length))
                       .sort()
        }), 1500);
    }

    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`,
            transition = transition()
                           .duration(750)
                           .ease(easeCubicInOut);

        return (
            <g transform={transform}>
                <ReactTransitionGroup component="g">
                    {this.state.alphabet.map((d, i) => (
                        <Letter letter={d} i={i} key={`letter-${d}`}
                                transition={transition} />
                     ))}
                </ReactTransitionGroup>
            </g>
        );
    }
}

export default Alphabet;