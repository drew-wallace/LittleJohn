function portfolio(state = { isFetching: false, didInvalidate: false }, action) {
    switch (action.type) {
        case 'INVALIDATE_PORTFOLIO':
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case 'REQUEST_PORTFOLIO':
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_PORTFOLIO':
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt,
                ...action.portfolio
            });
        default:
            return state
    }
}

export default portfolio;