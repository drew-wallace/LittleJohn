const cards = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_CARDS':
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case 'REQUEST_CARDS':
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_CARDS':
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt,
                items: [
                    ...action.cards
                ]
            });
        case 'DISMISS_CARD':
            const newCards = [
                ...state
            ];
            newCards.shift();
            return newCards;
        default:
            return state
    }
}

export default cards;