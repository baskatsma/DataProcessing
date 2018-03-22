/*
 *  linkedviews.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 6
 *
 */

 // Execute code after loading the DOM
 window.onload = function() {

  // Initialize width, height and margins
  var margin = {top: 10, bottom: 20, left: 175, right: 200},
      height = 450 - margin.top - margin.bottom,
      width = 900 - margin.left - margin.right;

  var downscale = 0.5;

  // Set-up colors for map
  var lowColor = "#f9f9f9"
  var highColor = "teal"

  // D3 Projection
  var projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]) // translate to center of screen
      .scale([800]);

  // Define path generator
  var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
      .projection(projection); // tell path generator to use albersUsa projection

  // Append measurements to the map
  var svg = d3.select(".map")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Initialize map tooltip
  var mapTip = d3.tip()
      .attr("class", "d3-mapTip")
      .offset([-5, 0])
      .html(function(d) {
          var formatThousand = d3.format(",");
          return "<strong>State:</strong> " + d.properties.name + "<br>" + "<strong>Population in 2017:</strong> " + formatThousand(d.properties.value2017);
      });

  // Start the map tip
  svg.call(mapTip);

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.json, "dataUSA.json")
    .await(function(error, us, data) {

        if (error) throw error;

        var dataArray = [];
        data.forEach(function(d) {
          d.pop2017 = parseInt(d.pop2017);
          dataArray.push(d.pop2017);
        });

        var chosenState = "Alabama";
        makeBarchart(data, chosenState);

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
          .on("click", function(d) { var chosenState = d.properties.name; updateBarchart(data, chosenState) });

        makeLegend(minVal, maxVal);

  });

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

  function makeBarchart(data, chosenState) {

      // Dynamically add the title
      document.getElementById("barchartTitle").innerHTML = "Population of " + chosenState + " from 2010 to 2016";

      // Initialize width, height and margins
      var margin = {top: 10, bottom: 20, left: 175, right: 200},
          height = 450 - margin.top - margin.bottom,
          width = 1000 - margin.left - margin.right;

      // Set-up years for X-axis of the barchart
      var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016"];
      var population = [];

      // Append measurements to the barchart
      var svg2 = d3.select(".barchart")
          .append("svg")
              .attr("width", width * downscale + margin.left + margin.right)
              .attr("height", height * downscale + margin.top + margin.bottom)
          .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Send JSON values into separate arrays
      for (var i = 0, len = data.length; i < len; i++) {
          if (data[i].name === chosenState) {
              population.push(Number(data[i].pop2010)/1000000);
              population.push(Number(data[i].pop2011)/1000000);
              population.push(Number(data[i].pop2012)/1000000);
              population.push(Number(data[i].pop2013)/1000000);
              population.push(Number(data[i].pop2014)/1000000);
              population.push(Number(data[i].pop2015)/1000000);
              population.push(Number(data[i].pop2016)/1000000);
          }
      }

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

      // Define X and Y, and its range
      var x = d3.scaleBand()
          .range([0, width * downscale])
          .domain(years)
          .padding(0.3);

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
          .attr("x", -margin.left * 0.2)
          .attr("y", -margin.left * 0.3)
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

  function updateBarchart(data, chosenState) {

      // Dynamically add the title
      document.getElementById("barchartTitle").innerHTML = "Population of " + chosenState + " from 2010 to 2016";

      var population = [];

      var svg2 = d3.select(".barchart").select("svg").select("g");

      // Send JSON values into separate arrays
      for (var i = 0, len = data.length; i < len; i++) {
          if (data[i].name === chosenState) {
              population.push(Number(data[i].pop2010)/1000000);
              population.push(Number(data[i].pop2011)/1000000);
              population.push(Number(data[i].pop2012)/1000000);
              population.push(Number(data[i].pop2013)/1000000);
              population.push(Number(data[i].pop2014)/1000000);
              population.push(Number(data[i].pop2015)/1000000);
              population.push(Number(data[i].pop2016)/1000000);
          }
      }

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
};

// function randomizeButton() {
//
//     var a = 6;
//     console.log(a);
//     updateBarchart(data, "New York");
// }
//
// // Add an event listener for the dropdown menu
// document.addEventListener("readystatechange", function() {
//     if (document.readyState === "complete") {
//         randomizeButton();
//     }
// });
