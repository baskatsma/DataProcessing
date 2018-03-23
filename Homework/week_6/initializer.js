/*
 *  initializer.js
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
        .defer(d3.json, "data/us.json")
        .defer(d3.json, "data/dataUSA.json")
        .await(mainCode);

    // Add an event listener for the randomize button
    document.addEventListener("readystatechange", function() {
        randomState();
    });
 });

// Define width, height and margins
var margin = {top: 10, bottom: 20, left: 175, right: 200},
    height = 450 - margin.top - margin.bottom,
    width = 825 - margin.left - margin.right,
    downscale = 0.7;

// Create arrays to store data
var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016"];
var jsonData = [];
var dataValues = [];
var population = [];

// Define map colors
var lowColor = "#f5f7f4";
var highColor = "teal";

function mainCode(error, us, data) {

    // Initialize the map with the successfully loaded data
    if (error) throw error;
    makeMap(us, data);
}
