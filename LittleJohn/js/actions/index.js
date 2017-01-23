export const login = () => {
    return {
        type: 'LOGIN'
    };
}
export const logout = () => {
    return {
        type: 'LOGOUT'
    };
}
export const attachApi = (robinhood) => {
    return {
        type: 'ATTACH_API',
        robinhood
    };
}
export const openMenu = () => {
    return {
        type: 'OPEN_MENU'
    };
}
export const closeMenu = () => {
    return {
        type: 'CLOSE_MENU'
    };
}
export const changeTitle = (text) => {
    return {
        type: 'CHANGE_TITLE',
        text
    };
}
export const changeEquityTitle = (text) => {
    return {
        type: 'CHANGE_EQUITY_TITLE',
        text
    };
}
export const changePaneTitle = (text) => {
    return {
        type: 'CHANGE_PANE_TITLE',
        text
    };
}
export const changePaneSubtitle = (text) => {
    return {
        type: 'CHANGE_PANE_SUBTITLE',
        text
    };
}
export const addPortfolio = (portfolio) => {
    return {
        type: 'ADD_PORTFOLIO',
        portfolio
    };
}
export const addCard = (card) => {
    return {
        type: 'ADD_CARD',
        card
    };
}
export const dismissCard = (url) => {
    return {
        type: 'DISMISS_CARD',
        url
    };
}
export const addPosition = (position) => {
    return {
        type: 'ADD_POSITION',
        position
    };
}