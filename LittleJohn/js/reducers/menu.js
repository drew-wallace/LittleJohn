const menu = (state = {}, action) => {
    switch (action.type) {
        case 'OPEN_MENU':
            return Object.assign({}, state, {
                menu: true
            });
        case 'CLOSE_MENU':
            return Object.assign({}, state, {
                menu: false
            });
        default:
            return state;
    }
}

export default menu;