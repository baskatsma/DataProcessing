/*
 *  map.js
 *
 *  Creates interactive map and legend, and is linked with the barchart.
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 6
 *
 *  Based on: https://bl.ocks.org/wboykinm/dbbe50d1023f90d4e241712395c27fb3
 *
 */

function makeMap(us, data) {

    // Creates a projection
    var projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale([800]);

    // Initializes the path generator
    var path = d3.geoPath()
        .projection(projection);

    // Append measurements to the map
    var svg = d3.select(".map")
        .append("svg")
            .attr("width", width + margin.left + margin.right / 1.85)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Push necessary data into arrays
    data.forEach(function(d) {
        dataValues.push(Number(d.pop2017))
        jsonData.push(d);
    });

    // Get min/max of data to color code map later
    var minVal = d3.min(dataValues);
    var maxVal = d3.max(dataValues);
    var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);

    // For each state, add population value to mapJSON file
    for (var i = 0, lenI = data.length; i < lenI; i++) {
        var dataState = data[i].name;
        var dataValue2017 = data[i].pop2017;

        for (var j = 0, lenJ = us.features.length; j < lenJ; j++) {
            var jsonState = us.features[j].properties.name;

            if (dataState == jsonState) {
                us.features[j].properties.value2017 = dataValue2017;
                break;
            }
        }
    }

    // Create default barchart
    makeBarchart("Alabama");

    // Update map tooltip and call it
    mapTip.html(function(d) {
        var formatThousand = d3.format(",");
        return "<strong>State:</strong> " + d.properties.name + "<br>" + "<strong>Population in 2017:</strong> " + formatThousand(d.properties.value2017);
    });

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

        // Update barchart with clicked state data and highlight the state
        .on("click", function(d) {
            d3.select(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);
            var chosenState = d.properties.name; updateBarchart(chosenState);
        });

    // Draw the map legend
    makeLegend(minVal, maxVal);
}

function makeLegend(minVal, maxVal) {

    var legendWidth = 110, legendHeight = 200;

    var svgLegend = d3.select("svg")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("class", "legend");

    var legend = svgLegend.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    // Add gradient
    legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", highColor)
        .attr("stop-opacity", 1);

    legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", lowColor)
        .attr("stop-opacity", 1);

    svgLegend.append("rect")
        .attr("width", legendWidth - 80)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(10,10)");

    var y = d3.scaleLinear()
        .range([legendHeight, 0])
        .domain([minVal, maxVal]);

    var yAxis = d3.axisRight(y);

    svgLegend.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(41,10)")
        .call(yAxis)
}
