const express = require('express');
const app = express();
const axios = require('axios');
const Order = require('./models/order');
const amqp = require('amqplib');
const HOST = 'http://localhost'
const PORT = 8081;
var connection, channel;

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

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
}

function createOrder(products, userEmail) {
    let total = 0;
    for(t=0; t < products; t++){
        total += products[t].price;
    }

    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total
    });
    newOrder.save();
    return newOrder;
}

connect().then(()=>{
    channel.consume("ORDER", data => {
        console.log("Consuming ORDER queue");
        const { products, userEmail } = JSON.parse(data.content);
        const newOrder = createOrder(products, userEmail);
        channel.ack(data);
        channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
    })
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