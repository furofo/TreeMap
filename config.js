let makeTreeMap = function (json) { // this is function to actually make tree map
    //let margin = {top: 10, right: 10, bottom: 10, left: 10} // just  a convention for adding margin may remove this later
    let width = 960;// gets width without the marings
    let  height = 570;// height without the margins 
    let svg = d3.select('#treeSvg') // selects my tree svg node from html and assigns it to variable svg
                .attr("width", width) // gives it complete width account for margin later
                .attr("height", height) // gives it complete height account for margin later
             
             
             
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

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
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
            
            if(d.data.category == "PC") {
                console.log("founc pc game" + d.data.name);
                return "red";
            }
            else {
                return "blue";
            }
        })
        .attr('class', 'tile');
}


$(document).ready(function() {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(response => response.json())
    .then(data => {
       let json = JSON.parse(JSON.stringify(data));
       makeTreeMap(json);
    });
});