const express = require('express');
const cors = require('cors');
const airQualityRoutes = require('./routes/airQualityRoutes');
const { connection } = require('./services/databaseService');

const app = express();
app.use(cors());
app.use(express.json());

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.use('/', airQualityRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
