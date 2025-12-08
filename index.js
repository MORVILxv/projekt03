import express from "express";
import { DatabaseSync } from "node:sqlite";
import {getTankMuseumData, getTanks, addTank, getAbout, db_ops, populate} from './db_operations.js';



// var result = db.prepare("INSERT INTO tanks (nation, name) VALUES ('test1', 'kategoria testowa');").run();
// console.log("Insert", result);
// var test_nation = result.lastInsertRowid;

// try {
//   var result = db
//     .prepare(
//       `INSERT INTO tanks (nation, name) VALUES ('test1', 'kategoria zduplikowana');`
//     )
//     .run();
//   console.log("Insert duplicate", result);
// } catch (error) {
//   console.log(error);
// }

// try {
//   var result = db.prepare(`INSERT INTO tanks (nation) VALUES ('no-name');`).run();
//   console.log("Insert without name", result);
// } catch (error) {
//   console.log(error);
// }

// try {
//   var result = db
//     .prepare(`INSERT INTO tanks (name) VALUES ('Kategoria bez nation');`)
//     .run();
//   console.log("Insert without nation", result);
// } catch (error) {
//   console.log(error);
// }

populate();





console.dir(db_ops.select_tanks.all(), { compact: true, depth: null });

const port = 8000;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());


app.get("/", (req, res) => {
    res.render("none", {name: "Main"});
})

app.get("/all", (req, res) => {
    res.render("names", {
        name: "Subsites", 
        mname: getTankMuseumData()[0],
        aname: getAbout()[0]
    })
});

app.get("/all/tankmuseum", (req, res) => {
    //const data = getTankMuseumData();
    const a = db_ops.select_info.get().name;
    const data = db_ops.select_tanks.all();
    if (data != null) {
        res.render("tanks", {
            name: "List of tanks", 
            a: a,
            data: data,
        });
    } else {
        res.sendStatus(404);
    }
});

app.get("/all/about", (req, res) => {
    const data = getAbout();
    if (data != null) {
        res.render("about", {
            name: "About Us", 
            data: data,
        });
    } else {
        res.sendStatus(404);
    }
});

app.post("/all/tankmuseum/new", (req, res) => {
    addTank(req.body.country, req.body.tankName);
    res.redirect(`/all/tankmuseum`);
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});