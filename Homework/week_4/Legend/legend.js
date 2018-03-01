/*
 *  legend.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 4
 *
 */

// Execute code after loading the DOM
window.onload = function() {

  // Initialize dimensions
  var width = 360;
  var height = 360;
  var legendRectSize = 18;
  var legendSpacing = 4;

  // Add color scale
  var color = d3.scale.ordinal()
    .domain(["Licht", "Medium", "Donker"])
    .range(["#ffffb2","#fecc5c","#fd8d3c"])

  // Add the SVG component and set its dimensions
  var svg = d3.select(".legend")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(140, 40)");

  // Create legend
  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return "translate(" + horz + "," + vert + ")";
    });

  // Append legend icon and color
  legend.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", color)
    .style("stroke", color);

  // Append legend text
  legend.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text(function(d) { return d; });
};
