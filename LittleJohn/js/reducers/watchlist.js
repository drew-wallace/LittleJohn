import { set } from 'monolite';

const watchlist = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_WATCHLIST':
            return set(state, root => root.didInvalidate)(true);
        case 'REQUEST_WATCHLIST':
            return set(state, root => root)({
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_WATCHLIST':
            return set(state, root => root)({
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt,
                items: action.watchlist
            });
        default:
            return state
    }
}

export default watchlist;