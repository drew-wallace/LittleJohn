import { set } from 'monolite';

const menu = (state = {}, action) => {
    switch (action.type) {
        case 'TOGGLE_MENU':
            return set(state, root => root)(action.open);
        default:
            return state;
    }
}

export default menu;