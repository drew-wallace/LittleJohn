import { set } from 'monolite';

const stocks = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_STOCKS':
            return set(state, root => root)(action.stocks);
        default:
            return state
    }
}

export default stocks;