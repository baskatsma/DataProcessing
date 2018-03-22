/*
 *  linkedviews.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 6
 *
 */

 // Execute main code after loading the DOM
 document.addEventListener("DOMContentLoaded", function() {

    // Load US map and population data
    d3.queue()
      .defer(d3.json, "us.json")
      .defer(d3.json, "dataUSA.json")
      .await(mainCode);

    // Then, add an event listener for the randomize button
    document.addEventListener("readystatechange", function() {
        randomState();
    });
 });

// Initialize width, height and margins
var margin = {top: 10, bottom: 20, left: 175, right: 200},
    height = 450 - margin.top - margin.bottom,
    width = 825 - margin.left - margin.right;
var downscale = 0.7;

// Create arrays to store data
var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016"];
var jsonData = [];
var dataArray = [];
var population = [];

// Set-up colors for map
var lowColor = "#f9f9f9"
var highColor = "teal"

// Initialize map tooltip
var mapTip = d3.tip()
  .attr("class", "d3-mapTip")
  .offset([-5, 0])

function mainCode(error, us, data) {

    // Initialize the map with the successfully loaded data
    if (error) throw error;
    makeMap(us, data);
}

function makeMap(us, data) {

  // D3 Projection
  var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([800]);

  // Define path generator
  var path = d3.geoPath()
    .projection(projection);

  // Append measurements to the map
  var svg = d3.select(".map")
    .append("svg")
        .attr("width", width + margin.left + margin.right / 1.85)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Clean the data and push into arrays
  dataArray = [];
  data.forEach(function(d) {
      d.pop2017 = Number(d.pop2017);
      dataArray.push(d.pop2017)
      jsonData.push(d);
  });

  var minVal = d3.min(dataArray);
  var maxVal = d3.max(dataArray);
  var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);

  for (var i = 0, lenI = data.length; i < lenI; i++) {
      var dataState = data[i].name;
      var dataValue2017 = data[i].pop2017;

      // Find the corresponding state inside the GeoJSON
      for (var j = 0, lenJ = us.features.length; j < lenJ; j++) {
          var jsonState = us.features[j].properties.name;

          // Copy the data value into the JSON if the states match
          if (dataState == jsonState) {
              us.features[j].properties.value2017 = dataValue2017;
              break;
          }
      }
  }

  console.log(us.features);

  // Create default barchart
  var chosenState = "Alabama";
  makeBarchart(chosenState);

  // Update tooltip with data
  mapTip.html(function(d) {
      var formatThousand = d3.format(",");
      return "<strong>State:</strong> " + d.properties.name + "<br>" + "<strong>Population in 2017:</strong> " + formatThousand(d.properties.value2017);
  });

  // Start the map tooltip
  svg.call(mapTip);

  // Bind the data to the SVG and create one path per GeoJSON feature
  svg.selectAll("path")
    .data(us.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d) { return ramp(d.properties.value2017) })
    .on("mouseover", mapTip.show)
    .on("mouseout", mapTip.hide)
    .on("click", function(d) {
        d3.select(".selected").classed("selected", false);
        d3.select(this).classed("selected", true);
        var chosenState = d.properties.name; updateBarchart(chosenState);
    });

  // Draw the map legend
  makeLegend(minVal, maxVal);
}

function makeLegend(minVal, maxVal) {

    // add a legend
    var w = 110, h = 200;

    var key = d3.select("svg")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "legend");

    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", highColor)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lowColor)
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", w - 80)
      .attr("height", h)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(10,10)");

    var y = d3.scaleLinear()
      .range([h, 0])
      .domain([minVal, maxVal]);

    var yAxis = d3.axisRight(y);

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(41,10)")
      .call(yAxis)
}

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
      .attr("class", "d3-barTip")
      .offset([-10, 0])
      .html(function (d) {
          var formatDecimals = d3.format(".2f");
          return formatDecimals(d).bold() + " million";
      });

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

    // Add tooltip
    var barTip = d3.tip()
      .attr("class", "d3-barTip")
      .offset([-10, 0])
      .html(function (d) {
          var formatDecimals = d3.format(".2f");
          return formatDecimals(d).bold() + " million";
      });

    // start the tip
    svg2.call(barTip);

    // set the range and domain for y
    var y = d3.scaleLinear()
      .domain([0, d3.max(population)])
      .range([height * downscale, 0]);

    // create and draw y-axis on desired position and set label
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

function getPopulationValues(chosenState) {

    // Send JSON values into separate arrays
    for (var i = 0, len = jsonData.length; i < len; i++) {
        if (jsonData[i].name === chosenState) {
            population.push(Number(jsonData[i].pop2010)/1000000);
            population.push(Number(jsonData[i].pop2011)/1000000);
            population.push(Number(jsonData[i].pop2012)/1000000);
            population.push(Number(jsonData[i].pop2013)/1000000);
            population.push(Number(jsonData[i].pop2014)/1000000);
            population.push(Number(jsonData[i].pop2015)/1000000);
            population.push(Number(jsonData[i].pop2016)/1000000);
        }
    }
}

// Get a random US state and update the barchart
function randomState() {

    // Select the button and create an .onclick function to update chosenState
    var randomizeButton = document.getElementById("randomizeButton");
    randomizeButton.onclick = function() {

        var pickState = jsonData[Math.floor(Math.random() * jsonData.length)];

        // Remove old highlight and update the barchart
        d3.select(".selected").classed("selected", false);
        updateBarchart(pickState.name);
    }
}

function addTitle(chosenState) {

    // Dynamically add the title
    document.getElementById("barchartTitle").innerHTML = chosenState.bold() + " population, " + "2010 to 2016";
}
