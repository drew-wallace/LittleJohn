import undoable, { distinctState } from 'redux-undo';

const title = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_TITLE':
            return Object.assign({}, state, {
                floatingTitle: action.floatingTitle,
                fixedTitle: action.fixedTitle,
                isStock: action.isStock,
                isPosition: action.isPosition,
                isWatchlist: action.isWatchlist,
                hasBackButton: (action.isStock || action.isPosition || action.isWatchlist)
            });
        default:
            return state;
    }
}

const undoableTitle = undoable(title, {
  filter: distinctState(),
  undoType: 'UNDO_TITLE',
  redoType: 'REDO_TITLE'
})


export default undoableTitle;