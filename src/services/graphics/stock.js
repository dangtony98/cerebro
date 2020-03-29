import * as d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';
import { decimal_reformat, dollar_reformat } from '../helper/metricReformat';

const colorsSingle = ["rgb(46,204,113)", "rgb(231,76,60)"];
const colorsMulti= ["rgb(46,204,113)", "rgb(52,152,219)", "rgb(230,126,34)"];

const draw_line_graph = (array, container) => {
    // Finding MAX and MIN values for multi-line graphs
    let xArray = [], yArray = [];

    for (let j = 0; j < array.length; j++) {
        for (let k = 0; k < array[j].data.length; k++) {
            yArray.push(array[j].data[k][array[j].metric]);
            xArray.push(array[j].data[k].date);
        }
    }

    const largestY = _.max(yArray), smallestY = _.min(yArray), largestX =  _.max(xArray), smallestX =  _.min(xArray), marginY = Math.abs(largestY - smallestY) * 0.05;

    // Define graph dimensions
    const margin = { top: 40, right: 0, bottom: 40, left: 75 }, 
    width = document.getElementsByClassName(container)[0].offsetWidth - margin.left - margin.right,
    height = width * 3/4;
    
    // Define number formating
    let numberFormatYAxis = Math.abs(largestY) > 1000 ? "~s" : ".2f";
    
    let svg = d3.select(`.${container}`);
    svg.selectAll("*").remove();
    
    svg = d3.select(`.${container}`)
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

    // Create X and Y-Axis Grid
    const make_x_gridlines = () => d3.axisBottom(scaleX).ticks(5);
    const make_y_gridlines = () => d3.axisLeft(scaleY).ticks(5)

    // Add X-Axis Grid
    // svg.append("g")			
    //   .attr("class", "grid")
    //   .attr("stroke","rgba(112, 112, 112)")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(make_x_gridlines()
    //       .tickSize(-height)
    //       .tickFormat("")
    //   );

    // // Add Y-Axis Grid
    // svg.append("g")			
    // .attr("class", "grid")
    // .attr("stroke","rgb(112, 112, 112)")
    // .call(make_y_gridlines()
    //     .tickSize(-width)
    //     .tickFormat("")
    // );

    // Add X-Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(scaleX).ticks(5).tickPadding(10));

    // Add Y-Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(scaleY).tickPadding(20).tickFormat(d3.format(numberFormatYAxis)));

    // Add Rect Overlay to detect Tooltip
    svg.append("rect")
        .attr("transform", "translate(0," + margin.top + ")")
        .attr("class", "graph-overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent")
        .on("mousemove", mousemove);
    
    // Add Circle
    svg.append("circle")
        .attr("r", 5)
        .attr("fill", "transparent");
    
    // Add Hover Lines
    svg.append("line")
        .attr("class", "x-hover-line hover-line");
    
    svg.append("line")
        .attr("class", "y-hover-line hover-line");

    // Add Datum Text
    svg.append("text")
        .attr("class", "graph-style graph-style--normal")
        .attr("x", -(margin.left))
        .attr("y", -(margin.top / 2));

    // // Add paths using this helper function
    for (let i = 0; i < array.length; i++) {
        let metric = array[i].metric;

        // Prepare helper function lineFunc
        let lineFunc = d3.line()
            .x((d) => { return scaleX(d.date) })
            .y((d) => { return scaleY(d[metric]) })

        let startDatum = array[i].data[0],
            endDatum = array[i].data[array[i].data.length - 1];
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

    let bisectDate = d3.bisector(function(d) { return d.date; }).left;

    function mousemove() {
        let x0 = scaleX.invert(d3.mouse(this)[0]), 
            i = bisectDate(array[0].data, x0),
            metric = array[0].metric,
            d0 = array[0].data[i - 1],
            d1 = array[0].data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;


        svg.select(".x-hover-line").attr("y1", 0).attr("y2", height).attr("x1", scaleX(d.date)).attr("x2", scaleX(d.date));
        svg.select(".y-hover-line").attr("x1", 0).attr("x2", width).attr("y1", scaleY(d[metric])).attr("y2", scaleY(d[metric]));
        svg.select("circle").attr("cx", scaleX(d.date)).attr("cy", scaleY(d[metric])).attr("fill", "black");
        svg.select(".graph-style").text(function() { 
            return `${moment(d.date).format("YYYY-MM-DD")}: ${decimal_reformat(d[metric])}`; 
        });
    }
}

const draw_pie_chart = (array, container) => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }; 
    const colorsMulti= d3.scaleOrdinal(["rgb(46,204,113)", "rgb(52,152,219)", "rgb(230,126,34)"]);

    const width = document.getElementsByClassName(container)[0].offsetWidth - margin.left - margin.right,
    height = width * 3/4,
    radius = Math.min(width, height) / 2;

    let svg = d3.select(container);
    svg.selectAll("*").remove();

    svg = d3.select(`.${container}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
    
    svg.append("text")
        .attr("class", "graph-style graph-style--normal")
        .attr("x", 0)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .text(`Cash: ${dollar_reformat(array[0].value)}`);
    
    svg.append("text")
        .attr("class", "graph-style graph-style--normal")
        .attr("x", 0)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(`Equities: ${dollar_reformat(array[1].value)}`);
    
    const pie = d3.pie()
                    .sort(null)
                    .value((d) => d.value);

    const path = d3.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(radius - 30);

    const arc = svg.selectAll(".arc")
                    .data(pie(array))
                    .enter().append("g")
                    .attr("class", "arc")
        
    
    arc.append("path").attr("d", path).attr("fill", (d) => colorsMulti(d.value));
}

export { draw_line_graph, draw_pie_chart };