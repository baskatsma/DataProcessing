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

    // Load JSON data files
    queue()
        .defer(d3.json, 'data_edited_2016.json')
        .defer(d3.json, 'data_edited_2017.json')
        .await(function(error, data2016, data2017) {

            // Catch any errors
            if (error) throw error;

            // Convert 2016 data strings to numbers
            data2016.forEach(function(d) {
                d.avgWind = Math.round(d.avgWind * 100) / 100;
                d.highestWind = Math.round(d.highestWind * 100) / 100;
                d.lowestWind = Math.round(d.lowestWind * 100) / 100;
            });

            // Convert 2017 data strings to numbers
            data2017.forEach(function(d) {
                d.avgWind = Math.round(d.avgWind * 100) / 100;
                d.highestWind = Math.round(d.highestWind * 100) / 100;
                d.lowestWind = Math.round(d.lowestWind * 100) / 100;
            });

            // Log upload output
            console.log(data2016, data2017);
        });
};
