//Connection to the database.

const sqlite3 = require('sqlite3');
const {open} = require('sqlite');

async function connectToDataBase() {
    try {
        const dbConnection = await open({ filename: 'Certificates.db', driver: sqlite3.Database });
        return dbConnection;
    } catch (error) {
        throw error;
    }
}

module.exports = {connectToDataBase};