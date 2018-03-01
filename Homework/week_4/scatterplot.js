/*
 *  scatterplot.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 4
 *
 */

window.onload = function() {

    // Initialize dimensions and margins
    var margin = {top: 40, bottom: 60, left: 120, right: 100},
        height = 650 - margin.top - margin.bottom,
        width = 1100 - margin.left - margin.right;

    // Apply dimensions to chart
    var svg = d3.select(".scatterplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load JSON data file
    d3.json("data_edited.json", function(data) {

        // Convert string to a number with 2 decimals
        data.forEach(function(d) {
          d.lifeExpectancy = Math.round(d.lifeExpectancy * 100) / 100;
          d.wellbeing = Math.round(d.wellbeing * 100) / 100;
        });

        // this will be our colour scale. An Ordinal scale.
        var colors = d3.scale.category10();

        // this sets the scale that we're using for the X axis.
        // the domain define the min and max variables to show. In this case, it's the min and max prices of items.
        // this is made a compact piece of code due to d3.extent which gives back the max and min of the price variable within the dataset
        var x = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
            return d.lifeExpectancy;
        }))
        // the range maps the domain to values from 0 to the width minus the left and right margins (used to space out the visualization)
            .range([0, width - margin.left - margin.right]);

        // this does the same as for the y axis but maps from the rating variable to the height to 0.
        var y = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
            return d.wellbeing;
        }))
        // Note that height goes first due to the weird SVG coordinate system
            .range([height - margin.top - margin.bottom, 0]);

        // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
        svg.append("g").attr("class", "y axis");

        // this is our X axis label. Nothing too special to see here.
        svg.append("text")
            .attr("class", "xtext")
            .attr("x", width / 2)
            .attr("y", height - 35)
            .style("text-anchor", "end")
            .text("Life expectancy (years)");

        var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
        var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

        svg.selectAll("g.y.axis").call(yAxis);
        svg.selectAll("g.x.axis").call(xAxis);

        });
};
