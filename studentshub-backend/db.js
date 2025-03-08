// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./studentshub.db');

db.serialize(() => {
    // Creating user table for authentication
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, dob Date)");

    // Creating student table
    db.run(`CREATE TABLE IF NOT EXISTS students (
        admission_date DATE DEFAULT CURRENT_DATE,
        admission_no INTEGER UNIQUE PRIMARY KEY,
        name TEXT,
        father_name TEXT,
        dob DATE DEFAULT CURRENT_DATE,
        gender TEXT,
        grade TEXT,
        nationality TEXT,
        father_cnic TEXT,
        father_contact TEXT,
        address TEXT,
        status TEXT,
        slc TEXT,
        issue_date DATE
    )`);
});

module.exports = db;
