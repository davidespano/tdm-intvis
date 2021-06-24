// based on https://observablehq.com/@d3/brush-filter?collection=@d3/d3-brush
// https://observablehq.com/@d3/focus-context


window.onload = function () {
    const step = 3

    switch (step) {
        case 0:
            scatter();
            break;

        case 1:
            const vis = scatter();
            addBrush(vis);
            break;

        case 2:
            focus().then(
                (focus) => {
                    context(focus).then()
                }
            );
            break;

        case 3:
            smallMultiple().then();
            break;
    }
}

function scatter() {

    let vis = {};
    vis.width = document.querySelector('body').clientWidth
    vis.height = 500;

    vis.ry = d3.randomUniform(0, vis.height)
    vis.rx = d3.randomUniform(0, vis.width)

    vis.svg = d3.select('body')
        .append("svg")
        .attr("viewBox", [0, 0, vis.width, vis.height]);

    vis.circle = vis.svg.append("g")
        .attr("fill-opacity", 0.2)
        .selectAll("circle")
        .data(Array.from({length: 2000}, () => [vis.rx(), vis.ry()]))
        .join("circle")
        .attr("transform", d => `translate(${d})`)
        .attr("r", 3.5);

    return vis;

}

function addBrush(vis){
    vis.brush = d3.brush()
        .filter(event => !event.ctrlKey
            && !event.button
            && (event.metaKey
                || event.target.__data__.type !== "overlay"))
        .on("start brush end", brushed);

    vis.svg.append("g")
        .attr("class", "brush")
        .call(vis.brush)
        .call(vis.brush.move, [[100, 100], [200, 200]])
        .call(g => g.select(".overlay").style("cursor", "default"));

    function brushed({selection}) {
        if (selection === null) {
            vis.circle.attr("stroke", null);
        } else {
            const [[x0, y0], [x1, y1]] = selection;
            vis.circle.attr("stroke", ([x, y]) => {
                return x0 <= x && x <= x1
                && y0 <= y && y <= y1
                    ? "red" : null;
            });
        }
    }
}


