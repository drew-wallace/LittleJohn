const watchlist = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_WATCHLIST':
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case 'REQUEST_WATCHLIST':
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_WATCHLIST':
            return Object.assign({}, state, {
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