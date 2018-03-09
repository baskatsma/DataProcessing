/*
 *  d3line.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 5
 *
 */

// Execute code after loading the DOM
window.onload = function() {

   // Load a default graph (2016)
   var defaultYear = "2016";
   drawGraph(defaultYear);
};

// Get the dropdown year value when it's clicked and then update the graph
function yearSelecter() {
    var yearButton = document.getElementById("selectYear");
    yearButton.onclick = function() {
        var selectedYear = yearButton.value;
        drawGraph(selectedYear)
    }
}

// Initialize and draw the graph using the year that's selected from the dropdown menu
function drawGraph(selectedYear) {

    // Clear all old drawings
    d3.selectAll("svg > *").remove();

    // Dynamically add the title
    document.getElementById("title").innerHTML = "Temperatures in De Bilt throughout " + selectedYear;

    // Initialize dimensions and margins
    var margin = {top: 20, bottom: 20, left: 120, right: 200},
        height = 650 - margin.top - margin.bottom,
        width = 1200 - margin.left - margin.right;
    var legendRectSize = 20;

    // Parse the date correctly
    var parseDate = d3.timeParse("%Y%m%d");

    // Add the SVG component and set its dimensions
    var svg = d3.select(".multiline")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load correct JSON data file
    d3.json("data_edited_" + selectedYear + ".json", function(error, data) {

        // Catch any errors
        if (error) throw error;

        // Convert data strings to numbers
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.Average = Math.round(d.Average * 10) / 100;
            d.Highest = Math.round(d.Highest * 10) / 100;
            d.Lowest = Math.round(d.Lowest * 10) / 100;
        });

    		// Get all the JSON keys but the "date" one
    		var JSONKeys = d3.keys(data[0])
    			  .filter(function (key) { return key !== "date"; });

    		// Obtain filtered temperature data
    		var temperatureData = JSONKeys.map(function (temperatureType) {
      	     return {
          				temperatureType: temperatureType,
          				values: data.map(function (d) {
          					     return { date: d["date"], temperature: d[temperatureType] };
          				})
        		 };
      	});

        // Encode X-axis data
        var x = d3.scaleTime()
            .range([0, width])

            // Get min and max using .extent
            .domain(d3.extent(data, function(d) { return d.date; }));

        // Encode linear Y-axis data
        var y = d3.scaleLinear()
            .range([height, 0])

            // Get min and max using all temperature columns
         		.domain([
         		d3.min(temperatureData, function (c) {
         				   return d3.min(c.values, function (d) { return d.temperature; }); }),
         		d3.max(temperatureData, function (c) {
         				   return d3.max(c.values, function (d) { return d.temperature; }); })
         		]);

        // Use the JSONKeys as the domain of the color scale
        var color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(JSONKeys)
            .range(["green","#fecc5c","red"]);

        // Initialize, call and design the X-axis
        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x axis")
            .call(d3.axisBottom(x)
                .ticks(d3.timeMonth)
                .tickSize(16, 0)
                .tickFormat(d3.timeFormat("%B")))
            .selectAll(".tick text")
            .style("text-anchor", "start")
            .attr("x", 6)
            .attr("y", 6);

        // Initialize, call and design the Y-axis
        var yAxis = svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y)
                .tickPadding(5)
                .tickSize(10, 0))
            .append("text")
                .attr("class", "ytext")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("x", -margin.left * 1.25)
                .attr("y", -margin.left * 0.5)
                .attr("text-anchor", "end")
                .text("Temperature in degrees Celsius");

        // Initialize the curved line
        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.temperature) });

         // Enter the data and append group elements for the temperature lines
     		var tempLine = svg.selectAll(".temperatures")
            .data(temperatureData)
            .enter().append("g")
            .attr("class", "temp");

     		// Draw the line by appending path
     		tempLine.append("path")
       			.attr("class", "line")
       			.attr("d", function(d) { return line(d.values); })
       			.style("stroke", function(d) { return color(d.temperatureType); });

        // Create legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(765," + (margin.top + i * 30) + ")"; });

        // Append legend icon and color
        legend.append("circle")
              .attr("class", "dot")
              .attr("r", 10)
              .style("fill", color)
              .style("stroke", color);

        // Append legend text
        legend.append("text")
              .attr("x", legendRectSize)
              .attr("y", legendRectSize * 0.25)
              .text(function(d) { return d; })

        // Add legend description
        var legendText = svg.select(".legend")
        legendText.append("text")
              .attr("class", "ltext")
              .attr("x", legendRectSize * 4.95)
              .attr("y", -legendRectSize * 1.35)
              .style("text-anchor", "end")
              .text("Temperature");

        // Add mouse interactivity, based on: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
        var mouseInteractivity = svg.append("g")
                  .attr("class", "mouse-over-effects");

        // Append black vertical line to follow mouse
        mouseInteractivity.append("path")
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        var lines = document.getElementsByClassName("line");

        var mousePerLine = mouseInteractivity.selectAll(".mouse-per-line")
            .data(temperatureData)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

        // Add circles
        mousePerLine.append("circle")
            .attr("r", 7)
            .style("stroke", function(d) {
                return color(d.temperatureType);
            })
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        mousePerLine.append("text")
            .attr("transform", "translate(10,3)");

        // Catch mouse movements on canvas using a rect
        mouseInteractivity.append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("pointer-events", "all")

            // Hide line, circles and text when the mouse exits
            .on("mouseout", function() {
                d3.select(".mouse-line")
                  .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                  .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                  .style("opacity", "0");
            })

            // Show line, circles and text when the mouse hovers over
            .on("mouseover", function() {
                d3.select(".mouse-line")
                  .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                  .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                  .style("opacity", "1");
            })

            // Mouse hovers over canvas
            .on("mousemove", function() {
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                  .attr("d", function() {
                      var d = "M" + mouse[0] + "," + height;
                      d += " " + mouse[0] + "," + 0;
                      return d;
                  });

            d3.selectAll(".mouse-per-line")
              .attr("transform", function(d, i) {

                var xDate = x.invert(mouse[0]),
                    bisect = d3.bisector(function(d) { return d.date; }).right;
                    idx = bisect(d.values, xDate);

                var beginning = 0,
                    end = lines[i].getTotalLength(),
                    target = null;

                while (true) {
                    target = Math.floor((beginning + end) / 2);
                    pos = lines[i].getPointAtLength(target);
                    if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                        break;
                    }
                    if (pos.x > mouse[0])      end = target;
                    else if (pos.x < mouse[0]) beginning = target;
                    else break;
                }

                d3.select(this).select("text")
                  .text(y.invert(pos.y).toFixed(2));

                return "translate(" + mouse[0] + "," + pos.y +")";
              });
          });
    });
}

// Add an event listener for the dropdown menu
document.addEventListener("readystatechange", function() {
    if (document.readyState === "complete") {
        yearSelecter();
    }
});