async function focus(){
    let focus = {}
    focus.width = document.querySelector('body').clientWidth
    focus.height = 400;
    focus.data = await d3.csv("aapl.csv", d3.autoType);
    focus.margin = ({top: 20, right: 20, bottom: 30, left: 40})

    focus.svg = d3.select('body')
        .append("svg")
        .attr("class", "focus")
        .attr("viewBox", [0, 0, focus.width, focus.height])
        .style("display", "block");

    const clipId = "clipId"

    focus.svg.append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", focus.margin.left)
        .attr("y", 0)
        .attr("height", focus.height)
        .attr("width", focus.width - focus.margin.left - focus.margin.right);

    focus.gx = focus.svg.append("g");

    focus.gy = focus.svg.append("g");

    focus.y = d3.scaleLinear()
        .domain([0, d3.max(focus.data, d => d.value)])
        .range([focus.height - focus.margin.bottom, focus.margin.top])

    focus.x = d3.scaleUtc()
        .domain(d3.extent(focus.data, d => d.date))
        .range([focus.margin.left, focus.width - focus.margin.right])

    focus.yAxis = (g, y, title) => g
        .attr("transform", `translate(${focus.margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".title").data([title]).join("text")
            .attr("class", "title")
            .attr("x", -focus.margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(title))

    focus.xAxis = (g, x, height) => g
        .attr("transform", `translate(0,${height - focus.margin.bottom})`)
        .call(d3.axisBottom(x).ticks(focus.width / 80).tickSizeOuter(0))



    focus.area = (x, y) => d3.area()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.value))

    focus.path = focus.svg.append("path")
        .datum(focus.data)
        .attr("clip-path", clipId)
        .attr("fill", "steelblue");




     Object.assign(focus, {
        update(focusX, focusY) {
            focus.gx.call(focus.xAxis, focusX, focus.height);
            focus.gy.call(focus.yAxis, focusY, focus.data.y);
            focus.path.attr("d", focus.area(focusX, focusY));
        }
    });

     return focus;
}

async function context(focus){
    let ctx = {};
    ctx.ctxHeight = 100;
    ctx.width = document.querySelector('body').clientWidth
    ctx.margin = ({top: 20, right: 20, bottom: 30, left: 40})

    ctx.data = await d3.csv("aapl.csv", d3.autoType);


    ctx.xAxis = (g, x, height) => g
        .attr("transform", `translate(0,${height - ctx.margin.bottom})`)
        .call(d3.axisBottom(x).ticks(ctx.width / 80).tickSizeOuter(0))

    ctx.y = d3.scaleLinear()
        .domain([0, d3.max(ctx.data, d => d.value)])
        .range([ctx.ctxHeight - ctx.margin.bottom, ctx.margin.top])

    ctx.x = d3.scaleUtc()
        .domain(d3.extent(ctx.data, d => d.date))
        .range([ctx.margin.left, ctx.width - ctx.margin.right])


    ctx.area = (x, y) => d3.area()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.value))
    
    ctx.svg = d3.select('body')
        .append("svg")
        .attr("class", "ctx")
        .attr("viewBox", [0, 0, ctx.width, ctx.ctxHeight])
        .style("display", "block");

    ctx.update = function() {
        const [minX, maxX] = ctx.svg.property("value");
        const maxY = d3.max(ctx.data, d => minX <= d.date && d.date <= maxX ? d.value : NaN);
        focus.update(focus.x.copy().domain([minX, maxX]), focus.y.copy().domain([0, maxY]));
    }

    ctx.brush = d3.brushX()
        .extent([[ctx.margin.left, 0.5], [ctx.width - ctx.margin.right, ctx.ctxHeight - ctx.margin.bottom + 0.5]])
        .on("brush", brushed)
        .on("end", brushended);

    ctx.defaultSelection = [ctx.x(d3.utcYear.offset(ctx.x.domain()[1], -1)), ctx.x.range()[1]];

    ctx.svg.append("g")
        .call(ctx.xAxis, ctx.x, ctx.ctxHeight);

    ctx.svg.append("path")
        .datum(ctx.data)
        .attr("fill", "steelblue")
        .attr("d", ctx.area(
            ctx.x, ctx.y.copy().range([ctx.ctxHeight - ctx.margin.bottom, 4])));

    ctx.gb = ctx.svg.append("g")
        .call(ctx.brush)
        .call(ctx.brush.move, ctx.defaultSelection);

    function brushed({selection}) {
        if (selection) {
            ctx.svg.property("value", selection.map(ctx.x.invert, ctx.x).map(d3.utcDay.round));
            ctx.svg.dispatch("input");
            ctx.update()
        }
    }

    function brushended({selection}) {
        if (!selection) {
            ctx.gb.call(ctx.brush.move, ctx.defaultSelection);

        }
    }



}

async function smallMultiple(){
    const padding = 28;
    const width = 954;
    const data = await d3.csv("penguins.csv", d3.autoType);
    const columns = data.columns.filter(d => typeof data[0][d] === "number")
    const size = (width - (columns.length + 1) * padding) / columns.length + padding;

    const x = columns.map(c => d3.scaleLinear()
        .domain(d3.extent(data, d => d[c]))
        .rangeRound([padding / 2, size - padding / 2]));

    const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));

    const z = d3.scaleOrdinal()
        .domain(data.map(d => d.species))
        .range(d3.schemeCategory10)

    const xaxis = d3.axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
    const xAxis = function(g){

        g.selectAll("g").data(x).join("g")
            .attr("transform", (d, i) => `translate(${i * size},0)`)
            .each(function(d) { return d3.select(this).call(xaxis.scale(d)); })
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
    }

    const yaxis = d3.axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
    const yAxis = function(g) {

        g.selectAll("g").data(y).join("g")
            .attr("transform", (d, i) => `translate(0,${i * size})`)
            .each(function(d) { return d3.select(this).call(yaxis.scale(d)); })
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
    }

    function brush(cell, circle, svg) {
        const brush = d3.brush()
            .extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]])
            .on("start", brushstarted)
            .on("brush", brushed)
            .on("end", brushended);

        cell.call(brush);

        let brushCell;

        // Clear the previously-active brush, if any.
        function brushstarted() {
            if (brushCell !== this) {
                d3.select(brushCell).call(brush.move, null);
                brushCell = this;
            }
        }

        // Highlight the selected circles.
        function brushed({selection}, [i, j]) {
            let selected = [];
            if (selection) {
                const [[x0, y0], [x1, y1]] = selection;
                circle.classed("hidden",
                    d => x0 > x[i](d[columns[i]])
                        || x1 < x[i](d[columns[i]])
                        || y0 > y[j](d[columns[j]])
                        || y1 < y[j](d[columns[j]]));
                selected = data.filter(
                    d => x0 < x[i](d[columns[i]])
                        && x1 > x[i](d[columns[i]])
                        && y0 < y[j](d[columns[j]])
                        && y1 > y[j](d[columns[j]]));
            }
            svg.property("value", selected).dispatch("input");
        }

        // If the brush is empty, select all circles.
        function brushended({selection}) {
            if (selection) return;
            svg.property("value", []).dispatch("input");
            circle.classed("hidden", false);
        }
    }

    const svg = d3.select('body')
        .append("svg")
        .attr("viewBox", [-padding, 0, width, width]);

    svg.append("style")
        .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    svg.append("g")
        .attr("class", "xAxis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis);

    const cell = svg.append("g")
        .selectAll("g")
        .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
        .join("g")
        .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);

    cell.append("rect")
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("x", padding / 2 + 0.5)
        .attr("y", padding / 2 + 0.5)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.each(function([i, j]) {
        d3.select(this).selectAll("circle")
            .data(data.filter(d => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
            .join("circle")
            .attr("cx", d => x[i](d[columns[i]]))
            .attr("cy", d => y[j](d[columns[j]]));
    });

    const circle = cell.selectAll("circle")
        .attr("r", 3.5)
        .attr("fill-opacity", 0.7)
        .attr("fill", d => z(d.species));

    cell.call(brush, circle, svg);

    svg.append("g")
        .style("font", "bold 10px sans-serif")
        .style("pointer-events", "none")
        .selectAll("text")
        .data(columns)
        .join("text")
        .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(d => d);

    svg.property("value", [])


}
