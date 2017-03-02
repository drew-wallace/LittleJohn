const currentOrder = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_CURRENT_ORDER':
            return Object.assign({}, state, {
                ...action.options
            });
        default:
            return state
    }
}

export default currentOrder;