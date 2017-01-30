import React, { Component, PropTypes } from 'react';
import RobinhoodCard from './card';

import {Card, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

const RobinhoodCards = ({ cards, width, robinhood, dismissCard, fetchCardsIfNeeded }) => {
    if(cards.lastUpdated) {
        return (
            <div style={{height: 140, marginBottom: 15}}>
                {(cards.items || []).map((card, i) =>
                    <RobinhoodCard
                        key={i}
                        index={i}
                        {...card}
                        dismissCard={dismissCard}
                        robinhood={robinhood}
                        numberOfCards={cards.items.length}
                    />
                )}
                <Card style={{width: '100%', position: 'absolute', height: 140, zIndex: 0}}>
                    <CardText>
                        <div style={{fontSize: 16, textAlign: 'center', paddingTop: '1.6em'}}>You're all caught up!<br/>New cards will be added here as they<br/>become available.</div>
                    </CardText>
                </Card>
            </div>
        );
    } else {
        fetchCardsIfNeeded();
        return (
            <div style={{height: 140, marginBottom: 15}}>
                <div style={{position: 'absolute', display: 'flex', width: '100%', height: 140, alignItems: 'center', zIndex: 1}}>
					<CircularProgress size={80} thickness={5} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
				</div>
                <Card style={{width: '100%', position: 'absolute', height: 140, zIndex: 0}}>
                    <CardText>
                        <div style={{fontSize: 16, textAlign: 'center', paddingTop: '1.6em'}}>You're all caught up!<br/>New cards will be added here as they<br/>become available.</div>
                    </CardText>
                </Card>
            </div>
        );
    }
};

// RobinhoodCards.propTypes = {
//     todos: PropTypes.arrayOf(PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         completed: PropTypes.bool.isRequired,
//         text: PropTypes.string.isRequired
//     }).isRequired).isRequired,
//     onTodoClick: PropTypes.func.isRequired
// }

export default RobinhoodCards;
