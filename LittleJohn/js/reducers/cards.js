import { set } from 'monolite';

const cards = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_CARDS':
            return set(state, root => root.didInvalidate)(true);
        case 'REQUEST_CARDS':
            return set(state, root => root)({
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_CARDS':
            return set(state, root => root)({
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt,
                accountData: action.account,
                items: [
                    ...action.cards
                ]
            });
        case 'DISMISS_CARD':
            return set(state, root => root.items)(state.items.shift());
        default:
            return state
    }
}

export default cards;