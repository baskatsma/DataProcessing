/*
 *  scatterplot.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 4
 *
 */

// Execute code after loading the DOM
window.onload = function() {

    // Initialize dimensions and margins
    var margin = {top: 40, bottom: 15, left: 120, right: 100},
        height = 650 - margin.top - margin.bottom,
        width = 1100 - margin.left - margin.right;
    var legendRectSize = 20;
    var legendSpacing = 5;

    // Add the SVG component and set its dimensions
    var svg = d3.select(".scatterplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load JSON data file
    d3.json("data_edited.json", function(error, data) {

        // Catch any errors
        if (error) throw error;

        // Convert string to a number with 2 decimals
        data.forEach(function(d) {
            d.lifeExpectancy = Math.round(d.lifeExpectancy * 100) / 100;
            d.wellbeing = Math.round(d.wellbeing * 100) / 100;
        });

        // Initialize color scale
        var color = d3.scale.category10();

        // Encode linear x-axis data
        var x = d3.scale.linear()
            // Get min and max using .extent
            .domain(d3.extent(data, function (d) {
            return d.lifeExpectancy;
        }))
            .range([0, width - margin.left - margin.right]);

        // Encode linear y-axis data
        var y = d3.scale.linear()
            // Get min and max using .extent
            .domain(d3.extent(data, function (d) {
            return d.wellbeing;
        }))
            .range([height - margin.top - margin.bottom, 0]);

        // Initialize x-axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        // Initialize y-axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        // Append and call the x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y.range()[0] + ")")
            .call(xAxis)
          // Create and position x-axis label
          .append("text")
            .attr("class", "xtext")
            .attr("x", width / 2)
            .attr("y", margin.bottom * 4)
            .style("text-anchor", "end")
            .text("Life Expectancy (years)");

        // Append and call the y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          // Create and position y-axis label
          .append("text")
            .attr("class", "ytext")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left / 2)
            .attr("x", -height / 4)
            .style("text-anchor", "end")
            .text("Wellbeing (1-10)");

        // Append a child dot with the correct dimensions for each data point
        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.lifeExpectancy); })
            .attr("cy", function(d) { return y(d.wellbeing); })
            .style("fill", function(d) { return color(d.region); })
            // Add fancy animation
            .style("opacity", 0)
            .transition()
            .delay(function(d, i) { return i * 15; })
            .style("opacity", 1);

        // Create legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(725," + (margin.top + i * 30) + ")"; });

        // Append legend icon and color
        legend.append("circle")
              .attr("class", "dot")
              .attr("r", 10)
              .style("fill", color)
              .style("stroke", color);

        // Append legend text
        legend.append("text")
              .attr("x", legendRectSize)
              .attr("y", legendRectSize - (legendSpacing / 0.35))
              .text(function(d) { return d; })

        // Add legend description
        var legendText = svg.select(".legend")
        legendText.append("text")
              .attr("class", "ltext")
              .attr("x", legendRectSize * 4.1)
              .attr("y", -legendRectSize * 1.35)
              .style("text-anchor", "end")
              .text("Region");
        });
};
