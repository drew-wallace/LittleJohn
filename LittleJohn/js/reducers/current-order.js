const currentOrder = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_CURRENT_ORDER':
            return Object.assign({}, state, {
                ...action.options
            });
        case 'RESET_CURRENT_ORDER':
            return {
                ...action.options
            };
        default:
            return state
    }
}

export default currentOrder;