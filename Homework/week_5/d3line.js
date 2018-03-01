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

    // Initialize dimensions and margins
    var margin = {top: 40, bottom: 15, left: 120, right: 100},
        height = 650 - margin.top - margin.bottom,
        width = 1100 - margin.left - margin.right;

    // Load JSON data file
    d3.queue()
        .defer(d3.json, 'data_edited_2016.json')
        .defer(d3.json, 'data_edited_2017.json')
        .await(function(error, file2016, file2017) { console.log(file2016, file2017); });
};
