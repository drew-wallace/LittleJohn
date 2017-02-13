const positions = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_POSITIONS':
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case 'REQUEST_POSITIONS':
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_POSITIONS':
            return Object.assign({}, state, {
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