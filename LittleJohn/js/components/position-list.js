import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import PositionListItemComponent from './position-list-item';

const PositionListComponent = ({ positions, settings, changeTitle, fetchPositionsIfNeeded }) => {
    if(positions.lastUpdated) {
        return (
            <div>
                {_.map((_.values(positions.items) || []), (position, i) =>
                    <PositionListItemComponent
                        key={i}
                        position={position}
                        settings={settings}
                        changeTitle={changeTitle}
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


// PositionListComponent.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default PositionListComponent;