const title = (state = {}, action) => {
    console.log(state);
    switch (action.type) {
        case 'CHANGE_TITLE':
            return action.text;
        default:
            return '';
    }
}

export default title;