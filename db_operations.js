const db = new DatabaseSync("./db.sqlite");
db.exec(
    `CREATE TABLE IF NOT EXISTS tanks (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    nation TEXT NOT NULL,
    name TEXT NOT NULL
    ) STRICT;`
    );

const db_ops = {
    insert_tank: db.prepare('INSERT INTO tanks (nation, name) VALUES (?, ?) RETURNING id, nation, name;'),
    sel: db.prepare("SELECT * FROM tanks")
};

function populate() {
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
populate();