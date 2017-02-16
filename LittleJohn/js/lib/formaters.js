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

export function formatTime(d, span) {
        d = new Date(d);
		let hours = d.getHours();
		let minutes = d.getMinutes();

		if(hours > 12) hours -= 12;
		if(hours < 10) hours = '0' + hours;
		if(minutes < 10) minutes = '0' + minutes;

		switch(span) {
			case 'day':
				return `${hours}:${minutes} EDT`;
			case 'week':
				return `${hours}:${minutes} EDT ${moment(d).format('MMM D')}`;
			case 'month':
				return `${moment(d).format('MMM D YYYY')}`;
			case 'quarter':
				return `${moment(d).format('MMM D YYYY')}`;
			case 'year':
				return `${moment(d).format('MMM D YYYY')}`;
			case 'all':
				return `${moment(d).format('MMM D YYYY')}`;
		}
	}