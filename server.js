const express = require("express");
const fs = require("fs");
let methodOverride = require('method-override')
const path = require("path");

const app = express();
const router = express.Router();

const port = process.env.PORT || 1337;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

router.get("/todos", (req, res) => {
    let data = JSON.parse(fs.readFileSync("data.json"));
    if (req.query.title) {
        data.forEach((element) => {
            if (element.title == req.query.title) {
                res.status(200).send(element);
                res.end();
            }
        })
    } else res.status(200).send(data);
});

router.put("/todos", (req, res) => {
    let data = JSON.parse(fs.readFileSync("data.json"));
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;

    data.push({
        title: title,
        description: description,
        status: status
    });
    let newData = JSON.stringify(data);
    fs.writeFile("data.json", newData, (e) => {
        if (e) throw e;
    });
    res.status(200).send(data);
});

router.delete("/todos", (req, res) => {
    let data = JSON.parse(fs.readFileSync("data.json"));
    data.forEach((element) => {
        if (element.title == req.body.title) {
            data.splice(data.indexOf(element), 1);
        }
    });
    let newData = JSON.stringify(data);
    fs.writeFile("data.json", newData, (e) => {
        if (e) throw e;
    });
    res.status(200).send(data);
})

router.patch("/todos", (req, res) => {
    let data = JSON.parse(fs.readFileSync("data.json"));
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;

    data.forEach((element) => {
        if (element.title == req.body.title) {
            element.title = title;
            element.description = description;
            element.status = status;
        }
    });
    let newData = JSON.stringify(data);
    fs.writeFile("data.json", newData, (e) => {
        if (e) throw e;
    });
    res.status(200).send(data);
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "add.html"));
})

app.use("/", router);

app.listen(port, () => {
    console.log(`The server is running at port ${port}`);
});