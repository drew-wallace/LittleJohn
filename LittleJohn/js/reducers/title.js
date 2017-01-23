const title = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_TITLE':
            return Object.assign({}, state, {
                title: action.text
            });
        case 'CHANGE_EQUITY_TITLE':
            return Object.assign({}, state, {
                equityTitle: action.text
            });
        default:
            return state;
    }
}

export default title;