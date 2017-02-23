import { set } from 'monolite';

const login = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return set(state, root => root)(true);
        default:
            return state;
    }
}

export default login;