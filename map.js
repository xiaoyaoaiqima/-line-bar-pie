import {tooltip_pie, tooltip_map} from "./tooltip.js";

const svg = d3.select("#map"),
  width = 800,
  height = 500,
  projection = d3
    .geoEquirectangular()
    .translate([width / 2, height / 2])
    .scale(200),
  path = d3.geoPath().projection(projection);

Promise.all([
  d3.csv("./data.csv"),
  d3.json("https://unpkg.com/world-atlas@1/world/110m.json"),
]).then(function ([energyData, worldData]) {
  // 筛选保留 year 列为 2021 的数据
  energyData = energyData.filter(function (d) {
    return d.Year === "2021";
  });
  drawMap(energyData, worldData);
  drawLegend(energyData);
});
function drawMap(energyData, worldData) {
  const energyById = {};
  energyData.forEach((d) => {
    energyById[d.Code_isNo] = {
      combined: +d["Annual-change-in-primary-energy-consumption"],
      codeIsNo: d.Code,
    };
  });

  const countries = topojson.feature(
    worldData,
    worldData.objects.countries
  ).features;

  var educationScale = d3
    .scaleSequential()
    .domain([0, d3.max(energyData, (d) => d['Annual-change-in-primary-energy-consumption'])])
    .interpolator(d3.interpolateReds);
  svg
    .selectAll("path")
    .data(countries)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return educationScale(energyById[d.id]?.combined || 0);
    })
    .on("mouseover", function (event, d) {
      tooltip_map.transition().duration(200).style("opacity", 0.9);
      tooltip_map
        .html(
          "国家代号: " +
            d.id +
            "<br/>能源消费变化情况: " +
            (energyById[d.id]?.combined || "None") +
            "<br/>国家代号: " +
            (energyById[d.id]?.codeIsNo || "None")
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip_map.transition().duration(500).style("opacity", 0);
    });
}


// 画图例
function drawLegend(energyData) {
  const legendScale = d3
    .scaleSequential()
    .domain([0, d3.max(energyData, (d) => d['Annual-change-in-primary-energy-consumption'])])
    .interpolator(d3.interpolateReds);
  console.log(d3.max(energyData, (d) => d['Annual-change-in-primary-energy-consumption']))
  // 绘制图例代码
  const legendWidth = 300,
    legendHeight = 20,
    numStops = 10;
  const legendSvg = d3
    .select("#map_legend")
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight + 40);

  legendSvg
    .selectAll("rect")
    .data(
      d3.range(
        legendScale.domain()[1],
        legendScale.domain()[0],
        -legendScale.domain()[1] / numStops
      )
    )
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (legendWidth / numStops))
    .attr("width", legendWidth / numStops)
    .attr("height", legendHeight)
    .style("fill", (d) => legendScale(d));

  legendSvg
    .selectAll("text")
    .data(
      d3.range(
        legendScale.domain()[1],
        legendScale.domain()[0],
        -legendScale.domain()[1] / numStops
      )
    )
    .enter()
    .append("text")
    .attr("x", (d, i) => (i + 0.5) * (legendWidth / numStops)) // 将文本放在每个矩形条的中心
    .attr("y", legendHeight + 20) // 调整文本在矩形条下方的位置
    .style("fill", "#2F4F4F") // 文本颜色
    .style("font-size", "12px") // 文本大小
    .style("text-anchor", "middle") // 使文本居中对齐
    .text(function (d) {
      return d.toFixed(1); // 显示每个颜色段所代表的数值，保留一位小数
    });
}
