const auth = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return Object.assign({}, state, {
                loggedIn: true
            });
        case 'LOGOUT':
            return Object.assign({}, state, {
                loggedIn: false
            });
        default:
            return state;
    }
}

export default auth;