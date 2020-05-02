let wrap = function(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
            let gHeight= text.attr('gHeight');   
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width && getHeight(text) < gHeight - 15) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }  
    });
    
}


let getHeight = function (selection) {
    
    return selection.node().getBBox().height;
}







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
    .padding(.4);

    treeMap(root);
    
    let g = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g');

        g.attr('id', 'treemap');
    
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
        .attr("gHeight", function(d) {return d3.select(this).node().getBBox().height})
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
    .attr("gHeight", function(d) {
        
        return d.y1 - d.y0;
    })
    .attr("x", function(d) {
            return d.x0 + 5;
        })
     .attr("y", function(d) {
             return d.y0 + 5;
        })
    .style('font-size', '10px')
    .style('overflow', 'hidden')
    .text(function(i) {
        return i.data.name;
    })
    .call(wrap, 10);

let consoleArr = ['PC', 'Wii', 'X360', 'NES', 'PS2', 'PS4', '3DS', 'SNES', 'PS', 'DS', 'PS3', 'GB', 'GBA', 'XB', '2600', 'N64', 'PSP', 'XOne'];
let colorArr = ['Gray','#4C92C3', '#FF993E', '#ADE5A1', '#DE5253', '#A985CA', '#FFADAB', '#D1C0DD', '#A3786F', '#BED2ED', '#56B356', '#FFC993', '#E992CE',
    "#F9C5DB", 'rgb(210,210,210)', '#D0B0A9', '#C9CA4E', '#E2E2A4'];

let legendXscale = d3.scaleBand() 
                  .domain(consoleArr) 
                  .range([0, 960]);
console.log("this is legend Xscale of Wii");
console.log(consoleArr);
console.log(legendXscale('Wii'));
let legend = d3.select("#legend")
                .attr("width", 960)
                .attr("height", 400);

    

let legendG= legend.selectAll('g')
    .data(consoleArr)
    .enter()
    .append('g');

legendG
    .append('rect')
    .attr('x', (d, i) => { return legendXscale(d)})
    .attr('y', '10')
    .attr("width", legendXscale.bandwidth())
    .attr("fill", 'red')
    .attr('height', 40)
legendG
    .append('text')
    .attr('x', d => legendXscale(d) + 5)
    .attr('y', '35')
    .text(d => d);



        
                
}


$(document).ready(function() {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(response => response.json())
    .then(data => {
       let json = JSON.parse(JSON.stringify(data));
       makeTreeMap(json);
    });
});