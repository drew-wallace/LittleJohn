﻿const robinhood = (state = {}, action) => {
    switch (action.type) {
        case 'ATTACH_ROBINHOOD':
            return Object.assign({}, state, {
                robinhood: action.robinhood
            });
        default:
            return state;
    }
}

export default robinhood;