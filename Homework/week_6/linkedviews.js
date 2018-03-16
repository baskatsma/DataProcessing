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

  //Width and height of map
  var margin = {top: 10, bottom: 20, left: 120, right: 200},
      height = 550 - margin.top - margin.bottom,
      width = 1300 - margin.left - margin.right;

  var lowColor = "#f9f9f9"
  var highColor = "teal"

  // D3 Projection
  var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US

  // Define path generator
  var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection

  // Initialize tip
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-5, 0])
      .html(function(d) {
          return "<strong>State:</strong> " + d.properties.name + "</span>" + "<br>" + "<strong>Population:</strong> " + d.properties.value + "</span>";
        });

  var svg = d3.select(".map")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Call tip
  svg.call(tip);

  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.json, "dataUSA.json")
    .await(function(error, us, data) {
        if (error) throw error;

        var dataArray = [];
        data.forEach(function(d) {
          d.pop2017 = parseInt(d.pop2017);
          d.births2011 = parseInt(d.births2011);
          d.births2012 = parseInt(d.births2012);
          d.births2013 = parseInt(d.births2013);
          d.births2014 = parseInt(d.births2014);
          d.births2015 = parseInt(d.births2015);
          d.births2016 = parseInt(d.births2016);
          d.births2017 = parseInt(d.births2017);
          dataArray.push(+d.pop2017);
        });
        console.log(dataArray);

        var minVal = d3.min(dataArray);
      	var maxVal = d3.max(dataArray);

        createBarchart(data);

        var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])

        for (var i = 0, lenI = data.length; i < lenI; i++) {

            var dataState = data[i].name;
            var dataValue = data[i].pop2017;

            // Find the corresponding state inside the GeoJSON
            for (var j = 0, lenJ = us.features.length; j < lenJ; j++) {

                var jsonState = us.features[j].properties.name;

                if (dataState == jsonState) {

                  // Copy the data value into the JSON
                  us.features[j].properties.value = dataValue;

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
          .style("fill", function(d) { return ramp(d.properties.value) })
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide);

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
      });

      function createBarchart(data) {
          console.log(data);

          var svg2 = d3.select(".barchart")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      }
};
