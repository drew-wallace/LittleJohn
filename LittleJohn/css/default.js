import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Used CSS
  'scrollable-pane-content': {
    'position': 'absolute',
    'top': [{ 'unit': 'px', 'value': 0 }],
    'bottom': [{ 'unit': 'px', 'value': 0 }],
    'height': [{ 'unit': 'string', 'value': 'auto' }],
    'width': [{ 'unit': '%H', 'value': 1 }],
    'overflowY': 'scroll',
    'MsOverflowStyle': 'none',
    'touchAction': 'pan-y'
  },
  'card-title': {
    'position': 'relative',
    'top': [{ 'unit': 'px', 'value': -5 }],
    'textTransform': 'uppercase',
    'fontWeight': 'bold',
    'fontSize': [{ 'unit': 'px', 'value': 16 }]
  },
  'chart-buttonactive': {
    'textDecoration': 'none !important',
    'backgroundColor': 'transparent !important',
    'borderBottomWidth': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': '!important' }],
    'borderBottomColor': 'white !important',
    'borderBottomStyle': 'solid !important',
    'borderRadius': '0px !important',
    'color': 'white !important'
  },
  'watchlist-buttonactive': {
    'color': 'white !important'
  },
  'card-divider': {
    'margin': [{ 'unit': 'px', 'value': 15 }, { 'unit': 'px', 'value': -15 }, { 'unit': 'px', 'value': 15 }, { 'unit': 'px', 'value': -15 }, { 'unit': 'string', 'value': '!important' }]
  },
  // .stock-description-container {
    overflow: hidden;
    position: relative;
    height: 112px;
}
.stock-description-container:after {
    content: "...";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 1%;
}
  'stock-list-item-subheader': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': '!important' }]
  }
});
