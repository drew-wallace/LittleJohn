const account = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_ACCOUNT':
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case 'REQUEST_ACCOUNT':
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_ACCOUNT':
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt,
                accountData: action.account
            });
        default:
            return state
    }
}

export default account;