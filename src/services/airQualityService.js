const pool = require('./databaseService');
const { connection } = require('./databaseService');


function getNO2DataForDate(date, callback) {
    const query = `SELECT * FROM NO2 WHERE date = ?`;
    connection.query(query, [date], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        if (results.length > 0) {
            return callback(null, results);
        } else {
            return callback(null, []);
        }
    });
}

function getSO2DataForDate(date, callback) {
    const query = `SELECT * FROM SO2 WHERE date = ?`;
    connection.query(query, [date], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        if (results.length > 0) {
            return callback(null, results);
        } else {
            return callback(null, []);
        }
    });
}

function getO3DataForDate(date, callback) {
    const query = `SELECT * FROM O3 WHERE date = ?`;
    connection.query(query, [date], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        if (results.length > 0) {
            return callback(null, results);
        } else {
            return callback(null, []);
        }
    });
}

function getCODataForDate(date, callback) {
    const query = `SELECT * FROM CO WHERE date = ?`;
    connection.query(query, [date], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        if (results.length > 0) {
            return callback(null, results);
        } else {
            return callback(null, []);
        }
    });
}


module.exports = {
    getNO2DataForDate,
    getSO2DataForDate,
    getO3DataForDate,
    getCODataForDate
};