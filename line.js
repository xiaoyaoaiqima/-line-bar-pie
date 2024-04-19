// Set the dimensions and margins of the graph
const margin = { top: 10, right: 150, bottom: 30, left: 30 },
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3
  .select("#line")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("./data15.csv").then(function (data) {
  const summedData = d3.group(data, (d) => d.Entity);

  summedData.forEach((group) => {
    group.sort((a, b) => a.Year - b.Year);
  });

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.Year))
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => +d["Annual-change-in-primary-energy-consumption"]),
      100
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  const color = d3.scaleOrdinal([
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
    "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5",
    "#636363", "#e7ba52", "#ad494a", "#d6616b", "#843c39",
    "#de9ed6", "#ce6dbd", "#bd9e39", "#8c6d31", "#cedb9c"
  ]);

  // Draw the line
  summedData.forEach((value, key) => {
    const filteredData = value.filter(d => {
      const annualChange = +d["Annual-change-in-primary-energy-consumption"];
      return annualChange >= -100 && annualChange <= 100;
    });

    svg
        .append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", color(key))
        .attr("stroke-width", 1.5)
        .attr(
            "d",
            d3
                .line()
                .x((d) => x(d.Year))
                .y((d) => y(+d["Annual-change-in-primary-energy-consumption"]))
        );
  });

  svg
    .selectAll("mydots")
    .data(Array.from(summedData.keys()))
    .enter()
    .append("circle")
    .attr("cx", width + 20)
    .attr("cy", (d, i) => i * 25) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", (d) => color(d));

  svg
    .selectAll("mylabels")
    .data(Array.from(summedData.keys()))
    .enter()
    .append("text")
    .attr("x", width + 40)
    .attr("y", (d, i) => i * 25) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", (d) => color(d))
    .text((d) => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
});
