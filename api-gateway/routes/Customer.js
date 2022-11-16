const express = require('express');
const route = express.Router();

route.get('/user', (req, res)=>{
    axios.get('2212123213', {}).then(data=>res.send(data));
    return;
});

module.exports = route;