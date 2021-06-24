

window.onload = function () {
    const step = 2

    switch (step) {
        case 0:
            staticLine().then()

        case 1:
            staticLine().then(
                (vis) => {
                    addPointTooltips(vis);
                }
            );
            break;

        case 2:
            staticLine().then(
                (vis) => {
                    addRectTooltips(vis);
                }
            );
            break;

        case 3:
            staticLine().then(
                (vis) => {
                    addVoronoiTooltips(vis);
                }
            );
            break;

        case 4:
            staticLine().then(
                (vis) => {
                    addCustomTooltips(vis);
                }
            );
            break;
    }
}

async function staticLine() {

    let vis = {};
    vis.width = document.querySelector('body').clientWidth
    vis.height = 250;




    vis.margin = ({top: 20, right: 30, bottom: 30, left: 40})
    vis.svg = d3.select('body')
        .append("svg")
        .attr("viewBox", [0, 0, vis.width, vis.height]);

    vis.data = await d3.csv("aapl-bollinger.csv", d3.autoType);

    vis.yAxis = g => g
        .attr("transform", `translate(${vis.margin.left},0)`)
        .call(d3.axisLeft(vis.y).ticks(vis.height / 40))
        .call(g => g.select(".domain").remove())

    vis.xAxis = g => g
        .attr("transform", `translate(0,${vis.height - vis.margin.bottom})`)
        .call(d3.axisBottom(vis.x).ticks(vis.width / 80).tickSizeOuter(0))

    vis.y = d3.scaleLinear()
        .domain([0, d3.max(vis.data, d => d.upper)])
        .range([vis.height - vis.margin.bottom, vis.margin.top])

    vis.x = d3.scaleUtc()
        .domain(d3.extent(vis.data, d => d.date))
        .range([vis.margin.left, vis.width - vis.margin.right])

    let line = d3.line().x(d => vis.x(d.date)).y(d => vis.y(d.close))

    vis.svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-miterlimit", 1)
        .attr("d", line(vis.data));

    vis.svg.append("g")
        .call(vis.xAxis);

    vis.svg.append("g")
        .call(vis.yAxis);



    //svg.append(() => tooltip.node);

    return vis;

}

function addPointTooltips(vis){
    const formatClose = d3.format("$.2f")
    const formatDate = d3.utcFormat("%b %-d, ’%y")

    vis.svg.selectAll("circle")
        .data(d3.pairs(vis.data))
        .join("circle")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("cx", ([a, b]) => vis.x(a.date))
        .attr("cy", ([a, b]) => vis.y(a.close))
        .attr("r",  ([a, b]) => vis.x(b.date) - vis.x(a.date))
        .append('title')
        .text( ([a, b]) => `${formatDate(a.date)} \n ${formatClose(a.close)}`)

}

function addRectTooltips(vis){
    const formatClose = d3.format("$.2f")
    const formatDate = d3.utcFormat("%b %-d, ’%y")
    const rects = vis.svg.append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .selectAll("rect")
        .data(d3.pairs(vis.data))
        .join("rect")
        .attr("x", ([a, b]) => vis.x(a.date))
        .attr("height", vis.height)
        .attr("width", ([a, b]) => vis.x(b.date) - vis.x(a.date))

    rects
        .append('title')
        .text( ([a, b]) => `${formatDate(a.date)} \n ${formatClose(a.close)}`)
}

function addVoronoiTooltips(vis){
    const formatClose = d3.format("$.2f")
    const formatDate = d3.utcFormat("%b %-d, ’%y")

    let voronoi = d3.Delaunay
        .from(vis.data, d => vis.x(d.date), d => vis.y(d.close))
        .voronoi([0, 0, vis.width, vis.height])

    const overlay = vis.svg.append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("stroke", "red")
        .selectAll("path")
        .data(vis.data)
        .join("path")
        .attr("d", (d, i) => `${voronoi.renderCell(i)}`)

    overlay
        .append('title')
        .text(d => `${formatDate(d.date)} \n ${formatClose(d.close)}`)

}

function addCustomTooltips(vis){
    const formatClose = d3.format("$.2f")
    const formatDate = d3.utcFormat("%b %-d, ’%y")

    let tooltipBack = vis.svg.append("g")
        .attr("class", "tooltip")
        .attr("pointer-events", "none")

    let tooltipBox = tooltipBack
        .append("rect")
        .attr("x", -27)
        .attr("y", -30)
        .attr("width", 54)
        .attr("height", 20)
        .attr("fill", "white")


    let textDate = tooltipBack.append("text")
        .attr("y", -22)
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")

    let textClose = tooltipBack.append("text")
        .attr("y", -12)
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")

    let highlight = tooltipBack.append("circle")
        .attr("r", 2.5)


    const rects = vis.svg.append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .selectAll("rect")
        .data(d3.pairs(vis.data))
        .join("rect")
        .attr("x", ([a, b]) => vis.x(a.date))
        .attr("height", vis.height)
        .attr("width", ([a, b]) => vis.x(b.date) - vis.x(a.date))

    rects
        .on("mouseover", (e, [a, b]) => {
            tooltipBack
                .attr("display", "")
                .attr("transform", `translate(${vis.x(a.date)},${vis.y(a.close)})`)
            textDate.text(formatDate(a.date))
            textClose.text(formatClose(a.close))
        })
}

