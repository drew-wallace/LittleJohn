const api = (state = {}, action) => {
    switch (action.type) {
        case 'ATTACH_API':
            return Object.assign({}, state, {
                robinhood: action.robinhood
            });
        default:
            return state;
    }
}

export default api;