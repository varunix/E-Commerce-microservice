const express = require('express');
const app = express();
const axios = require('axios');
const HOST = 'http://localhost'
const PORT = 8081;

app.get('/order-list', (req, res)=>{
    let response = {
        data: {
            item: [
                {
                    id: 1, name: 'order 1'
                },
                {
                    id: 2, name: 'order 2'
                }
            ]
        }
    }

    return res.status(200).json(response);
});

app.get('/order', (req, res)=>{
    res.status(200).json({message: "order called"});
});

app.listen(PORT, axios({
    method: 'POST',
    url: 'http://localhost:9001/register',
    headers: {'Content-Type': 'application/json'},
    data: {
        apiName: "order",
        host: HOST,
        port: PORT,
        url: "http://localhost:8081/"

    }
}).then((response)=>{
    console.log(response.data);
}), ()=>{
    console.log(`Order Service is listening at http://localhost:${PORT}`)
});