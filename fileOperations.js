const fs = require("fs");

exports.readJSONFile = () => {
    return JSON.parse(fs.readFileSync("data.json"));
}

exports.writeToFile = (data) => {
    fs.writeFile("data.json", JSON.stringify(data), (e) => {
        if (e) throw e;
    });
    console.log(data)
}

