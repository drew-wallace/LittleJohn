import React, { Component, PropTypes } from 'react';
import RobinhoodCard from './card';

import {Card, CardText} from 'material-ui/Card';

const RobinhoodCards = ({ cards, width, robinhood }) => (
    <div style={{height: 140, marginBottom: 15}}>
        {(cards || []).map((card, i) =>
            <RobinhoodCard
                key={i}
                index={i}
                {...card}
                width={width}
                robinhood={robinhood}
                numberOfCards={cards.length}
            />
        )}
        <Card style={{width: '100%', position: 'absolute', height: 140, zIndex: 0}}>
            <CardText>
                <div style={{fontSize: 16, textAlign: 'center', paddingTop: '1.6em'}}>You're all caught up!<br/>New cards will be added here as they<br/>become available.</div>
            </CardText>
        </Card>
    </div>
)

// RobinhoodCards.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default RobinhoodCards;
