let makeTreeMap = function (json) {
    let margin = {top: 10, right: 10, bottom: 10, left: 10}
    let svg = d3.select(treeSvg);
    width = 445 - margin.left - margin.right;
    height = 445 - margin.bottom - margin.bottom;
}


$(document).ready(function() {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(response => response.json())
    .then(data => {
       let json = JSON.parse(JSON.stringify(data));
        console.log(json);
    });
});