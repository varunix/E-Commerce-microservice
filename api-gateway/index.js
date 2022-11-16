const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const gateway = require("fast-gateway");
const db = require('./configs/mongoose');

dotenv.config();

const checkAuth = (req, res, next) => {
  if (req.headers.token && req.headers.token != "") {
    next();
  } else {
    res.setHeader("Content-type", "application/json");
    res.statusCode = 401;
    res.send(JSON.stringify({ status: 401, message: "Authentication fail" }));
  }
};

const server = gateway({
  middlewares: [checkAuth],
  routes: [
    {
      prefix: "/order",
      target: "http://localhost:8081/",
      hooks: {},
    },
    {
      prefix: "/payment",
      target: "http://localhost:8082/",
      hooks: {},
    },
  ],
});

server.get("/test", (req, res) => {
  res.send("Called gateway");
});

server.start(process.env.port).then((server) => {
  console.log("Api gateway is running at 9001");
});

// app.listen(process.env.PORT, process.env.HOST, (err)=>{
//     if(err) {
//         console.log("Error in running the backend server", err);
//         return;
//     }

//     console.log(`Backend server is running on ${process.env.HOST}:${process.env.PORT}`);
// });
