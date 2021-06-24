
window.onload = function () {
    const step = 5

    switch (step) {
        case 0:
            staticLine().then();
            break;

        case 1:
            staticLine().then(
                (vis) => {
                    revealLine(vis);
                }

            )
            break;

        case 2:
            staticLine().then(
                (vis) => {
                    timedLine(vis)
                }
            )
            break;

        case 3:
            staticLine().then(
                (vis) => {
                    revealLineGradient(vis);
                }
            );
            break;


        case 4:
            staticLine().then(
                (vis) => {
                    yearTransition(vis);
                }
            )
            break;

        case 5:
            barChartRace().then();
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

    vis.line = d3.line().x(d => vis.x(d.date)).y(d => vis.y(d.close))

    vis.path = vis.svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-miterlimit", 1)
        .attr("d", vis.line(vis.data));
    vis.svg.append("g")
        .call(vis.xAxis);

    vis.svg.append("g")
        .call(vis.yAxis);

    return vis;

}

function revealLine(vis){
    reveal = path => path.transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attrTween("stroke-dasharray", function() {
            const length = this.getTotalLength();
            return d3.interpolate(`0,${length}`, `${length},${length}`);
        })

    reveal(vis.path)
}

function timedLine(vis){
    let t = 0.0;
    const length = vis.path.node().getTotalLength();
    const animationLoop = () => {
        t += 0.001
        vis.path.attr("stroke-dasharray",`${length*t},${length}`);
    };


    let rep = setInterval(animationLoop, 10);


}

function revealLineGradient(vis){
    reveal = path => path.transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attrTween("stroke-dasharray", function() {
            const length = this.getTotalLength();
            return d3.interpolate(`0,${length}`, `${length},${length}`);
        })
        .attrTween("stroke", function(){
            return d3.interpolateRgb("steelblue", "orange");
        })

    reveal(vis.path)
}

function yearTransition(vis){
    vis.zx = vis.x.copy(); // x, but with a new domain.
    vis.gx = vis.svg.append("g")
        .call(vis.xAxis, vis.zx);

    vis.line = d3.line()
        .x(d => vis.zx(d.date))
        .y(d => vis.y(d.close));



    Object.assign(vis.svg.node(), {
        update(domain) {
            const t = vis.svg.transition().duration(750);
            vis.zx.domain(domain);
            vis.gx.transition(t).call(vis.xAxis, vis.zx);
            vis.path.transition(t).attr("d", vis.line(vis.data));
        }
    });

    // keep only one of this

    const timeframe = [new Date("2009-01-01"), new Date("2010-01-01")];
    //const timeframe = [new Date("2010-01-01"), new Date("2011-01-01")];
    //const timeframe = [new Date("2011-01-01"), new Date("2012-01-01")];

    setTimeout( () => {
        vis.svg.node().update(timeframe)
    }, 2000);

}

async function barChartRace(){
    const data = await d3.csv("category-brands.csv", d3.autoType);
    const duration = 250;
    const n = 12;
    const k = 10;
    const height = 598;
    const width = 800;
    const barSize = 48;
    const margin = ({top: 16, right: 6, bottom: 6, left: 0})

    let names = new Set(data.map(d => d.name))

    function rank(value) {
        const data = Array.from(names, name => ({name, value: value(name)}));
        data.sort((a, b) => d3.descending(a.value, b.value));
        for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
        return data;
    }

    const datevalues = Array.from(d3.rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a, b))
    const keyframes = [];
    let ka, a, kb, b;
    for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
            const t = i / k;
            keyframes.push([
                new Date(ka * (1 - t) + kb * t),
                rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
            ]);
        }
    }
    keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);

    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)

    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))

    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))

    const scale = d3.scaleOrdinal(d3.schemeTableau10);
    const categoryByName = new Map(data.map(d => [d.name, d.category]))
    scale.domain(Array.from(categoryByName.values()));



    function bars(svg) {
        let bar = svg.append("g")
            .attr("fill-opacity", 0.6)
            .selectAll("rect");

        return ([date, data], transition) => bar = bar
            .data(data.slice(0, n), d => d.name)
            .join(
                enter => enter.append("rect")

                    .attr("height", y.bandwidth())
                    .attr("x", x(0))
                    .attr("y", d => y((prev.get(d) || d).rank))
                    .attr("width", d => x((prev.get(d) || d).value) - x(0)),
                update => update
                    ,
                exit => exit.transition(transition).remove()
                    .attr("y", d => y((next.get(d) || d).rank))
                    .attr("width", d => x((next.get(d) || d).value) - x(0))
            )
            .call(bar => bar.transition(transition)
                .attr("y", d => y(d.rank))
                .attr("width", d => x(d.value) - x(0)))
                .attr("fill", d => scale(categoryByName.get(d.name)))
    }

    function labels(svg) {
        let label = svg.append("g")
            .style("font", "bold 12px var(--sans-serif)")
            .style("font-variant-numeric", "tabular-nums")
            .attr("text-anchor", "end")
            .selectAll("text");

        return ([date, data], transition) => label = label
            .data(data.slice(0, n), d => d.name)
            .join(
                enter => enter.append("text")
                    .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
                    .attr("y", y.bandwidth() / 2)
                    .attr("x", -6)
                    .attr("dy", "-0.25em")
                    .text(d => d.name)
                    .call(text => text.append("tspan")
                        .attr("fill-opacity", 0.7)
                        .attr("font-weight", "normal")
                        .attr("x", -6)
                        .attr("dy", "1.15em")),
                update => update,
                exit => exit.transition(transition).remove()
                    .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
                    .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
            )
            .call(bar => bar.transition(transition)
                .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
                .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))))
    }

    const formatNumber = d3.format(",d")
    function textTween(a, b) {
        const i = d3.interpolateNumber(a, b);
        return function(t) {
            this.textContent = formatNumber(i(t));
        };
    }

    function axis(svg) {
        const g = svg.append("g")
            .attr("transform", `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
            .ticks(width / 160)
            .tickSizeOuter(0)
            .tickSizeInner(-barSize * (n + y.padding()));

        return (_, transition) => {
            g.transition(transition).call(axis);
            g.select(".tick:first-of-type text").remove();
            g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
            g.select(".domain").remove();
        };
    }

    const formatDate = d3.utcFormat("%Y")
    function ticker(svg) {
        const now = svg.append("text")
            .style("font-size", "48px")
            .style("font-weight", "bold")
            .style("font-variant-numeric", "tabular-nums")
            .attr("text-anchor", "end")
            .attr("x", width - 6)
            .attr("y", margin.top + barSize * (n - 0.45))
            .attr("dy", "0.32em")
            .text(formatDate(keyframes[0][0]));

        return ([date], transition) => {
            transition.end().then(() => now.text(formatDate(date)));
        };
    }



    const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right])

    const y = d3.scaleBand()
        .domain(d3.range(n + 1))
        .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
        .padding(0.1)



    const svg =  d3.select('body')
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);





    for (const keyframe of keyframes) {
        const transition = svg.transition()
            .duration(duration)
            .ease(d3.easeLinear);

        // Extract the top bar’s value.
        x.domain([0, keyframe[1][0].value]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition);
        updateLabels(keyframe, transition);
        updateTicker(keyframe, transition);

        await transition.end();
    }
}

