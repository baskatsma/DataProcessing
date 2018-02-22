/*
 *  barchart.js
 *
 *  Bas Katsma (10787690)
 *
 */

// Load JSON dataFile
d3.json("data.json", function(data) {
  
  // Grab dates from JSON and store in separate array
  var date = [];
  for (i = 0; i < data.length; i++) {
    date.push(data[i].date);
  }
  console.log(date);

  // Grab precipitation from JSON and store in separate array
  var precipitation = [];
  for (i = 0; i < data.length; i++) {
    precipitation.push(data[i].precipitation);
  }
  console.log(precipitation);
});
