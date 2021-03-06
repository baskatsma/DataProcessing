/*
 *  extension.js
 *
 *  Additional functions to aid and/or modify the map/barchart/.html.
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *  Homework - Week 6
 *
 */

 function addStorytelling() {

     var textBox = document.getElementById("storytellingText");
     textBox.innerHTML = "<br>" +
     "Er worden hier twee verschillende visualisaties getoond: een" + "<strong>" + " interactieve kaart " + "</strong>" + "van de Verenigde Staten van Amerika en een" + "<strong>" + " interactieve barchart " + "</strong>" + "van een specifieke staat." + "<br>" +
     "De geografische kaart laat in een oogopslag het inwonersaantal van elke staat zien middels kleurcodering." + "<br>" +
     "Door over de staten te <i>hoveren</i>, wordt de naam van de staat en het precieze aantal inwoners in 2017 weergegeven." + "<br><br>" +
     "Maar, wat was dit aantal in de afgelopen jaren?" + "<br>" +
     "Dat wordt in de barchart gepresenteerd." + " Hier wordt de populatiegeschiedenis van 2010 tot 2016 interactief uitgebeeld." + "<br><br>" +
     "Tevens is het mogelijk om via de" + "<strong>" + " 'Randomize state' " + "</strong>" + "button een willekeurige staat te kiezen." + "<br><br>" + "<i>Data source</i> · <a href=\"https://www.census.gov/data/datasets/2017/demo/popest/nation-total.html#ds\">census.gov</a>";
 }

 function addTitle(chosenState) {

     document.getElementById("barchartTitle").innerHTML = chosenState.bold() + " population, " + "2010 to 2016";
 }

function getPopulationValues(chosenState) {

    population = [];

    // Loop through the JSON data and push the correct state population values
    for (var i = 0, len = jsonData.length; i < len; i++) {
        if (jsonData[i].name === chosenState) {
            population.push(Number(jsonData[i].pop2010)/1000000);
            population.push(Number(jsonData[i].pop2011)/1000000);
            population.push(Number(jsonData[i].pop2012)/1000000);
            population.push(Number(jsonData[i].pop2013)/1000000);
            population.push(Number(jsonData[i].pop2014)/1000000);
            population.push(Number(jsonData[i].pop2015)/1000000);
            population.push(Number(jsonData[i].pop2016)/1000000);
        }
    }
}

function randomState() {

    // Select the button and create an onclick function
    var randomizeButton = document.getElementById("randomizeButton");
    randomizeButton.onclick = function() {

        // Randomly pick state from the JSON data array
        var pickState = jsonData[Math.floor(Math.random() * jsonData.length)];

        // Remove old highlight and update the barchart with new chosenState
        d3.select(".selected").classed("selected", false);
        updateBarchart(pickState.name);
    }
}
