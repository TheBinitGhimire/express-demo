const express = require("express");
const methodOverride = require('method-override')
const path = require("path");
const fileOperations = require("./fileOperations");

const app = express();
const router = express.Router();

const port = process.env.PORT || 1337;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

router.get("/todos", (req, res) => {
    let data = fileOperations.readJSONFile();
    if (title = req.query.title) {
        data.forEach((element) => {
            if (element.title == title) {
                res.status(200).send(element);
                res.end();
            }
        })
    } else res.status(200).send(data);
});

router.post("/todos", (req, res) => {
    let data = fileOperations.readJSONFile();
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
        fileOperations.writeToFile(data);
    }

    res.redirect("/");
});

router.put("/todos", (req, res) => {
    let data = fileOperations.readJSONFile();
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
    fileOperations.writeToFile(data);

    res.redirect("/");
});

router.patch("/todos", (req, res) => {
    let data = fileOperations.readJSONFile();
    const title = req.body.existingTitle;
    const selected = req.body.modify;
    const newValue = eval(`req.body.new${selected}`);

    data.forEach((element) => {
        if (element.title == title) {
            element[selected.toLowerCase()] = newValue;
        }
    });
    fileOperations.writeToFile(data);

    res.redirect("/");
});

router.delete("/todos", (req, res) => {
    let data = fileOperations.readJSONFile();
    data.forEach((element) => {
        if (element.title == req.body.title) {
            data.splice(data.indexOf(element), 1);
        }
    });
    fileOperations.writeToFile(data);

    res.redirect("/");
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "add.html"));
})

app.use("/", router);

app.listen(port, () => {
    console.log(`The server is running at port ${port}`);
});