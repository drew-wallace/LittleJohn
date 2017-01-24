const fixedTitle = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_FIXED_TITLE':
            return action.text;
        default:
            return state;
    }
}

export default fixedTitle;