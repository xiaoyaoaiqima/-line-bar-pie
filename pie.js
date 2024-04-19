
import {tooltip_pie, tooltip_map} from "./tooltip.js";

const svg = d3.select("#pie"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", `translate(${width / 2 - 200},${height / 2})`);

const color = d3.scaleOrdinal([
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
    "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5",
    "#636363", "#e7ba52", "#ad494a", "#d6616b", "#843c39",
    "#de9ed6", "#ce6dbd", "#bd9e39", "#8c6d31", "#cedb9c"
]);

d3.csv("data2021.csv").then(data => {
    data.forEach(d => {
        d.Year = +d.Year;
        d.AnnualChange = +d["Annual-change-in-primary-energy-consumption"];
    });

    const pie = d3.pie()
        .sort(null)
        .value(d => d.AnnualChange);

    const path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    const label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    const arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .on("mouseover", (event, d) => {
            tooltip_pie.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip_pie.html(`Entity: ${d.data.Entity}<br/>Annual Change: ${d.data.AnnualChange}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip_pie.transition()
                .duration(500)
                .style("opacity", 0);
        });

    arc.append("path")
        .attr("d", path)
        .attr("fill", d => color(d.data.Entity));


    // Legend setup
    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(-280,${i * 20 + 20})`);

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d);
}).catch(error => {
    console.error(error);
});
