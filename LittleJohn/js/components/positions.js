import React, { Component, PropTypes } from 'react';
import RobinhoodPosition from './position';

const RobinhoodPositions = ({ positions, showStockOverlay }) => (
    <div>
        {(positions || []).map((position, i) =>
            <RobinhoodPosition
                key={i}
                {...position}
                showStockOverlay={showStockOverlay}
            />
        )}
    </div>
)


// RobinhoodPositions.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default RobinhoodPositions;