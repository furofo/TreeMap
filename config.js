let makeTreeMap = function (json) {
    let margin = {top: 10, right: 10, bottom: 10, left: 10}
    let width = 445 - margin.left - margin.right;
    let  height = 445 - margin.bottom - margin.bottom;
    let svg = d3.select('#treeSvg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height - margin.top - margin.bottom)
             .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let root = d3.hierarchy(json).sum(function(d) {return d.value});

    d3.treemap()
    .size([width, height])
    .padding(2)
    (root);

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("x", function(d) {return d.x0})
        .attr("y", function(d) {return d.y0})
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "slateblue");
}


$(document).ready(function() {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(response => response.json())
    .then(data => {
       let json = JSON.parse(JSON.stringify(data));
       makeTreeMap(json);
    });
});