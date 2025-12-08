import { DatabaseSync } from "node:sqlite";
import { isSet } from "util/types";

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
export function getTankMuseumData() {
    return [tankMuseum.name, tankMuseum.tanks];
}
export function getTanks() {
    return tankMuseum.tanks;
}
export function addTank(country, tankName) {
    tankMuseum.tanks.push([country, tankName])
}
export function getAbout() {
    return [about.name, about.text];
}



const db = new DatabaseSync("./db.sqlite");
db.exec(
    `CREATE TABLE IF NOT EXISTS tanks (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    nation TEXT NOT NULL,
    name TEXT NOT NULL
    ) STRICT; 
    CREATE TABLE IF NOT EXISTS info (
    name TEXT NOT NULL,
    about TEXT NOT NULL
    ) STRICT;`
);

export const db_ops = {
    insert_tank: db.prepare('INSERT INTO tanks (nation, name) VALUES (?, ?) RETURNING id, nation, name;'),
    select_tanks: db.prepare("SELECT * FROM tanks"),
    select_tank: db.prepare('SELECT nation, name FROM tanks WHERE id = ?'),
    insert_info: db.prepare('INSERT INTO info (name, about) VALUES (?, ?)'),
    select_info: db.prepare('SELECT * FROM info')
};

export function populate_tanks() {
    var a = db_ops.select_tanks.get();
    if (a == undefined) {
        console.log("populating");
        var len = getTanks().length;
        for (let i = 0; i < len; i++) {
            var tank = getTanks()[i];
            var nation = tank[0];
            var name = tank[1];
            var c = db_ops.insert_tank.get(nation, name);
            console.log("created:", c);
        };
    }
}
populate_tanks();

function populate_about() {
    var a = db_ops.select_info.get();
    if (a == undefined) {
        db_ops.insert_info.get(tankMuseum.name, about.text);
    }
}

populate_about();