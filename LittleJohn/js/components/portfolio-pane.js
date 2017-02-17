import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';

import CircularProgress from 'material-ui/CircularProgress';

import RobinhoodChartComponent from './robinhood-chart';
import CardStackContainer from '../containers/card-stack';
import PositionListContainer from '../containers/position-list';
import WatchlistContainer from '../containers/watchlist';

class PortfolioPaneComponent extends Component {
	constructor(props) {
	    super(props);
	}

    render() {
		if(this.props.portfolio.lastUpdated) {
			let changePrimaryColor = this.props.changePrimaryColor;
			let primaryColor = this.props.primaryColor;
			let {equity, historicals, subtitle} = this.props.portfolio;
			let {day, week, month, quarter, year, all} = historicals;

			return (
				<div>
					<RobinhoodChartComponent
						title={equity}
						subtitle={subtitle}
						margin={{top: 0, right: 0, bottom: 0, left: 0}}
						data={{day, week, quarter, month, year, all}}
						changePrimaryColor={changePrimaryColor}
					/>
					<CardStackContainer/>
					<PositionListContainer/>
					<div style={{marginBottom: 15}}><span>Watchlist</span></div>
					<WatchlistContainer/>
				</div>
			);
		} else {
			this.props.fetchPortfolioIfNeeded();
			return (
				<div style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', marginTop: -75}}>
					<CircularProgress size={80} thickness={5} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
				</div>
			);
		}
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

export default PortfolioPaneComponent;