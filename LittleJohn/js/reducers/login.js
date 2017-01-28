const login = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return true;
        default:
            return state;
    }
}

export default login;