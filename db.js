const mongoose = require('mongoose');
require('dotenv').config();

const URL = process.env.URL;
const PORT = process.env.PORT || 3000;

// const client = new MongoClient(URL);

const connect_db = async() => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log("DB-ERROR: " + error);
    }

    // starting the app right after the successful connection to the databse
    const app = require('./app');

    app.listen(PORT, () => {
        console.log("SERVER IS STARTED SUCCESSFULLY...! WE'RE GOOD TO GO!");
    });
}

connect_db();