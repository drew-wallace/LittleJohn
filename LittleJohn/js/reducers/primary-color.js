const primaryColor = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_PRIMARY_COLOR':
            return action.color
        default:
            return state;
    }
}

export default primaryColor;