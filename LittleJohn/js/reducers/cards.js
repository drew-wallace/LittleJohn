const card = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_CARD':
            return action.card
        case 'DISMISS_CARD':
            return state.url !== action.card.url
        default:
            return state;
    }
}

const cards = (state = [], action) => {
    switch (action.type) {
        case 'ADD_CARD':
            return [
                ...state,
                card(undefined, action)
            ]
        case 'DISMISS_CARD':
            return state.filter(t =>
                card(t, action)
            )
        default:
            return state
    }
}

export default cards;