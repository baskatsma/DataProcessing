/*
 *  barchart.js
 *
 *  Creates barchart and updates it based on the chosen state.
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 6
 *
 *  Based on: https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be 
 *
 */

function makeBarchart(chosenState) {

    // Append dimensions to the barchart
    var svg2 = d3.select(".barchart")
        .append("svg")
            .attr("width", width * downscale / 10 + margin.left + margin.right)
            .attr("height", height * downscale + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left * 0.35 + "," + margin.top + ")");

    // Update title and get new population values
    addTitle(chosenState);
    getPopulationValues(chosenState);

    // Update barchart tooltip and call it
    barTip.html(function(d) {
        var formatDecimals = d3.format(".2f");
        return formatDecimals(d).bold() + " million";
    });

    svg2.call(barTip);

    // Define X and Y, and its domain and range
    var x = d3.scaleBand()
        .range([0, width * downscale])
        .domain(years)
        .padding(0.25);

    var y = d3.scaleLinear()
        .range([height * downscale, 0])
        .domain([0, d3.max(population)]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    // Append both axes and set Y-label text
    svg2.append("g")
        .attr("class", "yAxis")
        .call(yAxis
            .tickPadding(5)
            .tickSize(10, 0));

    svg2.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height * downscale + ")")
        .call(xAxis);

    svg2.append("text")
        .attr("class", "yText")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left * 0.25)
        .attr("text-anchor", "end")
        .text("Population (in millions)");

    // Use population data to add bars to the chart
    svg2.selectAll(".bar")
        .data(population)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return x(years[i]); })
            .attr("y", function(d) { return y(d); })
            .attr("height", function(d) { return height * downscale - y(d); })
            .attr("width", x.bandwidth())
            .on("mouseover", barTip.show)
            .on("mouseout", barTip.hide)
            .style("fill", "teal");
}

function updateBarchart(chosenState) {

    // Select the barchart
    var svg2 = d3.select(".barchart").select("svg").select("g");

    // Update title and population values
    addTitle(chosenState);
    getPopulationValues(chosenState);

    // Update barchart tooltip and call it
    barTip.html(function(d) {
        var formatDecimals = d3.format(".2f");
        return formatDecimals(d).bold() + " million";
    });

    svg2.call(barTip);

    // Update Y with new population data and re-call Y-axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(population)])
        .range([height * downscale, 0]);

    var yAxis = d3.axisLeft(y);

    // Append and animate the Y-axis
    d3.select(".yAxis")
        .transition()
        .duration(1200)
        .call(yAxis)

    // Update the bars with the new population values
    var bars = svg2.selectAll(".bar")
        .data(population)
        .on("mouseover", barTip.show)
        .on("mouseout", barTip.hide);

    // Append new values and animate the bars
    bars
        .transition().duration(1000)
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height * downscale - y(d); })
        .style("fill", "teal");
}
