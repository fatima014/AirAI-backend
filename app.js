const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port : process.env.DB_PORT,
    database:"AirAI",
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

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


app.use(express.json());
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;
  
    const sql = 'INSERT INTO form_data (name, email, message, status) VALUES (?, ?, ?, ?)';
    const values = [name, email, message, 'pending'];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'An error occurred while submitting the form' });
      } else {
        console.log('Form submitted successfully');
        res.status(200).json({ message: 'Form submitted successfully', id: result.insertId });
      }
    });
  });
  


app.get('/api/no2/:date', (req, res) => {
    const date = req.params.date;
    console.log('Fetching NO2 data for', date);
    getNO2DataForDate(date, (err, data) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while fetching NO2 data.' });
        } else {
            res.json({ date: date, data: data });
        }
    });
});

app.get('/api/so2/:date', (req, res) => {
    const date = req.params.date;
    console.log('Fetching SO2 data for', date);
    getSO2DataForDate(date, (err, data) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while fetching NO2 data.' });
        } else {
            res.json({ date: date, data: data });
        }
    });
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });