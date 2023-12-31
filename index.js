const express = require("express");
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8wqrrau.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const foodcollection = client.db('communityFood').collection('addfood')
        const requestcollection = client.db('communityFood').collection('request')

        // add food
        app.post('/addfoods', async (req, res) => {
            const food = req.body;
            const result = await foodcollection.insertOne(food);
            res.send(result)
        })
        app.get('/addfoods', async (req, res) => {
            const coursor = foodcollection.find()
            const result = await coursor.toArray()
            res.send(result)

        });
        app.get('/addfoods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodcollection.findOne(query)
            res.send(result)

        })

        // single request modal food post
        app.post('/request', async (req, res) => {
            const request = req.body;
            const result = await requestcollection.insertOne(request);
            res.send(result)
        })
        // manage food
        app.delete('/addfoods/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodcollection.deleteOne(query)
            res.send(result)
        })
 
        


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
