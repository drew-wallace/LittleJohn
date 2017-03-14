import React, { Component } from 'react';
import { TextField } from 'material-ui';

class MoneyTextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value;
    }

    onChange(e, value) {
        value = this.toNumber(value);
        this.setState({
            value
        });

        if (this.props.onChange) {
            this.props.onChange(value, e);
        }
    }

    toNumber(value) {
        return value.toString().match(/[0-9]*(\.[0-9]{0,4})?/)[0]
    };

    render() {
        let {...other} = this.props;

        delete other.defaultValue;

        other.onChange = this.onChange.bind(this);
        other.value = this.state.value;

        return (<TextField {...other} />);
    }
}

export default MoneyTextField