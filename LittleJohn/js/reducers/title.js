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
                activePane: action.activePane,
                orderId: action.orderId
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
    let past;

    switch (action.type) {
        case 'INIT_TITLE':
            return {
                _latestUnfiltered: {
                    floatingTitle: action.floatingTitle,
                    fixedTitle: action.fixedTitle,
                    stockType: action.stockType,
                    symbol: action.symbol,
                    hasBackButton: action.hasBackButton,
                    activePane: action.activePane,
                    orderId: action.orderId
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
                    hasBackButton: action.hasBackButton,
                    activePane: action.activePane,
                    orderId: action.orderId
                },
                future: [
                    ...state.future
                ]
            };
        case 'BACK_TO_ORDER_PLACEMENT_PANE':
            past = state.past.slice(0, 3);

            return {
                _latestUnfiltered: _.last(past),
                past: state.past.slice(0, 2),
                present: _.last(past),
                future: []
            };
        case 'BACK_TO_STOCK_PANE':
            past = state.past.slice(0, 4);

            return {
                _latestUnfiltered: _.last(past),
                past: state.past.slice(0, 3),
                present: _.last(past),
                future: []
            };
    }
});

export default title;