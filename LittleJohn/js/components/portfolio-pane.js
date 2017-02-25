import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';

import { CircularProgress, Dialog, FlatButton } from 'material-ui';

import value_equals from '../lib/value_equals';

import RobinhoodChartComponent from './robinhood-chart';
import CardStackContainer from '../containers/card-stack';
import PositionListContainer from '../containers/position-list';
import WatchlistContainer from '../containers/watchlist';

class PortfolioPaneComponent extends Component {
	constructor(props) {
	    super(props);

		this.state = {
			dialogOpen: false
		}
	}

	handleDialogOpen = () => {
		this.setState({dialogOpen: true});
	};

	handleDialogClose = () => {
		this.setState({dialogOpen: false});
	};

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.dialogOpen !== this.state.dialogOpen || !value_equals(nextProps, this.props);
	}

    render() {
		if(this.props.portfolio.lastUpdated) {
			let { changePrimaryColor, primaryColor} = this.props;
			let {equity, historicals, disclosures} = this.props.portfolio;
			let {day, week, month, quarter, year, all} = historicals;

			return (
				<div>
					<RobinhoodChartComponent
						title={equity}
						margin={{top: 0, right: 0, bottom: 0, left: 0}}
						data={{day: day.equity_historicals, week: week.equity_historicals, quarter: quarter.equity_historicals, month: month.equity_historicals, year: year.equity_historicals, all: all.equity_historicals}}
						changePrimaryColor={changePrimaryColor}
						primaryColor={primaryColor}
					/>
					<CardStackContainer/>
					<PositionListContainer/>
					<div style={{marginBottom: 15}}><span>Watchlist</span></div>
					<WatchlistContainer/>
					<Dialog
						title="Disclosures"
						titleStyle={{border: 'none'}}
						actions={
							<FlatButton
								label="OK"
								primary={true}
								onTouchTap={() => this.handleDialogClose()}
							/>
						}
						actionsContainerStyle={{border: 'none'}}
						modal={true}
						open={this.state.dialogOpen}
						onRequestClose={() => this.handleDialogClose()}
						autoScrollBodyContent={true}
						contentStyle={{whiteSpace: 'pre-wrap'}}
					>
						{disclosures}
					</Dialog>
					<FlatButton
						label="DISCLOSURES"
						primary={true}
						onTouchTap={() => this.handleDialogOpen()}
						style={{marginBottom: 15}}
					/>
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