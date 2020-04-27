let consoleColorSwitcher = (node) => {
    switch(node.data.category) {
        case 'PC':
            return 'Gray';
        case 'Wii':
            return '#4C92C3';
        case 'X360':
            return '#FF993E';
        case 'NES':
            return '#ADE5A1';
        case 'PS2':
            return '#DE5253';
        case 'PS4':
            return '#A985CA';
        case '3DS':
            return '#FFADAB';
        case 'SNES':
            return '#D1C0DD';
        case 'PS':
            return '#A3786F';
        case 'DS':
            return '#BED2ED';
        case 'PS3':
            return '#56B356';
        case 'GB':
            return '#FFC993';
        case 'GBA':
            return '#E992CE';
        case 'XB':
            return '#F9C5DB';
        case '2600':
            return 'rgb(210,210,210)';
        case 'N64':
            return '#D0B0A9';
        case 'PSP':
            return '#C9CA4E';
        case 'XOne':
            return '#E2E2A4';

    }
}

let makeTreeMap = function (json) { // this is function to actually make tree map
    //let margin = {top: 10, right: 10, bottom: 10, left: 10} // just  a convention for adding margin may remove this later
    let width = 960;// gets width without the marings
    let  height = 570;// height without the margins 
    let svg = d3.select('#treeSvg') // selects my tree svg node from html and assigns it to variable svg
                .attr("width", width) // gives it complete width account for margin later
                .attr("height", height) // gives it complete height account for margin later
             
             
    let tooltip = d3.select(".svgdiv")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visiblity", "none")
                    .attr("id", "tooltip");         
    //let g = svg.append("g") // this is g elmeent that I can use for magin
              // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let root = d3.hierarchy(json).sum(function(d) {
       // console.log("this is d " + d);
       // console.log(d);
        return d.value
    }).sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    

    let treeMap = d3.treemap()
    .size([width, height])
    .padding(1);

    treeMap(root);
    
    let g = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g');
    
        g.append("rect")
        .attr("x", function(d) {
            return d.x0})
        .attr("y", function(d) {return d.y0})
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "white")
        .style("fill", function(d) {
           // console.log("this is d " + d);
           // console.log(d);
          // console.log(d.data.category);
          return consoleColorSwitcher(d); 
           /* if(d.data.category == "PC") {
                console.log("founc pc game" + d.data.name);
                return "red";
            }
            else {
                return "blue";
            } */
        })
        .attr('data-name', function(d) {
            return d.data.name;
        })
        .attr('data-category', function(d) {
            return d.data.category;
        })
        .attr('data-value', function(d) {
            return d.data.value;
        })
        .attr('class', 'tile')
        .on("mouseover", function(d, i) {
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 90 + "px")
                .style("visiblity", "visible")
                .style("display","inline-block")
                .style("background", "black")
                .style("color", "white")
                .style("opacity", "0.8")
                .html("Name: " + d3.select(this).attr('data-name') + '<br />' + "Category: " + d3.select(this).attr('data-category')
                        + '<br />' + "Value: " + d3.select(this).attr('data-value'));
        })
        .on("mouseout", function(d) {
            tooltip 
                .style("display", "none");
        })
g.append("text")
    .attr("x", function(d) {
            return d.x0
        })
     .attr("y", function(d) {
             return d.y1
        })
    .text("hello world!");
    
}


$(document).ready(function() {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(response => response.json())
    .then(data => {
       let json = JSON.parse(JSON.stringify(data));
       makeTreeMap(json);
    });
});