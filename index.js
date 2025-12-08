import express from "express";
import { DatabaseSync } from "node:sqlite";
import {getTankMuseumData, getTanks, addTank, getAbout, db_ops } from './db_operations.js';



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
    const data = db_ops.select_info.get();
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
    const t = db_ops.select_tanks.all();
    for (const tank of t) {
        if (tank.nation == req.body.nation && tank.name == req.body.name) {
            db_ops.increase_number.all(req.body.number, tank.id);
            break;
        } 
        else {
            db_ops.insert_tank.get(req.body.nation, req.body.name, req.body.number);
            break;
        }
    }
    
    console.log(db_ops.select_tanks.all());
    res.redirect(`/all/tankmuseum`);
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});