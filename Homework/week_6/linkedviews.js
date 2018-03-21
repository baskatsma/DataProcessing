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
  var margin = {top: 10, bottom: 20, left: 120, right: 200},
      height = 550 - margin.top - margin.bottom,
      width = 1200 - margin.left - margin.right;

  var downscale = 0.6;

  // Set-up colors for map
  var lowColor = "#f9f9f9"
  var highColor = "teal"

  // D3 Projection
  var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US

  // Define path generator
  var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection

  var svg = d3.select(".map")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set-up years for X-axis of the barchart
  var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016"];

  // Append measurements to the barchart
  var svg2 = d3.select(".barchart")
      .attr("width", width * downscale + margin.left + margin.right)
      .attr("height", height * downscale + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define X and Y, and its range
  var x = d3.scaleBand()
      .range([0, width * downscale])
      .domain(years)
      .padding(0.3);

  var y = d3.scaleLinear()
      .range([height * downscale, 0]);

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  svg2.append("g")
      .attr("class", "yAxis")
      .call(yAxis
          .tickPadding(5)
          .tickSize(10, 0))

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height * downscale + ")")
      .call(xAxis)

  svg2.append("text")
      .attr("class", "xtext")
      .attr("y", margin.bottom / 1.5)
      .attr("x", width / 2)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  svg2.append("text")
        .attr("class", "ytext")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.left * 1)
        .attr("y", -margin.left * 0.5)
        .attr("text-anchor", "end")
        .text("Population");

  // Initialize tip
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-5, 0])
      .html(function(d) {
          return "<strong>State:</strong> " + d.properties.name + "</span>" + "<br>" + "<strong>Population in 2017:</strong> " + d.properties.value2017 + "</span>";
      });

  // Call tip
  svg.call(tip);

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.json, "dataUSA.json")
    .await(function(error, us, data) {

        if (error) throw error;

        var chosenState = "Alabama";
        updateBarchart(chosenState, data);

        var dataArray = [];
        data.forEach(function(d) {
          d.pop2017 = parseInt(d.pop2017);
          dataArray.push(d.pop2017);
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

                if (dataState == jsonState) {

                  // Copy the data value into the JSON
                  us.features[j].properties.value2017 = dataValue2017;

                  // Stop looking through the JSON
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
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .on("click", function(d) { var chosenState = d.properties.name; updateBarchart(chosenState, data) });

        createLegend(minVal, maxVal);

  });

  function createLegend(minVal, maxVal) {

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

  function updateBarchart(chosenState, data) {

      var population = [];

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

      // Update axis domains
      y.domain([0, d3.max(population)]);

      svg2.select(".yAxis")
          .transition()
          .duration(1200)
          .call(yAxis)

      svg2.select(".xAxis")
      		.attr("transform", "translate(0," + height * downscale + ")")
      		.call(xAxis)

      svg2.selectAll(".bar")
            .remove()
            .exit()
            .data(population)
            .enter()
            .append("rect")
              .attr("class", "bar")
              .attr("x", function(d, i) { return x(years[i]); })
              .attr("width", x.bandwidth())
              .transition().duration(500)
              .attr("y", function(d) { return y(d); })
              .attr("height", function(d) { return height * downscale - y(d); })
              .style("fill", "teal");
  }
};
