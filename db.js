<<<<<<< HEAD
const { MongoClient } = require("mongodb");
require('dotenv').config();

const URL = process.env.URL;
const PORT = process.env.PORT;
=======
const { MongoClient } = require('mongodb');
require('dotenv').config();

const URL = process.env.URL;
const PORT = process.env.PORT || 3000;
>>>>>>> 86c32cc98e92c08659920ea3bd86e4774cb15b72

const client = new MongoClient(URL);

const connect_db = async() => {
    await client.connect();
<<<<<<< HEAD
    const db = client.db("QRFS");
    module.exports = db;
    // starting the app right after the successfull connection to the database
    const app = require('./App');

    app.listen(PORT, () => {
        console.log("WE'RE GOOD TO GO!");
=======
    const db = client.db("QRFS"); // will return a db object
    module.exports = db;

    // starting the app right after the successful connection to the databse
    const app = require('./app');

    app.listen(PORT, () => {
        console.log("SERVER IS STARTED SUCCESSFULLY...! WE'RE GOOD TO GO!");
>>>>>>> 86c32cc98e92c08659920ea3bd86e4774cb15b72
    });
}

connect_db();