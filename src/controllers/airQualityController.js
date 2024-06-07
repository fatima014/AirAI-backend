const express = require('express');
const { getNO2DataForDate, getSO2DataForDate, getO3DataForDate, getCODataForDate } = require('../services/airQualityService');
const { pool, connection } = require('../services/databaseService');
const moment = require('moment');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from Express!');
});

router.get('/api/no2/:date', (req, res) => {
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

router.get('/api/so2/:date', (req, res) => {
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

router.get('/api/o3/:date', (req, res) => {
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

router.get('/api/co/:date', (req, res) => {
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

router.get('/favicon.ico', (req, res) => {
    res.send('Hello from Express!');
  });

// Route to fetch closest PM2.5 data for given coordinates
router.get('/api/closest-coordinates/pm25', (req, res) => {
    let { latitude, longitude } = req.query;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    const sql = `
      SELECT date, lat, lon, concentration
      FROM PM25
      WHERE date = (
        SELECT MAX(date)
        FROM PM25
      )
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
router.get('/api/closest-coordinates/no2', (req, res) => {
    let { latitude, longitude } = req.query;


    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM SO2
      WHERE date = (
        SELECT MAX(date)
        FROM SO2
      )
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
router.get('/api/closest-coordinates/so2', (req, res) => {
    let { latitude, longitude } = req.query;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM SO2
      WHERE date = (
        SELECT MAX(date)
        FROM SO2
      )
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
router.get('/api/closest-coordinates/o3', (req, res) => {
    let { latitude, longitude } = req.query;

   
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM SO2
      WHERE date = (
        SELECT MAX(date)
        FROM SO2
      )
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
router.get('/api/location', (req, res) => {
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
router.get('/api/closest-coordinates/co', (req, res) => {
    let { latitude, longitude } = req.query;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    const sql = `
      SELECT date, lat, lon, concentration, pollutant_level
      FROM SO2
      WHERE date = (
        SELECT MAX(date)
        FROM SO2
      )
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

router.get('/api/forecast-next-three-days', (req, res) => {
  let { latitude, longitude } = req.query;

  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);

  const currentDate = moment().format('YYYY-MM-DD');
  const endDate = moment().add(3, 'days').format('YYYY-MM-DD');

  const closestPointQuery = `
    SELECT lat, lon
    FROM FORECAST
    ORDER BY SQRT(POWER(lat - ?, 2) + POWER(lon - ?, 2))
    LIMIT 1;
  `;

  pool.query(closestPointQuery, [latitude, longitude], (err, closestPointResults) => {
    if (err) {
      console.error('Error querying closest point:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (closestPointResults.length === 0) {
      return res.status(404).json({ error: 'No closest point found' });
    }

    const { lat, lon } = closestPointResults[0];

    const forecastQuery = `
      SELECT date, lat, lon, concentration
      FROM FORECAST
      WHERE lat = ? AND lon = ?
        AND date BETWEEN ? AND ?
      ORDER BY date;
    `;

    pool.query(forecastQuery, [lat, lon, currentDate, endDate], (forecastErr, forecastResults) => {
      if (forecastErr) {
        console.error('Error querying forecast data:', forecastErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (forecastResults.length === 0) {
        return res.status(404).json({ error: 'No forecast data available for the closest point in the next three days' });
      }

      return res.status(200).json({ forecastData: forecastResults });
    });
  });
});


module.exports = router;
