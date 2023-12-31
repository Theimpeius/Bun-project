import { Database } from "bun:sqlite";

const db = new Database('database.sqlite', {create: true});

db.query(`
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        done BOOLEAN,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
`).run();

db.query(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        password TEXT
    )
`).run();
export default db;