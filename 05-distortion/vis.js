// based on https://observablehq.com/@d3/brush-filter?collection=@d3/d3-brush
// https://observablehq.com/@d3/focus-context


window.onload = function () {
    const step = 1

    switch (step) {
        case 0:
            fisheyeGrid();
            break;

        case 1:
            force();
            break;

    }
}

function fisheyeGrid() {
    const width = 960,
        height = 180,
        xStepsBig = d3.range(10, width, 16),
        yStepsBig = d3.range(10, height, 16),
        xStepsSmall = d3.range(0, width + 6, 6),
        yStepsSmall = d3.range(0, height + 6, 6);

    const fisheye = d3.fisheye.circular()
        .focus([360, 90])
        .radius(100);

    const line = d3.line();

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(-.5,-.5)");

    svg.append("rect")
        .attr("fill", "white")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll(".x")
        .data(xStepsBig)
        .enter().append("path")
        .attr("stroke", "black")
        .attr("fill", "none")
        .datum(function (x) {
            return yStepsSmall.map(function (y) {
                return [x, y];
            });
        });

    svg.selectAll(".y")
        .data(yStepsBig)
        .enter().append("path")
        .attr("stroke", "black")
        .attr("fill", "none")
        .datum(function (y) {
            return xStepsSmall.map(function (x) {
                return [x, y];
            });
        });

    const path = svg.selectAll("path")
        .attr("d", fishline);

    svg.on("mousemove", function (event) {
        fisheye.focus(d3.pointer(event));
        path.attr("d", fishline);
    });

    function fishline(d) {
        return line(d.map(function (d) {
            d = fisheye({x: d[0], y: d[1]});
            return [d.x, d.y];
        }));
    }
}

function force() {
    //Width and height
    const w = 800;
    const h = 600;
    const r = 10;
    //Original data
    let dataset = {
        nodes: [
            {name: "Adam"},
            {name: "Bob"},
            {name: "Carrie"},
            {name: "Donovan"},
            {name: "Edward"},
            {name: "Felicity"},
            {name: "George"},
            {name: "Hannah"},
            {name: "Iris"},
            {name: "Jerry"},
            {name: "Adam"},
            {name: "Bob"},
            {name: "Carrie"},
            {name: "Donovan"},
            {name: "Edward"},
            {name: "Felicity"},
            {name: "George"},
            {name: "Hannah"},
            {name: "Iris"},
            {name: "Jerry"},
            {name: "Adam"},
            {name: "Bob"},
            {name: "Carrie"},
            {name: "Donovan"},
            {name: "Edward"},
            {name: "Felicity"},
            {name: "George"},
            {name: "Hannah"},
            {name: "Iris"},
            {name: "Jerry"}
        ],
        edges: [

        ]

    };

    for (let i = 0; i < dataset.nodes.length; i++){
        for(let j = i + 1; j < dataset.nodes.length; j++){
            dataset.edges.push({source: i, target:j});
        }
    }
    //Initialize a simple force layout, using the nodes and edges in dataset
    var force = d3.forceSimulation(dataset.nodes)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("link", d3.forceLink(dataset.edges).distance(150))
        .force("center", d3.forceCenter().x(w / 2).y(h / 2));

    var colors = d3.scaleOrdinal(d3.schemeCategory10);
    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Create edges as lines
    var edges = svg.selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);


    //Create nodes as circles
    let nodes = svg.selectAll("circle")
        .data(dataset.nodes)
        .enter()
        .append("circle")
        .attr("r", r)
        .style("fill", function (d, i) {
            return colors(i);
        })

    //Add a simple label
    let labels = svg.selectAll("text")
        .data(dataset.nodes)
        .enter()
        .append("text")
        .attr("font-family", "Arial")
        .attr("font-size", "9px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "before-edge")
        .text(function (d) {
            return d.name;
        });

    //Every time the simulation "ticks", this will be called
    force.on("tick", function () {
        edges.attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        nodes.attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);

        labels.attr("x", (d) => d.x)
            .attr("y", (d) => d.y + r);
    });

    const fisheye = d3.fisheye.circular()
        .radius(120);

    svg.on("mousemove", function(event) {
        fisheye.focus(d3.pointer(event));

        nodes.each(function(d) { d.fisheye = fisheye(d); })
            .attr("cx", function(d) { return d.fisheye.x; })
            .attr("cy", function(d) { return d.fisheye.y; })
            .attr("r", function(d) { return d.fisheye.z * r; });

        edges.attr("x1", function(d) { return d.source.fisheye.x; })
            .attr("y1", function(d) { return d.source.fisheye.y; })
            .attr("x2", function(d) { return d.target.fisheye.x; })
            .attr("y2", function(d) { return d.target.fisheye.y; });

        labels.attr("x", function(d) { return d.fisheye.x; })
            .attr("y", function(d) { return d.fisheye.y + d.fisheye.z * r; })
    });
}
