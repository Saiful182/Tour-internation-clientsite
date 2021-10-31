const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());

const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vy5ro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Tour_International');
        const tourCollection = database.collection('tour_pakages');
        const guideCollection = database.collection('guide');
        const stuffCollection = database.collection('stuff');
        const commentsCollection = database.collection('comments');
        const cartCollection = database.collection('cart');

        app.post('/cart', async (req, res) => {
            const cart = req.body;
            console.log('get hitted');

            const result = await cartCollection.insertOne(cart);
            res.json(result);
        });
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find({})
            const cartIteams = await cursor.toArray();
            res.send(cartIteams);
        })
        app.get('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await cartCollection.findOne(query);
            res.json(user);
        })
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            console.log('hitted');
            res.json(result);
        })
        app.put('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCart = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    approval: updatedCart.approval = "Approved"
                }
            };
            console.log(req.body);
            const result = await cartCollection.updateOne(filter, updateDoc, options);
            console.log('getting id', id);
            res.json(result);

        })
        app.get('/comments', async (req, res) => {
            const cursor = commentsCollection.find({})
            const comments = await cursor.toArray();
            res.send(comments);
        })

        app.get('/stuff', async (req, res) => {
            const cursor = stuffCollection.find({})
            const stuff = await cursor.toArray();
            res.send(stuff);
        })
        app.get('/guide', async (req, res) => {
            const cursor = guideCollection.find({})
            const guide = await cursor.toArray();

            res.send(guide);
        })

        app.post('/tourpakages', async (req, res) => {
            const pakages = req.body;
            const result = await tourCollection.insertOne(pakages);
            res.json(result);
        })
        app.get('/tourpakages', async (req, res) => {
            const cursor = tourCollection.find({});
            const tourPakages = await cursor.toArray();
            res.send(tourPakages);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('hellow from the other side');
})
app.get('/help', (req, res) => {
    res.send('hellow from help');
})
app.listen(port, () => {
    console.log('from port');
})