// Import stylesheets
import './style.css';


//Gráfico de columnas. Mi 1º gráfico
var visualization = d3plus.viz()
 .container("#viz1")
 .data([{"year": 1991, "name":"alpha", "value": 15},
 {"year": 1992, "name":"alpha", "value": 20},])
 .type("bar")
 .id("name")
 .x("year")
 .y("value")
 .draw()

 d3.json("https://raw.githubusercontent.com/raul27868/07MBIG-Visualizacion-Actividades-Guiadas/master/columnas.json", function(data) {
 var visualization = d3plus.viz()
 .container("#viz2")
 .data(data)
 .type('bar')
 .id('name')
 .x('year')
 .y('value')
 .axes({ ticks: 'false' })
 .draw();
});

var data = [
  {"year": 1991, "name":"alpha", "value": 15},
  {"year": 1992, "name":"alpha", "value": 34},
  {"year": 1991, "name":"alpha2", "value": 17},
  {"year": 1992, "name":"alpha2", "value": 65},
  {"year": 1991, "name":"beta", "value": 10},
  {"year": 1992, "name":"beta", "value": 10},
  {"year": 1991, "name":"beta2", "value": 40},
  {"year": 1992, "name":"beta2", "value": 38},
  {"year": 1991, "name":"gamma", "value": 5},
  {"year": 1992, "name":"gamma", "value": 10},
  {"year": 1991, "name":"gamma2", "value": 20},
  {"year": 1992, "name":"gamma2", "value": 34},
  {"year": 1991, "name":"delta", "value": 50},
  {"year": 1992, "name":"delta", "value": 43},
  {"year": 1991, "name":"delta2", "value": 17},
  {"year": 1992, "name":"delta2", "value": 35}
]


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#viz3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Species;})
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.25)
      median = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.5)
      q3 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(data)

  // Show the X scale
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["setosa", "versicolor", "virginica"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([3,9])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key))})
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return(y(d.value.min))})
      .attr("y2", function(d){return(y(d.value.max))})
      .attr("stroke", "black")
      .style("width", 40)

  // rectangle for the main box
  var boxWidth = 100
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80)
})



