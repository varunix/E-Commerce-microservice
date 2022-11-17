const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const db = require('./configs/mongoose');
const User = require("./models/user");
const routes = require('./routes');
const bodyParser = require('body-parser');
const port = 9001;
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(routes);

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

// const server = gateway({
// //   middlewares: [checkAuth],
//   routes: [
//     {
//       prefix: "/order",
//       target: "http://localhost:8081/",
//       hooks: {},
//     },
//     {
//       prefix: "/payment",
//       target: "http://localhost:8082/",
//       hooks: {},
//     },
//   ],
// });

app.get("/", (req, res) => {
  res.send("Called gateway");
});

app.post("/auth/login", async (req, res)=>{
    const {email, password} = req.body;
    
    const user = await User.findOne({ email });
    
    if(!user) {
        return res.json({message: "User doesn't exist"});
    } else {

        if(password != user.password) {
            return res.json({message: "Password Incorrect"});
        }

        const payload = {
            email,
            name: user.name
        };
        jwt.sign(payload, "secret", (err, token)=>{
            if(err) {
                console.log(err);
            }
            else{
                return res.json({ token: token });
            }
        })
    }
});

app.post("/auth/register", async (req, res)=>{
    try{
        const {email, password, name} = req.body;
    
        const userExists = await User.findOne({ email });

        if(userExists) {
            return res.json({message: "User already exists"});
        } else {
            const newUser = new User({
                name,
                email,
                password
            });
            newUser.save();
            return res.json(newUser);
        }
    }
    catch(err) {
        console.log("Error in register user: " + err);
        return;
    }
});

// server.start(port).then((server) => {
//   console.log("Api gateway is running at 9001");
// });

app.listen(port, (err)=>{
    if(err) {
        console.log("Error in running the backend server", err);
        return;
    }

    console.log(`Backend server is running on ${port}`);
});
