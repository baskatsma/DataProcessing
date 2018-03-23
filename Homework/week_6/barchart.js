/*
 *  barchart.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 6
 *
 */

function makeBarchart(chosenState) {

    // Dynamically add the title
    addTitle(chosenState);

    // Append measurements to the barchart
    var svg2 = d3.select(".barchart")
        .append("svg")
          .attr("width", width * downscale / 10 + margin.left + margin.right)
          .attr("height", height * downscale + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left * 0.35 + "," + margin.top + ")");

    // Convert JSON population strings to numbers
    population = [];
    getPopulationValues(chosenState);

    // Add barchart tooltip
    var barTip = d3.tip()
        .attr("class", "d3-tip")
        .attr("id", "barTooltip")
        .offset([-10, 0])
        .html(function(d) {
            var formatDecimals = d3.format(".2f");
            return formatDecimals(d).bold() + " million"; });

    // Start barchart tooltip
    svg2.call(barTip);

    // Define X and Y, and its range
    var x = d3.scaleBand()
        .range([0, width * downscale])
        .domain(years)
        .padding(0.25);

    var y = d3.scaleLinear()
        .range([height * downscale, 0])
        .domain([0, d3.max(population)]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

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

    // Add bars with linked data to the chart
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

    addTitle(chosenState);

    var svg2 = d3.select(".barchart").select("svg").select("g");

    // Convert JSON population strings to numbers
    population = [];
    getPopulationValues(chosenState);

    // Add barchart tooltip
    var barTip = d3.tip()
        .attr("class", "d3-tip")
        .attr("id", "barTooltip")
        .offset([-10, 0])
        .html(function(d) {
            var formatDecimals = d3.format(".2f");
            return formatDecimals(d).bold() + " million"; });

    // Start the tip
    svg2.call(barTip);

    // Set the range and domain for y
    var y = d3.scaleLinear()
        .domain([0, d3.max(population)])
        .range([height * downscale, 0]);

    // Create and draw y-axis on desired position and set label
    var yAxis = d3.axisLeft(y);

    d3.select(".yAxis")
        .transition()
        .duration(1200)
        .call(yAxis)

    var bars = svg2.selectAll(".bar")
        .data(population)
        .on("mouseover", barTip.show)
        .on("mouseout", barTip.hide);

    bars
        .transition().duration(1000)
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height * downscale - y(d); })
        .style("fill", "teal");
}
