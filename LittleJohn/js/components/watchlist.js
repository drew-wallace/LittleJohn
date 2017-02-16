import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import WatchlistItemComponent from './watchlist-item';

const WatchlistComponent = ({ watchlist, settings, changeTitle, fetchWatchlistIfNeeded }) => {
    if(watchlist.lastUpdated) {
        return (
            <div>
                {_.map((_.values(watchlist.items) || []), (stock, i) =>
                    <WatchlistItemComponent
                        key={i}
                        stock={stock}
                        settings={settings}
                        changeTitle={changeTitle}
                    />
                )}
            </div>
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


// WatchlistComponent.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default WatchlistComponent;