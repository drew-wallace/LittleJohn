import { combineReducers } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import recycleState from 'redux-recycle';
import _ from 'lodash';

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
        default:
            return state;
    }
}

title = undoable(title, {
  filter: excludeAction('CHANGE_TITLE_FROM_TAB'),
  undoType: 'UNDO_TITLE',
  redoType: 'REDO_TITLE'
})

title = recycleState(title, ['INIT_TITLE', 'BACK_TO_ORDER_PLACEMENT_PANE'], (state, action) => {
    switch (action.type) {
        case 'INIT_TITLE':
            return {
                _latestUnfiltered: {
                    floatingTitle: action.floatingTitle,
                    fixedTitle: action.fixedTitle,
                    stockType: action.stockType,
                    symbol: action.symbol,
                    hasBackButton: action.hasBackButton
                },
                past: [
                    ...state.past,
                    state.present
                ],
                present: {
                    floatingTitle: action.floatingTitle,
                    fixedTitle: action.fixedTitle,
                    stockType: action.stockType,
                    symbol: action.symbol,
                    hasBackButton: action.hasBackButton
                },
                future: [
                    ...state.future
                ]
            };
        case 'BACK_TO_ORDER_PLACEMENT_PANE':
            let past = state.past.slice(0, 3);

            return {
                _latestUnfiltered: _.last(past),
                past: state.past.slice(0, 2),
                present: _.last(past),
                future: []
            };
    }
});

export default title;