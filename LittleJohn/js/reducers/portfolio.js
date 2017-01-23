const portfolio = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_PORTFOLIO':
            return Object.assign({}, state, {
                portfolio: action.portfolio
            });
        default:
            return state;
    }
}

export default portfolio;