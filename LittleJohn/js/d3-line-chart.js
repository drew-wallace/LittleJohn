'use strict';

class D3LineChart{
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
        this.width = 500 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.parseTime = d3.timeParse("%d-%b-%y");
        this.bisectDate = d3.bisector(function(d) { return d.date; }).left;
        this.formatValue = d3.format(",.2f");
        this.formatCurrency = function(d) { return "$" + this.formatValue(d); };

        this.x = d3.scaleTime()
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .range([this.height, 0]);

        this.line = d3.line()
            .x(function(d) { return this.x(d.date); }.bind(this))
            .y(function(d) { return this.y(d.close); }.bind(this));

        // this.svg = d3.select(".day-chart")
        this.svg = d3.select(containerElement)
            .append("svg")
            .attr('class', 'line-chart-svg')
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr('class', 'line-chart-container-svg')
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    setup(data, highlightedValueElement) {
        this.highlightedValueElement = highlightedValueElement;
        this.data = data.map(function(d){
            return {date: new Date(d.begins_at), close: +d.adjusted_close_equity};
        });

        this.x.domain(d3.extent(this.data, function(d) { return d.date; }));
        this.y.domain(d3.extent(this.data, function(d) { return d.close; }));

        this.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));

        this.svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this.y))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("fill", "#FFF")
            .style("text-anchor", "end")
            .text("Price ($)");

        this.mainLine = this.svg.append("path")
            .datum(this.data)
            .attr("class", "line")
            .attr("d", this.line);

        this.focus = this.svg.append("g")
            .attr("height", this.height)
            .attr("class", "focus")
            .style("display", "none");

        this.focus.append("line")
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', this.height)
            .attr("stroke", "steelblue")
            .attr('class', 'verticalLine');

        // focus.append("text")
        //     .attr("x", 9)
        //     .attr("dy", ".35em")
        //     .attr("fill", "white");

        this.svg.append("rect")
            .attr("class", "overlay")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "transparent")
            .on("mouseover", function() { this.focus.style("display", null); }.bind(this))
            .on("mouseout", function() { this.focus.style("display", "none"); }.bind(this))
            .on("mousemove", this._mousemove.bind(this));
    }

    _mousemove(ignoreThis, elmIndex, elms) {
        var x0 = this.x.invert(d3.mouse(elms[elmIndex])[0]),
            i = this.bisectDate(this.data, x0, 1),
            d0 = this.data[i - 1],
            d1 = this.data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        // document.getElementById("portfolio-header").innerText = formatCurrency(d.close);
        document.getElementById(this.highlightedValueElement).innerText = this.formatCurrency(d.close);

        var xPos = d3.mouse(elms[elmIndex])[0];
        d3.select(".verticalLine").attr("transform", function () {
            return "translate(" + xPos + ",0)";
        });

        var pathLength = this.mainLine.node().getTotalLength();
        var thisX = xPos;
        var beginning = thisX,
            end = pathLength,
            target, pos;
        while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = this.mainLine.node().getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== thisX) {
                break;
            }
            if (pos.x > thisX) end = target;
            else if (pos.x < thisX) beginning = target;
            else break; //position found
        }
    }

    redrawChart() {
        //get dimensions based on window size
        this.width = document.querySelector(this.containerElement).offsetWidth - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.x = d3.scaleTime()
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .range([this.height, 0]);

        this.line = d3.line()
            .x(function(d) { return this.x(d.date); }.bind(this))
            .y(function(d) { return this.y(d.close); }.bind(this));

        d3.select('.line-chart-svg')
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        d3.select('.line-chart-container-svg')
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.x.domain(d3.extent(this.data, function(d) { return d.date; }));
        this.y.domain(d3.extent(this.data, function(d) { return d.close; }));

        d3.select('.axis--x')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));

        d3.select('.axis--y')
            .call(d3.axisLeft(this.y));

        d3.select('.line')
            .attr("d", this.line);

        d3.select('.focus')
            .attr("height", this.height);

        d3.select('.verticalLine')
            .attr('y2', this.height);

        d3.select('.overlay')
            .attr("width", this.width)
            .attr("height", this.height);
    }
}