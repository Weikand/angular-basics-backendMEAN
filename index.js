const express = require('express');
const cors = require('cors');
const {dbConnection} = require("./db/config");
require('dotenv').config();

// Create server/app from express
const app = express();

// Database connection
dbConnection();

// Public directory
app.use( express.static('public') )

// CORS
app.use( cors() );

// Read and parse from body
app.use( express.json() );

// Routes
app.use( '/api/auth', require('./routes/auth'));


app.listen( process.env.PORT , () => {
    console.log(`Server running on port: ${ process.env.PORT }`)
});
