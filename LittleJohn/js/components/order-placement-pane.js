import React, { Component, PropTypes } from 'react';

import { RaisedButton, Divider, List, ListItem, FlatButton } from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardText} from 'material-ui/Card';

import value_equals from '../lib/value_equals';

class OrderPlacementPaneComponent extends Component {
	constructor(props) {
	    super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !value_equals(nextProps, this.props);
	}

    render() {
		const { changePrimaryColor, primaryColor, stockType } = this.props;
		return (
			<div></div>
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

export default OrderPlacementPaneComponent;