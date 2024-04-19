d3.csv("data.csv").then(data => {
    const entities = new Set();
    const codes = new Set();
    const years = new Set();

    data.forEach(d => {
        entities.add(d.Entity);
        codes.add(d.Code);
        years.add(d.Year);
    });

    console.log("Entities: " + Array.from(entities).join(", "));
    console.log("Codes: " + Array.from(codes).join(", "));
    console.log("Years: " + Array.from(years).join(", "));
}).catch(error => {
    console.error("Error reading CSV file:", error);
});
