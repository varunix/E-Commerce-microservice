const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/order-service');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to mongodb :: OrderService"));

db.once('open', console.log.bind(console, "Order service connected to DB :: MongoDB"));