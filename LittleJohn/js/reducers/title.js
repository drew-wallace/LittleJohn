import { set, setAppend, setPrepend } from 'monolite';

const title = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_TITLE_FROM_TAB':
            return set(state, root => root.present)({
                floatingTitle: action.floatingTitle,
                fixedTitle: action.fixedTitle,
                stockType: action.stockType,
                symbol: action.symbol,
                hasBackButton: action.hasBackButton
            });
        case 'CHANGE_TITLE':
            const newState = setAppend(state, root => root.past)(state.present);
            const newerState = set(newState, root => root.present)({
                floatingTitle: action.floatingTitle,
                fixedTitle: action.fixedTitle,
                stockType: action.stockType,
                symbol: action.symbol,
                hasBackButton: action.hasBackButton,
            });
            return newerState;
        case 'UNDO_TITLE':
            const newPastStateUndo = set(state, root => root.past)(state.past.slice(0, state.past.length - 1));
            const newPresentStateUndo = set(newPastStateUndo, root => root.present)(state.past[state.past.length - 1]);
            return setPrepend(newPresentStateUndo, root => root.future)(state.present);
        case 'REDO_TITLE':
            const newPastStateRedo = setAppend(state, root => root.past)(state.present);
            const newPresentStateRedo = set(newPastStateRedo, root => root.present)(state.future[0]);
            return set(newPresentStateRedo, root => root.present)(state.future.slice(1, state.future.length));
        case 'INIT_TITLE':
            const newPastInit = setAppend(state, root => root.past)(state.present)
            return set(newPastInit, root => root.present)({
                floatingTitle: action.floatingTitle,
                fixedTitle: action.fixedTitle,
                stockType: action.stockType,
                symbol: action.symbol,
                hasBackButton: action.hasBackButton,
            });
        default:
            return state;
    }
}

export default title;