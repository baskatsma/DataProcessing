/*
 *  scatterplot.js
 *
 *  Bas Katsma
 *  10787690
 *
 */

var width = 360;
var height = 360;
var legendRectSize = 18;
var legendSpacing = 4;

var color = d3.scale.ordinal()
  .domain(["Licht", "Medium", "Donker"])
  .range(["#ffffb2","#fecc5c","#fd8d3c"])

var svg = d3.select('.legend')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(140, 40)');

var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset =  height * color.domain().length / 2;
    var horz = -2 * legendRectSize;
    var vert = i * height - offset;
    return 'translate(' + horz + ',' + vert + ')';
  });

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color);

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; });
