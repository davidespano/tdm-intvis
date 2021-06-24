// https://github.com/d3/d3-zoom
// https://github.com/d3/d3-drag

window.onload = function () {
    const step = 1

    switch (step) {
        case 0:
            choropleth().then();
            break;

        case 1:
            choropleth().then(
                (vis) => {
                    addPan(vis)
                }
            );
            break;

        case 2:
            choropleth().then(
                (vis) => {
                    addPanZoom(vis)
                }
            );
            break;
    }
}

async function choropleth() {
    let vis = {};
    //Width and height
    vis.width = 800;
    vis.height = 600;

    //Define stateMap projection
    vis.projection = d3.geoAlbersUsa();

    //Define path generator
    vis.path = d3.geoPath()
        .projection(vis.projection);

    //Define quantize scale to sort data values into buckets of color
    vis.color = d3.scaleQuantize()
        .range([
            "rgb(237,248,233)", "rgb(186,228,179)",
            "rgb(116,196,118)", "rgb(49,163,84)",
            "rgb(0,109,44)"]);
    //Colors derived from ColorBrewer, by Cynthia Brewer, and included in
    //https://github.com/d3/d3-scale-chromatic

    //Create SVG element
    vis.svg = d3.select("body")
        .append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);




    //Create a container in which all pannable elements will live
    vis.stateMap = vis.svg.append("g")
        .attr("id", "map")


    //Load in agriculture data
    vis.data = await d3.csv("us-ag-productivity.csv", d3.autoType);

    //Set input domain for color scale
    vis.color.domain([
        d3.min(vis.data, function (d) {
            return d.value;
        }),
        d3.max(vis.data, function (d) {
            return d.value;
        })
    ]);

    //Load in GeoJSON data
    vis.json = await d3.json("us-states.json")

    //Merge the ag. data and GeoJSON
    //Loop through once for each ag. data value
    for (let i = 0; i < vis.data.length; i++) {

        //Grab state name
        let dataState = vis.data[i].state;

        //Grab data value, and convert from string to float
        let dataValue = parseFloat(vis.data[i].value);

        //Find the corresponding state inside the GeoJSON
        for (let j = 0; j < vis.json.features.length; j++) {

            let jsonState = vis.json.features[j].properties.name;

            if (dataState == jsonState) {

                //Copy the data value into the JSON
                vis.json.features[j].properties.value = dataValue;

                //Stop looking through the JSON
                break;
            }
        }
    }

    //Bind data and create one path per GeoJSON feature
    let p = vis.stateMap.selectAll("path")
        .data(vis.json.features)
        .enter()
        .append("path")
        .attr("d", vis.path)
        .style("fill", function (d) {
            //Get data value
            let value = d.properties.value;

            if (value) {
                //If value exists…
                return vis.color(value);
            } else {
                //If value is undefined…
                return "#ccc";
            }
        })

    p.append('title')

    return vis;
}

function addPan(vis){
    //The center of the country, roughly
    const center = vis.projection([-97.0, 39.0]);

    // We keep the transform for implementing the dragging function
    let transform = d3.zoomIdentity  //Then apply the initial transform
        .translate(center[0], center[1])

    const transforming = function (e, d) {
        // update the current transformation
        transform = e.transform;
        //New offset array
        let offset = [transform.x, transform.y];

        //Update projection with new offset and scale
        vis.projection.translate(offset)

        //Update all paths and circles
        vis.svg.selectAll("path")
            .attr("d", vis.path);

    };

    //Then define the zoom behavior
    let zoom = d3.zoom()
        .on("zoom", transforming);

    let currX, currY;

    const startDragging = function (e, d){
        currX = transform.invertX(e.x);
        currY = transform.invertY(e.y);
    };

    //Define what to do when dragging
    const dragging = function (e, d) {
        const x = transform.invertX(e.x);
        const y = transform.invertY(e.y);
        vis.stateMap.call(zoom.translateBy, x - currX, y - currY);
    };

    //Then define the drag behavior
    const drag = d3.drag()
        .on("start", startDragging)
        .on("drag", dragging);

    vis.stateMap.call(drag)  //Bind the dragging behavior
        .call(zoom)
        .call(zoom.transform, transform);

}

function addPanZoom(vis) {
    const zoomingSpeed = 2000;

    //The center of the country, roughly
    let center = vis.projection([-97.0, 39.0]);

    // We keep the transform for implementing the dragging function
    let transform = d3.zoomIdentity  //Then apply the initial transform
        .translate(center[0], center[1])
        .scale(0.50)


    const transforming = function (e, d) {
        // update the current transformation
        transform = e.transform;
        //New offset array
        let offset = [transform.x, transform.y];

        //Calculate new scale
        let newScale = transform.k * zoomingSpeed;

        //Update projection with new offset and scale
        vis.projection.translate(offset)
            .scale(newScale);

        //Update all paths and circles
        vis.svg.selectAll("path")
            .attr("d", vis.path);

    };

    //Then define the zoom behavior
    let zoom = d3.zoom()
        .on("zoom", transforming);


    let currX, currY;

    const startDragging = function (e, d){
        currX = transform.invertX(e.x);
        currY = transform.invertY(e.y);
    };

    //Define what to do when dragging
    const dragging = function (e, d) {
            const x = transform.invertX(e.x);
            const y = transform.invertY(e.y);
            vis.stateMap.call(zoom.translateBy, x - currX, y - currY);
    };

    //Then define the drag behavior
    const drag = d3.drag()
        .on("start", startDragging)
        .on("drag", dragging)

    vis.stateMap.call(drag)  //Bind the dragging behavior
        .call(zoom)
        .call(zoom.transform, transform);
}

