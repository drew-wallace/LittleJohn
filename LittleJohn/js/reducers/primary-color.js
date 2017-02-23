import { set } from 'monolite';

const primaryColor = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_PRIMARY_COLOR':
            return set(state, root => root)(action.color);
        default:
            return state;
    }
}

export default primaryColor;