/*
 *  map.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 6
 *
 */

function makeMap(us, data) {

    // Initialize D3 Projection
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
    dataValues = [];
    data.forEach(function(d) {
        d.pop2017 = Number(d.pop2017);
        dataValues.push(d.pop2017)
        jsonData.push(d);
    });

    var minVal = d3.min(dataValues);
    var maxVal = d3.max(dataValues);
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

    // Create default barchart
    makeBarchart("Alabama");

    // Initialize map tooltip
    var mapTip = d3.tip()
      .attr("class", "d3-tip")
      .attr("id", "mapTooltip")
      .offset([-5, 0])
      .html(function(d) {
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

    // Define legend dimensions
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
