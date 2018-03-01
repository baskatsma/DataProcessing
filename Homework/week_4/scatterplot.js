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
    var margin = {top: 40, bottom: 15, left: 120, right: 100},
        height = 650 - margin.top - margin.bottom,
        width = 1100 - margin.left - margin.right;
    var legendRectSize = 20;
    var legendSpacing = 5;

    // Apply dimensions to chart
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

        var color = d3.scale.category10();

        var x = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
            return d.lifeExpectancy;
        }))
            .range([0, width - margin.left - margin.right]);

        var y = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
            return d.wellbeing;
        }))
            .range([height - margin.top - margin.bottom, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y.range()[0] + ")")
            .call(xAxis)
          .append("text")
            .attr("class", "xtext")
            .attr("x", width / 2)
            .attr("y", margin.bottom * 4)
            .style("text-anchor", "end")
            .text("Life Expectancy (years)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("class", "ytext")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left / 2)
            .attr("x", -height / 4)
            .style("text-anchor", "end")
            .text("Wellbeing (1-10)");

        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.lifeExpectancy); })
            .attr("cy", function(d) { return y(d.wellbeing); })
            .style("fill", function(d) { return color(d.region); });

          var legend = svg.selectAll(".legend")
              .data(color.domain())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(725," + i * 30 + ")"; });

          legend.append("rect")
                .attr("width", legendRectSize)
                .attr("height", legendRectSize)
                .style("fill", color)
                .style("stroke", color);

          legend.append("text")
                .attr("x", legendRectSize + (legendSpacing * 2))
                .attr("y", legendRectSize - legendSpacing)
                .text(function(d) { return d; });
        });
};
