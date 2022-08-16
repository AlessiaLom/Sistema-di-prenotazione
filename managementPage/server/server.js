/*
------------ MY VERSION -------------
// Express
const { response } = require('express');
const express = require('express');
const { data } = require('jquery');
const app = express()
const port = 8000
//*
// Mongoose connection 
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodemongo');
const db = mongoose.connection;

db.once('open', function(){
    // console.log("Connected to MongoDB successfully!");
});
db.on('error', function(){
    // // console.log(err);
});



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://gianlucazani:uJJxmUwcZs0FrCgd@sdpcluster.qakmidq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/test', (req, res) => {
    // console.log("Received request" + req)
    res.json({
        message: "Ciao bellissimo",
        info: {
            key1: "value1",
            key2: "value2"
        }
    })
})

app.get("/test/dbfetching", (req, res) => {
    const collection = client.db("sdp_db").collection("authentication");
    const toArray = collection.find({}).toArray((err, result) => {
        if (err) console.log(err)
        res.send(result)
    })
})

app.listen(port, () => {
    client.connect((err) => {
        if (err) {
            // console.log(err)
        }
        //client.close();
    });
    // console.log(`Example app listening on port ${port}`)
})
*/

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    // console.log(`Server is running on port: ${port}`);
});