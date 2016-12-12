document.getElementById("loginScreen").classList.remove("display-table");
document.getElementById("loginScreen").classList.add("hide");
document.getElementById("app").classList.remove("hide");

var oneDayChart = new D3LineChart("#oneDay > .one-day-chart", ".tab-content"),
    oneWeekChart = new D3LineChart("#oneWeek > .one-week-chart", ".tab-content"),
    oneMonthChart = new D3LineChart("#oneMonth > .one-month-chart", ".tab-content"),
    threeMonthChart = new D3LineChart("#threeMonth > .three-month-chart", ".tab-content"),
    oneYearChart = new D3LineChart("#oneYear > .one-year-chart", ".tab-content"),
    fiveYearChart = new D3LineChart("#fiveYear > .five-year-chart", ".tab-content");

window.addEventListener('resize', function() {
    oneDayChart.redrawChart();
    oneWeekChart.redrawChart();
    oneMonthChart.redrawChart();
    threeMonthChart.redrawChart();
    oneYearChart.redrawChart();
    fiveYearChart.redrawChart();
});

function _getValue(obj, path) {
    if (path) {
        for (var i = 0, len = path.length; i < len && (obj !== null && obj !== undefined) ; i++) {
            obj = obj[path[i]];
        }
    }
    return obj;
}

function _formatCurrency(d) {
    return numeral(d).format('$0,0.00');
}

function _formatCurrencyDiff(d) {
    return numeral(d).format('+$0,0.00');
}

function _formatPercentDiff(d) {
    return numeral(d).format('+0.00%');
}

function getAndShowChartData() {
    var data = Portfolios.results[0];
    data.equity = +data.equity;
    data.extended_hours_equity = +data.extended_hours_equity;

    document.getElementById('portfolio-header').innerText = _formatCurrency(data.equity);

    var afterHoursReturn = data.extended_hours_equity - data.equity,
        afterHoursPercentReturn = afterHoursReturn / data.equity,
        afterHoursText = _formatCurrency(data.extended_hours_equity) + ' ' + _formatCurrencyDiff(afterHoursReturn) + ' (' + _formatPercentDiff(afterHoursPercentReturn) + ') After-hours';

    document.getElementById('after-hours-sub-header').innerText = afterHoursText;

    // time
    function day(equity) {
        var data = Day.equity_historicals,
            startingEquity = +data[0].adjusted_open_equity,
            endingEquity = equity,
            netReturn = endingEquity - startingEquity,
            netPercentReturn = netReturn / startingEquity,
            equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

        document.getElementById('current-equity-change-sub-header').innerText = equityChangeText;
        document.getElementById('current-equity-change-sub-header').originalValue = equityChangeText;
        document.getElementById('current-equity-change-sub-header').oneDayValue = equityChangeText;

        oneDayChart.setup(data, 'adjusted_open_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
        oneDayChart.redrawChart();
    };

    // time and Month Day
    function week(equity) {
        var data = Week.equity_historicals,
            startingEquity = +data[0].adjusted_open_equity,
            endingEquity = equity,
            netReturn = endingEquity - startingEquity,
            netPercentReturn = netReturn / startingEquity,
            equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

        document.getElementById('current-equity-change-sub-header').oneWeekValue = equityChangeText;

        oneWeekChart.setup(data, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
        oneWeekChart.redrawChart();
    };

    // Month Day, Year
    function year(equity) {
        // var data = Year.equity_historicals.slice(Year.equity_historicals.length - 30, Year.equity_historicals.length),
        var threeMonthData = [],
            monthData = [],
            data = [];

        Year.equity_historicals.forEach(function(v,i){
            if(!moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment('08/13/2015').hour(0).minute(0).second(0))) return;
            if(moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment().hour(0).minute(0).second(0).subtract(3, 'month'))) {
                threeMonthData.push(Object.assign({}, v));
                if(moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment().hour(0).minute(0).second(0).subtract(1, 'month'))) {
                    monthData.push(Object.assign({}, v));
                }
            }
            data.push(Object.assign({}, v));
        });


        // STARTS SEPT 3, 2015, ENDS SEPT 1
        var startingEquity = +data[0].adjusted_open_equity,
            endingEquity = equity,
            netReturn = endingEquity - startingEquity,
            netPercentReturn = netReturn / startingEquity,
            equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

        document.getElementById('current-equity-change-sub-header').oneYearValue = equityChangeText;

        oneYearChart.setup(data, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
        oneYearChart.redrawChart();


        // STARTS JUNE 7, ENDS SEPT 1
        startingEquity = +threeMonthData[0].adjusted_open_equity;
        endingEquity = equity;
        netReturn = endingEquity - startingEquity;
        netPercentReturn = netReturn / startingEquity;
        equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

        document.getElementById('current-equity-change-sub-header').threeMonthValue = equityChangeText;

        threeMonthChart.setup(threeMonthData, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
        threeMonthChart.redrawChart();


        // STARTS AUG 7, ENDS SEPT 1
        startingEquity = +monthData[0].adjusted_open_equity;
        endingEquity = equity;
        netReturn = endingEquity - startingEquity;
        netPercentReturn = netReturn / startingEquity;
        equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

        document.getElementById('current-equity-change-sub-header').oneMonthValue = equityChangeText;

        oneMonthChart.setup(monthData, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
        oneMonthChart.redrawChart();
    };

    // Month Day, Year
    function fiveYear(equity) {
        // STARTS SEPT 21, 2015, ENDS SEPT 1
        var data = FiveYear.equity_historicals.filter(function(v,i){
                return moment(v.begins_at).hour(0).minute(0).second(0).isAfter(moment('08/13/2015').hour(0).minute(0).second(0));
            }),
            startingEquity = +data[0].adjusted_open_equity,
            endingEquity = equity,
            netReturn = endingEquity - startingEquity,
            netPercentReturn = netReturn / startingEquity,
            equityChangeText = _formatCurrencyDiff(netReturn) + ' (' + _formatPercentDiff(netPercentReturn) + ') 04:00 PM EDT';

        document.getElementById('current-equity-change-sub-header').fiveYearValue = equityChangeText;

        fiveYearChart.setup(data, 'adjusted_close_equity', "portfolio-header", "current-equity-change-sub-header", "after-hours-sub-header");
        fiveYearChart.redrawChart();
    };

    function positions(){
        window.positionsList = new WinJS.Binding.List(Positions);
        document.getElementById('positionsListView').winControl.data = window.positionsList;
    };

    day(data.equity);
    week(data.equity);
    year(data.equity);
    fiveYear(data.equity);
    positions();
}

getAndShowChartData();