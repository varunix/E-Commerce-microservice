const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth-service');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to mongodb :: AuthenticationService"));

db.once('open', console.log.bind(console, "Authenticated service connected to DB :: MongoDB"));