const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
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
        const bdTourCollection = database.collection('bd_places');
        const guideCollection = database.collection('guide');
        app.get('/guide', async (req, res) => {
            const cursor = guideCollection.find({})
            const guide = await cursor.toArray();
            console.log(guide);
            res.send(guide);
        })

        app.get('/bdplaces', async (req, res) => {
            const cursor = bdTourCollection.find({});
            const bdplaces = await cursor.toArray();
            res.send(bdplaces);

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