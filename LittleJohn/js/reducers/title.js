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
            return set(newState, root => root.present)({
                floatingTitle: action.floatingTitle,
                fixedTitle: action.fixedTitle,
                stockType: action.stockType,
                symbol: action.symbol,
                hasBackButton: action.hasBackButton,
            });
        case 'UNDO_TITLE':
            const newStateUndo = set(state, root => root)({
                past: state.past.slice(0, state.past.length - 1),
                present: state.past[state.past.length - 1],
                future: state.future
            });
            return setPrepend(newStateUndo, root => root.future)(state.present);
        case 'REDO_TITLE':
            const newPastStateRedo = setAppend(state, root => root.past)(state.present);
            return set(newPastStateRedo, root => root)({
                present: state.future[0],
                future: state.future.slice(1, state.future.length)
            });
        case 'INIT_TITLE':
            const newPastInit = setAppend(state, root => root)(state.present)
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