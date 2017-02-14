const settings = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_DISPLAYED_VALUE':
            return Object.assign({}, state, {
                displayedValue: action.value
            });
        default:
            return state;
    }
}

export default settings;