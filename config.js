let wrap = function(text, width) { // this makes text wrap in rect elements by setting a maximum width for each row, also added funcitnality for height so it doesn't exceed height of r
    text.each(function () {         //rect elements
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, 
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, 
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


let getHeight = function (selection) { //just a way to get height of a d3 selected element / node whatever you kids call it these days
    return selection.node().getBBox().height;
}

let consoleColorSwitcher = (node) => { // logic for changing color may switch to color scale later
    switch(node) {
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
    let width = 960;
    let  height = 570; 
    let svg = d3.select('#treeSvg') // selects my tree svg node/ element from html and assigns it to variable svg
                .attr("width", width) 
                .attr("height", height) 
             
             
    let tooltip = d3.select(".svgdiv")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visiblity", "none")
                    .attr("id", "tooltip");         
    
    let root = d3.hierarchy(json).sum(function(d) {
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
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style("stroke", "white")
        .style("fill", d =>  consoleColorSwitcher(d.data.category))
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr("gHeight", function (d) {return d3.select(this).node().getBBox().height}) // cant use arrow funciton here since this refers to window object instead of local rect
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
        .on("mouseout", d => tooltip .style("display", "none"));
        

g.append("text")
    .attr("gHeight", d =>  d.y1 - d.y0)
    .attr("x", d => d.x0 + 5)
     .attr("y", d => d.y0 + 5)
    .style('font-size', '10px')
    .style('overflow', 'hidden')
    .text(d => d.data.name)
    .call(wrap, 10);

let consoleArr = ['PC', 'Wii', 'X360', 'NES', 'PS2', 'PS4', '3DS', 'SNES', 'PS', 'DS', 'PS3', 'GB', 'GBA', 'XB', '2600', 'N64', 'PSP', 'XOne']; 
let colorArr = ['Gray','#4C92C3', '#FF993E', '#ADE5A1', '#DE5253', '#A985CA', '#FFADAB', '#D1C0DD', '#A3786F', '#BED2ED', '#56B356', '#FFC993', '#E992CE',
    "#F9C5DB", 'rgb(210,210,210)', '#D0B0A9', '#C9CA4E', '#E2E2A4']; // maybe use for this color scale later?

let legendXscale = d3.scaleBand() 
                  .domain(consoleArr)  //used scaleband to get even widths easier
                  .range([0, 960]);

let legend = d3.select("#legend")   // made legend same width as svg working on logic for rows and centering later
                .attr("width", 960)
                .attr("height", 400);

let legendG= legend.selectAll('g') // this assings group element (g) for every console
    .data(consoleArr)
    .enter()
    .append('g');

    legendG
    .append('rect')
    //.attr('x', d => legendXscale(d))
    .attr('x', function(d,i){
  let xPos = 0;  
  let xPosArr = [];
    let k = 0;
  while(xPosArr.length < consoleArr.length){
    if(k < 3){
      xPosArr.push(xPos);
      xPos += legendXscale.bandwidth() + 10;
      k++;
    }else{
      xPos = 0;
      k = 0;
    }
  }
  return xPosArr[i];
})
    .attr('y', function(d,i){
  let yPos = 1;  
  let yPosArr = [];
  let k = 0;
  while(yPosArr.length < consoleArr.length){
    k++;
    if(k < 4){
      yPosArr.push(yPos);
    }else{
      yPos += 50;
      k = 0;
    }
  }
  return yPosArr[i];
})
    .attr("width", legendXscale.bandwidth())
    .attr("fill", d => consoleColorSwitcher(d)) // use red placeholder for rects for now switching to white later and will put smaller rect inside these to give actually color key
    .attr('height', 40)
legendG
    .append('text')
    /*.attr('x', d => legendXscale(d) + 5) // need to figure logic to make rows with rect and text elements and to center it somehow */
.attr('x', function(d,i){
  let xPos = 10;  
  let xPosArr = [];
    let k = 0;
  while(xPosArr.length < consoleArr.length){
    if(k < 3){
      xPosArr.push(xPos);
      xPos += legendXscale.bandwidth() + 10;
      k++;
    }else{
      xPos = 10;
      k = 0;
    }
  }
  return xPosArr[i];
})
    .attr('y', function(d,i){
  let yPos = 30;  
  let yPosArr = [];
  let k = 0;
  while(yPosArr.length < consoleArr.length){
    k++;
    if(k < 4){
      yPosArr.push(yPos);
    }else{
      yPos += 50;
      k = 0;
    }
  }
  return yPosArr[i];
})
    .text(d => d);




        
                
}


$(document).ready(function() {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(response => response.json())
    .then(data => {
       let json = JSON.parse(JSON.stringify(data));
       makeTreeMap(json); // call all previous logic wiht makeTreeMap
    });
});