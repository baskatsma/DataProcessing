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
    d3.json("data_edited.json", function(error, data) {

        // Catch any errors
        if (error) throw error;

        // Convert string to a number with 2 decimals
        data.forEach(function(d) {
            d.lifeExpectancy = Math.round(d.lifeExpectancy * 100) / 100;
            d.wellbeing = Math.round(d.wellbeing * 100) / 100;
        });
    });
};

// # FG       = Etmaalgemiddelde windsnelheid (in 0.1 m/s);
// # FHX      = Hoogste uurgemiddelde windsnelheid (in 0.1 m/s);
// # FHN      = Laagste uurgemiddelde windsnelheid (in 0.1 m/s);
// #
// # STN,YYYYMMDD,   FG,  FHX,  FHN
