import { set } from 'monolite';

const settings = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_DISPLAYED_VALUE':
            return set(state, root => root.displayedValue)(action.value);
        default:
            return state;
    }
}

export default settings;