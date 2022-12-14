const express = require('express');
const app = express();
const db = require('./configs/mongoose');
var amqp = require('amqplib');
const Product = require('./models/product');
const isAuthenticated = require('../isAuthenticated');
const bodyParser = require('body-parser');
const port = 8082;
var channel, connection, order;
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.get('/product-list', (req, res)=>{
    let response = {
        data: {
            item: [
                {
                    id: 1, name: 'payment 1'
                },
                {
                    id: 2, name: 'payment 2'
                }
            ]
        }
    }

    return res.status(200).json(response);
});

app.get('/product', (req, res)=>{
    res.status(200).json({message: "Product called"});
});

//Create a new product
// Buy a product
app.post("/create", isAuthenticated, async (req, res)=>{
    //req.user.email
    const { name, description, price } = req.body;
    const newProduct = new Product({
        name,
        description,
        price
    });
    newProduct.save();

    return res.json(newProduct);
});

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
}
connect();

//User sends a list of product's to buy
//Creating an order with those products and a total value of sum of product's prices.
app.post("/buy", isAuthenticated, async (req, res)=>{
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });

    channel.sendToQueue(
        "ORDER",
        Buffer.from(
            JSON.stringify({
                products,
                userEmail: req.user.email,
            })
        )
    );

    channel.consume("PRODUCT", data=>{
        console.log("Consuming PRODUCT queue");
        order = JSON.parse(data.content);
        channel.ack(data);
    });
    return res.json(order);
});

app.listen(port, ()=>{
    console.log(`Product Service is listening at http://localhost:${port}`)
});