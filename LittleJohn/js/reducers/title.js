import { combineReducers } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import recycleState from 'redux-recycle';

let title = (state = {}, action) => {
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
        // case 'INIT_TITLE':
        //     return {
        //         past: [
        //             ...state.past,
        //             state.present
        //         ],
        //         present: {
        //             floatingTitle: action.floatingTitle,
        //             fixedTitle: action.fixedTitle,
        //             stockType: action.stockType,
        //             symbol: action.symbol,
        //             hasBackButton: action.hasBackButton,
        //         },
        //         future: [
        //             ...state.future
        //         ]
        //     };
        default:
            return state;
    }
}

title = undoable(title, {
  filter: excludeAction('CHANGE_TITLE_FROM_TAB'),
  undoType: 'UNDO_TITLE',
  redoType: 'REDO_TITLE'
})

title = recycleState(title, ['INIT_TITLE'], (state, action) => {
    return {
        past: [
            ...state.past,
            state.present
        ],
        present: {
            floatingTitle: action.floatingTitle,
            fixedTitle: action.fixedTitle,
            stockType: action.stockType,
            symbol: action.symbol,
            hasBackButton: action.hasBackButton,
        },
        future: [
            ...state.future
        ]
    };
});

export default title;