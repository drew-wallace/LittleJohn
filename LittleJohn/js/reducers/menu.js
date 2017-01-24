const menu = (state = {}, action) => {
    switch (action.type) {
        case 'TOGGLE_MENU':
            return action.open;
        default:
            return state;
    }
}

export default menu;