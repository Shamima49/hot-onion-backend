const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;
let client = new MongoClient(uri ,{useNewUrlParser:true, useUnifiedTopology: true})




app.get('/' , (req, res) => {
    res.send("HOT ONION BACKEND SERVER");
})


app.get('/foods' , (req, res) => {
    client = new MongoClient(uri ,{useNewUrlParser:true});
    client.connect(err => {
        if(err){
            console.log(err);
        }else{
            const collection = client.db('hotOnionRestaurant').collection('foods');
            collection.find().toArray((rej,documents) => {
                if(rej){
                    console.log(rej);
                    res.status(500).send("Filed to Fetch Data ")
                }else{
                    res.send(documents);
                }
                //client.close()
            })
        }
    })
})

app.get('/food/:id', (req,res) => {
    client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true})
    const foodId = Number(req.params.id)

    client.connect(err => {
        const collection = client.db('hotOnionRestaurant').collection('foods');
        console.log(foodId);
        collection.find({id:foodId}).toArray((err, documents) => {
            if(err){
                console.log(err);
            }else{
                res.send(documents[0]);
            }
            //client.close();
        })
    })
})

// Post routes
app.post('/submitOrder' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db('hotOnionRestaurant').collection('orders');
        collection.insert(data , (rej, result) =>  {
            if(rej){
                res.status(500).send("Filed to inset")
            }else{
                res.send(result.ops[0])
            }
        })
    })
})

app.post('/addFood' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db('hotOnionRestaurant').collection('foods');
        collection.insert(data , (rej, result) =>  {
            if(rej){
                res.status(500).send("Filed to inset")
            }else{
                res.send(result.ops)
            }
        })
    })
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Listening to port 5000'));
