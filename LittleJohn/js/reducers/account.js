import { set, setAppend } from 'monolite';

const account = (state = {}, action) => {
    switch (action.type) {
        case 'INVALIDATE_ACCOUNT':
            return set(state, root => root.didInvalidate)(true);
        case 'REQUEST_ACCOUNT':
            return set(state, root => root)({
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_ACCOUNT':
            return set(state, root => root)({
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