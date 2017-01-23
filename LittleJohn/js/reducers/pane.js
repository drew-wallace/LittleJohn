const pane = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_PANE_TITLE':
            return Object.assign({}, state, {
                paneTitle: action.text
            });
        case 'CHANGE_PANE_SUBTITLE':
            return Object.assign({}, state, {
                paneSubtitle: action.text
            });
        default:
            return state;
    }
}

export default pane;