import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

import { CircularProgress, Card, CardText, List, ListItem } from 'material-ui';

import RobinhoodMiniDayChart from './robinhood-mini-day-chart';

import { formatCurrency, formatPercent } from '../lib/formaters';
import value_equals from '../lib/value_equals';

const WatchlistComponent = class extends Component {
    shouldComponentUpdate(nextProps, nextState) {
		return !value_equals(nextProps, this.props);
	}

    render() {
        const { watchlist, settings, changeTitle, fetchWatchlistIfNeeded } = this.props;

        if(watchlist.lastUpdated) {
            return (
                <Card style={{marginBottom: 15}} containerStyle={{padding: 0}}>
                    <CardText style={{padding: 0}}>
                        <List style={{padding: 0}}>
                            {(_.values(watchlist.items) || []).map((stock, i) => {
                                const { quantity, quote, instrument } = stock;
                                let displayedValue = formatCurrency(+quote.last_trade_price);

                                switch(settings.displayedValue) {
                                    case 'price':
                                        displayedValue = formatCurrency(+quote.last_trade_price);
                                        break;
                                    case 'equity':
                                        displayedValue = formatCurrency(+quote.last_trade_price * +quantity);
                                        break;
                                    case 'percent':
                                        displayedValue = formatPercent((+quote.last_trade_price / +quote.adjusted_previous_close) - 1);
                                        break;
                                }

                                return (
                                    <div key={i}>
                                        <ListItem
                                            innerDivStyle={{display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap'}}
                                            primaryText={(<span style={{flex: '0 1 33.333%', display: 'flex', alignItems: 'center'}}>{instrument.symbol}</span>)}
                                            secondaryText={(<span className="stock-list-item-subheader" style={{flex: '0 1 100%'}}>Watchlist</span>)}
                                            onTouchTap={() => changeTitle(instrument.name, {stockType: 'watchlist', symbol: instrument.symbol, hasBackButton: true})}
                                        >
                                            <div style={{flex: '0 1 33.333%', display: 'flex', justifyContent: 'flex-end'}}>
                                                <span style={{position: 'relative', top: '50%'}}>{displayedValue}</span>
                                            </div>
                                            <div style={{flex: '0 1 33.333%', display: 'flex', justifyContent: 'center'}}>
                                                <RobinhoodMiniDayChart stock={stock}/>
                                            </div>
                                        </ListItem>
                                    </div>
                                );
                            })}
                        </List>
                    </CardText>
                </Card>
            );
        } else {
            fetchWatchlistIfNeeded();
            return (
                <div style={{height: 140, marginBottom: 15}}>
                    <div style={{display: 'flex', width: '100%', height: 140, alignItems: 'center'}}>
                        <CircularProgress size={80} thickness={5} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                    </div>
                </div>
            );
        }
    }
}


// WatchlistComponent.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default WatchlistComponent;