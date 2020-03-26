import * as d3 from 'd3';

const colorsSingle = ["rgb(46,204,113)", "rgb(231,76,60)"];
const colorsMulti= ["rgb(46,204,113)", "rgb(231,76,60)", "rgb(52,152,219)"];

const draw_line_graph = (array, container, width = 364, height = 354) => {
    // console.log(array);
    // Finding MAX and MIN values for multi-line graphs
    console.log(array);
    let xArray = [];
    let yArray = [];

    for (let j = 0; j < array.length; j++) {
        for (let k = 0; k < array[j].data.length; k++) {
            yArray.push(array[j].data[k][array[j].metric]);
            xArray.push(array[j].data[k].date);
        }
    }

    const largestY = Math.max.apply(Math, yArray);
    const smallestY = Math.min.apply(Math, yArray);
    const marginY = Math.abs(largestY) * 0.05;
    const largestX =  Math.max.apply(Math, xArray);
    const smallestX =  Math.min.apply(Math, xArray);

    // Define graph dimensions
    const margin = { top: 0, right: 75, bottom: 30, left: 75 };
    // const height = width - margin.bottom - margin.top;

    // Define number formating
    let numberFormatYAxis = Math.abs(largestY) > 1000 ? "~s" : ".2f";

    let svg = d3.select(container);
    svg.selectAll("*").remove();

    svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    // Define X-Axis Scale
    const scaleX = d3.scaleTime()
        .domain([smallestX, largestX])
        .range([ 0, width]);

    // Define Y-Axis Scale
    const scaleY = d3.scaleLinear()
        .domain([smallestY - marginY, largestY + marginY])
        .range([height, 0 ]);

    // Create X-Axis Grid
    const make_x_gridlines = () => {		
        return d3.axisBottom(scaleX)
            .ticks(5)
    }

    // Create Y-Axis Grid
    const make_y_gridlines = () => {		
        return d3.axisLeft(scaleY)
            .ticks(5)
    }

    // Add X-Axis Grid
    svg.append("g")			
      .attr("class", "grid")
      .attr("stroke","rgba(112, 112, 112)")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      );

    // Add Y-Axis Grid
    svg.append("g")			
    .attr("class", "grid")
    .attr("stroke","rgb(112, 112, 112)")
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    );

    // Add X-Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(scaleX).ticks(5).tickPadding(10));

    // Add Y-Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(scaleY).tickPadding(20).tickFormat(d3.format(numberFormatYAxis)));

    // // Add paths using this helper function
    for (let i = 0; i < array.length; i++) {
        let metric = array[i].metric;

        // Prepare helper function lineFunc
        let lineFunc = d3.line()
            .x((d) => { return scaleX(d.date) })
            .y((d) => { return scaleY(d[metric]) })

        const startDatum = array[i].data[0];
        const endDatum = array[i].data[array[i].data.length - 1];
        let lineColor;
        if (array.length > 1) {
            lineColor = colorsMulti[i];
        } else {
            lineColor = ((endDatum[metric] - startDatum[metric]) / startDatum[metric]) > 0 ? colorsSingle[0] : colorsSingle[1];
        }
        
        // Add path
        let path = svg.append('path')
            .attr('d', lineFunc(array[i].data))
            .attr('stroke', lineColor)
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr('fill', 'none')
            .attr("id", (d) => { return ("path_" + i)});

        let totalLength = path.node().getTotalLength();

        // Add path animation
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
                .duration(1000)
                .ease(d3.easeQuad)
                .attr("stroke-dashoffset", 0);
        
        path.exit().remove();
    }
}

export { draw_line_graph };