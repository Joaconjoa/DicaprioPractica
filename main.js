const width = 1100
const height = 700
const margin = {
    top: 30, 
    bottom: 40,
    left: 70, 
    right: 30
}

const diCaprioY = 1974;
const AgeDicaprio = function (year) {
    return year - diCaprioY;
}

// Declaración del svg
const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

const elementGroup = svg.append("g")
    .attr("id", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleBand().range([0, width - margin.left - margin.right]) .padding(0.2)
var y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
var color = d3.scaleOrdinal().range(d3.schemeSet2) //Asignación de paleta de colores

const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y).tickSize(-height-300)


// Data Call
d3.csv("data.csv").then(data => {
    data.map(d =>{
        d.year = +d.year
        d.age = +d.age
        
    })

let diCaprioAges = [];
    for (let i = 0; i < data.length; i++) {
        const dAge = AgeDicaprio(data[i].year);
        const yearAge = { year: data[i].year, age: dAge };
            diCaprioAges.push(yearAge);
    }

//Añadir el dominio a la escala
    y.domain([d3.min(data.map(d=>d.age-2)),d3.max(diCaprioAges.map(d=>d.age+2))])
    x.domain(data.map(d=>d.year)) 
    color.domain(data)

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
    
//Data binding:
// Gráfica de Barras
    var elements = elementGroup.selectAll("rect").data(data)

    elements.enter().append("rect")
        .attr("class", "bar")
        .attr("height", d => height - margin.top - margin.bottom - y(d.age)) 
        .attr("y", d => y(d.age))
        .attr("x", d => x(d.year)) 
        .attr("width", x.bandwidth())
        .attr("fill", d => color(d.name))

    var elements = elementGroup.selectAll("text").data(data)
    //Texto sobre las barras
    elementGroup.selectAll("textBottom")
    .data(data)    
    .join("text")
            .text(d => d.age)
            .attr("x", d => x(d.year) + x.bandwidth()/4)
            .attr("y", d => y(d.age) - 10)
            .attr("fill", "white")
            
// Gráfica lineal
    let valueLine = d3.line()
        .x((d) => x(d.year) + x.bandwidth() / 2)
        .y((d) => y(d.age));

    lineGraph = svg.append("path")
        
        .attr("class", "diCaprioAgesLine")
        .attr("d", valueLine(diCaprioAges))
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("width", x.bandwidth())

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "blanchedalmond")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "12px")
        .text("TOOLTIP");

    elementGroup.selectAll("circle")
    .data(data)
    .join("circle")
        .attr("cx", d => x(d.year)+ x.bandwidth()/2)
        .attr("cy", d => y(AgeDicaprio(d.year)))
        .attr("r", 4)
        .attr("fill", "blanchedalmond")

        .on("mouseover", function() {
            d3.select(this)
            .attr("r", 8)
            .attr("fill", "blanchedalmond", 1)
            return tooltip.style("visibility", "visible")
            })
        .on("mousemove", function(d){
            return tooltip
            .style("top", (d3.event.pageY+10)+"px")
            .style("left",(d3.event.pageX+10)+"px")
            .text(d.name + ". Edad= " + d.age + ". DiCaprio Edad= " + AgeDicaprio(d.year) + ". Diferencia de edad = " + (AgeDicaprio(d.year)-d.age))

            })
        .on("mouseout", function() {
            d3.select(this)
            .attr("r", 5)
            .attr("fill", "white", 0.2)
            return tooltip.style("visibility", "hidden")
            })
    
    elementGroup.append("text")
        .text('Línea = Edad de Dicaprio')
        .attr("x",  margin.left)
        .attr("y", (margin.left + margin.right))
        .attr("fill", 'White')
        

    elementGroup.append("text")
        .text('Barras = Edad de las Exs de Dicaprio')
        .attr("x", margin.left)
        .attr("y", 130)
        .attr("fill", 'orange')

    elementGroup.selectAll("textBottom")
    .data(data)    
    .join("text")
        .text(d => AgeDicaprio(d.year))
        .attr("x", d => x(d.year) + x.bandwidth()/4)
        .attr("y", d => y(AgeDicaprio(d.year))-10)
        .attr("font-size", 14)
        .attr("font-family", 'helvetica')
        .attr("fill", "white")
        .attr("text-anchor", "left")

        
})