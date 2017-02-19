import undoable, { distinctState, combineFilters, excludeAction, includeAction } from 'redux-undo';

const title = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_TITLE_FROM_TAB':
        case 'CHANGE_TITLE':
            return {
                floatingTitle: action.floatingTitle,
                fixedTitle: action.fixedTitle,
                stockType: action.stockType,
                symbol: action.symbol,
                hasBackButton: action.hasBackButton,
            };
        default:
            return state;
    }
}

const undoableTitle = undoable(title, {
  filter: excludeAction('CHANGE_TITLE_FROM_TAB'),
  undoType: 'UNDO_TITLE',
  redoType: 'REDO_TITLE'
})


export default undoableTitle;