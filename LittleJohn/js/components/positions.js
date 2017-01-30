import React, { Component, PropTypes } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import RobinhoodPosition from './position';

const RobinhoodPositions = ({ positions, showStockOverlay, fetchPositionsIfNeeded }) => {
    if(positions.lastUpdated) {
        return (
            <div>
                {(positions.items || []).map((position, i) =>
                    <RobinhoodPosition
                        key={i}
                        {...position}
                        showStockOverlay={showStockOverlay}
                    />
                )}
            </div>
        );
    } else {
        fetchPositionsIfNeeded();
        return (
            <div style={{height: 140, marginBottom: 15}}>
                <div style={{display: 'flex', width: '100%', height: 140, alignItems: 'center'}}>
					<CircularProgress size={80} thickness={5} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
				</div>
            </div>
        );
    }
}


// RobinhoodPositions.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default RobinhoodPositions;