import numeral from 'numeral';

export function formatCurrency(d) {
    return numeral(d).format('$0,0.00');
}

export function formatPercent(d) {
    return numeral(d).format('0.00%');
}

export function formatCurrencyDiff(d) {
    let sign = d >= 0 ? '+' : '-'
    return `${sign}${numeral(Math.abs(d)).format('$0,0.00')}`;
}

export function formatPercentDiff(d) {
    let sign = d >= 0 ? '+' : '-'
    return `${sign}${numeral(Math.abs(d)).format('0.00%')}`;
}