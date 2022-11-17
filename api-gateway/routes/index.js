const express = require('express');
const router = express.Router();
const axios = require('axios');
const registry = require('./registry.json');
const fs = require('fs');

// route.get('/user', (req, res)=>{
//     axios.get('2212123213', {}).then(data=>res.send(data));
//     return;
// });

router.all('/:apiName/:path', (req, res)=>{
    if(registry.services[req.params.apiName]){
        axios({
            method: req.method,
            url: registry.services[req.params.apiName].url + req.params.path,
            headers: req.headers,
            data: req.body
        }).then((response)=>{
            res.send(response.data);
        });

        return;
    }

    return res.json({message: "API doesn't exists"});
});

router.post('/register', (req, res)=>{
    const registrationInfo = req.body;
    registry.services[registrationInfo.apiName] = { ...registrationInfo };
    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error)=>{
        if(error){
            res.send("Could not register '"+ registrationInfo.apiName + "'\n" + error);
            return;
        }  else {
            res.send("Successfully registered '"+ registrationInfo.apiName + "'");
            return;
        }
    });
});

module.exports = router;