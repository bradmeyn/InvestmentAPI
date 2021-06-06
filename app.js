const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Investment = require('./models/investment');


//connect mongoose to mongodb server
mongoose.connect('mongodb://localhost:27017/investmentAPI', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//confirm database connection
const db = mongoose.connection;
db.on('error',console.error.bind('connection error:'));
db.once('open', () => {
    console.log("database connected");
});

const app = express();

//set the view ehgine to use ejs
app.set('view engine', 'ejs');
//views directory location
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send("hey")
});


//display all investments
app.get('/investments', async (req, res) => {
    const investments = await Investment.find();
    res.render("investments/all", {investments})
});


app.listen(3000, ()=> {
    console.log("server running on port 3000");
})