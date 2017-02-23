import { set } from 'monolite';

function portfolio(state = { isFetching: false, didInvalidate: false }, action) {
    switch (action.type) {
        case 'INVALIDATE_PORTFOLIO':
            return set(state, root => root.didInvalidate)(true);
        case 'REQUEST_PORTFOLIO':
            return set(state, root => root)({
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_PORTFOLIO':
            return set(state, root => root)({
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