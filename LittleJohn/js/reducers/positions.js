import { set } from 'monolite';

const positions = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_POSITIONS':
            return set(state, root => root.didInvalidate)(true);
        case 'REQUEST_POSITIONS':
            return set(state, root => root)({
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_POSITIONS':
            return set(state, root => root)({
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt,
                items: action.positions
            });
        default:
            return state
    }
}

export default positions;