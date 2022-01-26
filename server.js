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

router.post("/todos", (req, res) => {
    let data = JSON.parse(fs.readFileSync("data.json"));
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;

    let exists = false;
    data.forEach((element) => {
        if (element.title == title) {
            exists = true;
        }
    });

    if (!exists) {
        data.push({
            title: title,
            description: description,
            status: status
        });
        let newData = JSON.stringify(data);
        fs.writeFile("data.json", newData, (e) => {
            if (e) throw e;
        });
    }

    res.redirect("/");
});

router.put("/todos", (req, res) => {
    let data = JSON.parse(fs.readFileSync("data.json"));
    const title = req.body.existingTitle;
    const newTitle = req.body.newTitle;
    const description = req.body.newDescription;
    const status = req.body.newStatus;

    data.forEach((element) => {
        if (element.title == title) {
            element.title = newTitle;
            element.description = description;
            element.status = status;
        }
    });
    let newData = JSON.stringify(data);
    fs.writeFile("data.json", newData, (e) => {
        if (e) throw e;
    });

    res.redirect("/");
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

    res.redirect("/");
})

router.patch("/todos", (req, res) => {
    let data = JSON.parse(fs.readFileSync("data.json"));
    const title = req.body.existingTitle;
    const selected = req.body.modify;
    const newValue = eval(`req.body.new${selected}`);

    data.forEach((element) => {
        if (element.title == title) {
            element[selected.toLowerCase()] = newValue;
        }
    });
    let newData = JSON.stringify(data);
    fs.writeFile("data.json", newData, (e) => {
        if (e) throw e;
    });

    res.redirect("/");
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "add.html"));
})

app.use("/", router);

app.listen(port, () => {
    console.log(`The server is running at port ${port}`);
});