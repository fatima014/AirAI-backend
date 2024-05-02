const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const pool = require('./pool'); 
const cors = require('cors');


const app = express();
app.use(cors());
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

app.get('/api/o3/:date', (req, res) => {
    const date = req.params.date;
    console.log('Fetching O3 data for', date);
    getO3DataForDate(date, (err, data) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while fetching NO2 data.' });
        } else {
            res.json({ date: date, data: data });
        }
    });
});

app.get('/api/co/:date', (req, res) => {
    const date = req.params.date;
    console.log('Fetching CO data for', date);
    getCODataForDate(date, (err, data) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while fetching NO2 data.' });
        } else {
            res.json({ date: date, data: data });
        }
    });
});

app.get('/favicon.ico', (req, res) => {
    res.send('Hello from Express!');
  });

// Route to fetch closest PM2.5 data for given coordinates
app.get('/api/closest-coordinates/pm25', (req, res) => {
    let { latitude, longitude } = req.query;

    // convert to double
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    // for two days ago
    // WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 2 DAY)

    const sql = `
      SELECT date, lat, lon, concentration
      FROM PM25
      WHERE DATE(date) = CURDATE()
      ORDER BY SQRT(POWER(lat - ?, 2) + POWER(lon - ?, 2))
      LIMIT 1
    `;
  
    pool.query(sql, [latitude, longitude], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found for the given coordinates' });
      }
      
      console.log(results);
      const closestData = results[0];
      return res.status(200).json({
        date: closestData.date,
        latitude: closestData.lat,
        longitude: closestData.lon,
        concentration: closestData.concentration
      });
    });
  });

// Route to fetch closest NO2 data for given coordinates
app.get('/api/closest-coordinates/no2', (req, res) => {
    let { latitude, longitude } = req.query;

    // for two days ago
    // WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 2 DAY)
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM NO2
      WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 4 DAY)
      ORDER BY SQRT(POWER(lat - ?, 2) + POWER(lon - ?, 2))
      LIMIT 1
    `;
  
    pool.query(sql, [latitude, longitude], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found for the given coordinates' });
      }
  
      const closestData = results[0];
      return res.status(200).json({
        date: closestData.date,
        latitude: closestData.lat,
        longitude: closestData.lon,
        concentration: closestData.concentration,
        pollutant_level: closestData.pollutant_level
      });
    });
  });


// Route to fetch closest SO2 data for given coordinates
app.get('/api/closest-coordinates/so2', (req, res) => {
    let { latitude, longitude } = req.query;

    // for two days ago
    // WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 2 DAY)
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM SO2
      WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 4 DAY)
      ORDER BY SQRT(POWER(lat - ?, 2) + POWER(lon - ?, 2))
      LIMIT 1
    `;
  
    pool.query(sql, [latitude, longitude], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found for the given coordinates' });
      }
  
      const closestData = results[0];
      return res.status(200).json({
        date: closestData.date,
        latitude: closestData.lat,
        longitude: closestData.lon,
        concentration: closestData.concentration,
        pollutant_level: closestData.pollutant_level
      });
    });
});

// Route to fetch closest O3 data for given coordinates
app.get('/api/closest-coordinates/o3', (req, res) => {
    let { latitude, longitude } = req.query;

    // for two days ago
    // WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 2 DAY)
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM O3
      WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 5 DAY)
      ORDER BY SQRT(POWER(lat - ?, 2) + POWER(lon - ?, 2))
      LIMIT 1
    `;
  
    pool.query(sql, [latitude, longitude], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found for the given coordinates' });
      }
  
      const closestData = results[0];
      return res.status(200).json({
        date: closestData.date,
        latitude: closestData.lat,
        longitude: closestData.lon,
        concentration: closestData.concentration,
        pollutant_level: closestData.pollutant_level
      });
    });
});


// route to fetch location of given coordinates
app.get('/api/location', (req, res) => {
    let { latitude, longitude } = req.query;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    const sql = `
      SELECT city, district, province
      FROM Location
      ORDER BY SQRT(POWER(lat - ?, 2) + POWER(lon - ?, 2))
      LIMIT 1
    `;
  
    pool.query(sql, [latitude, longitude], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No location found for the given coordinates' });
      }
      
      const location = results[0];

      return res.status(200).json({
        city: location.city,
        district: location.district,
        province: location.province
      });
    });
  });

// Route to fetch closest O3 data for given coordinates
app.get('/api/closest-coordinates/co', (req, res) => {
    let { latitude, longitude } = req.query;

    // for two days ago
    // WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 2 DAY)
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM CO
      WHERE DATE(date) = CURDATE()
      ORDER BY SQRT(POWER(lat - ?, 2) + POWER(lon - ?, 2))
      LIMIT 1
    `;
  
    pool.query(sql, [latitude, longitude], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found for the given coordinates' });
      }
  
      const closestData = results[0];
      return res.status(200).json({
        date: closestData.date,
        latitude: closestData.lat,
        longitude: closestData.lon,
        concentration: closestData.concentration,
        pollutant_level: closestData.pollutant_level
      });
    });
});
