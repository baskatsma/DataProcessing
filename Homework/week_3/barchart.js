/*
 *  barchart.js
 *
 *  Bas Katsma
 *  10787690
 *  Week 3:
 */

// Initialize dimensions and margins
var margin = {top: 30, bottom: 60, left: 80, right: 40},
    height = 650 - margin.top - margin.bottom,
    width = 900 - margin.left - margin.right;

// Apply dimensions to chart
var barchart = d3.select(".barchart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create arrays to store data
var months = [];
var precipitation = [];

// Load JSON dataFile
d3.json("data_edited.json", function(data) {

  // Split JSON values into separate arrays
  for (var i = 0, len = data.length; i < len; i++) {
    months.push(data[i].month);
    precipitation.push(Number(data[i].precipitation));
  }

  // Encode ordinal data
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1)
      .domain(months);

  // Map data space to display space
  var y = d3.scale.linear()
      .domain([0, d3.max(precipitation)])
      .range([height, 0]);

  // Add x-axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  // Add y-axis
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  //
  barchart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
        .attr("class", "xtext")
        .attr("y", margin.bottom/1.5)
        .attr("x", width/2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Months");

  barchart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
        .attr("class", "ytext")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left/1.25)
        .attr("x", -height/2.75)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Precipitation (mm)");

  barchart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      	.attr("class", "bar")
      	.attr("y", function(d) { return y(d.precipitation); })
      	.attr("x", function(d) { return x(d.month)})
      	.attr("width", x.rangeBand())
      	.attr("height", function(d) {return height - y(d.precipitation)});
});
