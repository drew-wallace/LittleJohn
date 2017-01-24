import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';

import RobinhoodChart from './chart';
import RobinhoodCards from '../containers/robinhood-cards';
import RobinhoodPositions from '../containers/robinhood-positions';

class PortfolioPane extends Component {
	constructor(props) {
	    super(props);

		this.state = {
			title: '$0',
			subtitle: ''
	    };
	}

    render() {
		let changePrimaryColor = this.props.changePrimaryColor;
		let primaryColor = this.props.primaryColor;
		let portfolioSubtitle = this.props.portfolio.subtitle;
		let {equity, historicals} = this.props.portfolio;
		let {day, week, month, quarter, year, all} = historicals;

		return (
			<div>
				<RobinhoodChart
					title={equity}
					subtitle={portfolioSubtitle}
					margin={{top: 0, right: 0, bottom: 0, left: 0}}
					data={{day, week, quarter, month, year, all}}
					changePrimaryColor={changePrimaryColor}
				/>
				<RobinhoodCards/>
				<RobinhoodPositions/>
			</div>
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

export default PortfolioPane;