const position = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_POSITION':
            return action.position;
        default:
            return state;
    }
}

const positions = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_POSITION':
            return [
                ...state,
                position(undefined, action)
            ];
        default:
            return state;
    }
}

export default positions;