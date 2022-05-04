const { MongoClient } = require('mongodb');
require('dotenv').config();

const URL = process.env.URL;
const PORT = process.env.PORT || 3000;

const client = new MongoClient(URL);

const connect_db = async() => {
    await client.connect();
    const db = client.db("QRFS"); // will return a db object
    module.exports = db;

    // starting the app right after the successful connection to the databse
    const app = require('./app');

    app.listen(PORT, () => {
        console.log("SERVER IS STARTED SUCCESSFULLY...! WE'RE GOOD TO GO!");
    });
}

connect_db();