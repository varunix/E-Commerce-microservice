const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/product-service');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to mongodb :: ProductService"));

db.once('open', console.log.bind(console, "Product service connected to DB :: MongoDB"));