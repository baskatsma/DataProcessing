/*
 *  barchart.js
 *
 *  Bas Katsma (10787690)
 *
 */

// Initialize values
var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width]);

var barchart = d3.select(".barchart")
    .attr("width", width);

// Load JSON dataFile
d3.json("data_edited.json", function(data) {
  console.log(data);
  console.log(typeof data[1]);
});
