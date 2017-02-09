const stocks = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_STOCKS':
            return Object.assign({}, state, {
                ...action.stocks
            });
        default:
            return state
    }
}

export default stocks;