export const tooltip_map = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("width", "200px")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "#003366")
    .style("color", "white")
    .style("padding", "15px")
    .style("border-radius", "10px")
    .style("border", "1px solid #009688")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "14px")
    .style("line-height", "1.4")
    .style("pointer-events", "none");

export const tooltip_pie = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("width", "200px")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "#F44336") // 鲜艳的红色
    .style("color", "white")
    .style("padding", "15px")
    .style("border-radius", "20px") // 更大的圆角
    .style("border", "2px solid #FFC107") // 橙黄色的边框
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "14px")
    .style("line-height", "1.4")
    .style("pointer-events", "none");
