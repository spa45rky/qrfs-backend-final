const { MongoClient } = require("mongodb");
require('dotenv').config();

const URL = process.env.URL;
const PORT = process.env.PORT;

const client = new MongoClient(URL);

const connect_db = async() => {
    await client.connect();
    const db = client.db("QRFS");
    module.exports = db;
    // starting the app right after the successfull connection to the database
    const app = require('./App');

    app.listen(PORT, () => {
        console.log("WE'RE GOOD TO GO!");
    });
}

connect_db();