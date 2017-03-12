import React, { Component, PropTypes } from 'react';
import NumberInput from 'material-ui-number-input';

class NumberInputComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	onKeyDown(event) {
		console.log(`onKeyDown ${event.key}`);
	};

	onChange(event, value) {
		const e = event;
		console.log(`onChange ${e.target.value}, ${value}`);
	};

	onError(error) {
		let errorText;
		console.log(error);
		switch (error) {
			case 'required':
				errorText = 'This field is required';
				break;
			case 'invalidSymbol':
				errorText = 'You are tring to enter none number symbol';
				break;
			case 'incompleteNumber':
				errorText = 'Number is incomplete';
				break;
			case 'singleMinus':
				errorText = 'Minus can be use only for negativity';
				break;
			case 'singleFloatingPoint':
				errorText = 'There is already a floating point';
				break;
			case 'singleZero':
				errorText = 'Floating point is expected';
				break;
			case 'min':
				errorText = 'You are tring to enter number less than 0';
				break;
			case 'max':
				errorText = 'You are tring to enter number greater than the max';
				break;
		}
		this.setState({ errorText: errorText });
	};

	onValid(value) {
		console.debug(`${value} is a valid number`);
	};

	onRequestValue(value) {
		console.log(`request ${JSON.stringify(value)}`);
		this.setState({ value: value })
	}

	render() {
		return (
			<NumberInput
				hintText="0.00"
				value={this.state.value}
				min={0}
				errorText={this.state.errorText}
				onValid={this.onValid.bind(this)}
				onChange={this.onChange.bind(this)}
				onError={this.onError.bind(this)}
				onRequestValue={this.onRequestValue.bind(this)}
				onKeyDown={this.onKeyDown.bind(this)} />
		);
	}
}

// RobinhoodPosition.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default NumberInputComponent;