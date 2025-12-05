import express from "express";
import { DatabaseSync } from "node:sqlite";



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







const tankMuseum = {
    name: "The Great Tank Museum of Szczecin",
    tanks: [
        ["USA", "M4A3"],
        ["USSR", "T-34-85"], 
        ["Germany", "Tiger H1"]
    ]
};
const about = {
    name: "About the Museum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum suscipit magna, nec laoreet velit eleifend sed. Suspendisse et enim nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum auctor varius turpis vitae consectetur. Praesent volutpat gravida nibh sit amet sodales. Ut porttitor est quis efficitur rutrum. Vestibulum ac quam euismod, elementum libero vitae, rutrum nunc. Nullam pharetra leo consequat felis tempus, sed molestie nunc iaculis. Duis efficitur imperdiet pharetra. Vestibulum in lacinia orci. Nulla et mauris sit amet elit vehicula pharetra nec quis urna. Praesent quam elit, tempor iaculis vestibulum at, sagittis vitae sapien. In aliquet augue ac porttitor dictum"
}
function getTankMuseumData() {
    return [tankMuseum.name, tankMuseum.tanks];
}
function getTanks() {
    return tankMuseum.tanks;
}
function addTank(country, tankName) {
    tankMuseum.tanks.push([country, tankName])
}
function getAbout() {
    return [about.name, about.text];
}





console.dir(db_ops.sel.all(), { compact: true, depth: null });

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
    const data = getTankMuseumData();
    if (data != null) {
        res.render("tanks", {
            name: "List of tanks", 
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