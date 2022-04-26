const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors())


app.get('/', (req, res) => {
    res.send("hello")
})

module.exports = app;