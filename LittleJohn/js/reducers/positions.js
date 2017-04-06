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
        case 'DISMISS_ORDER':
            let modifiedStock = Object.assign({}, state.items[action.symbol]);
            let orderIndex = _.findIndex(modifiedStock.orders, (order) => order.id === action.orderId);
            modifiedStock.orders[orderIndex] = action.orderRes;
            let modifiedStocks = Object.assign({}, state.items);
            modifiedStocks[action.symbol] = modifiedStock;
            return Object.assign({}, state, {
                items: Object.assign({}, state.items, modifiedStocks)
            });
        default:
            return state
    }
}

export default positions;