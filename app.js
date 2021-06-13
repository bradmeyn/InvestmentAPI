const express = require('express');
const investments = require('./routes/investments');

const methodOverride = require('method-override');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');





// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));


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

//add ability to parse body
app.use(express.urlencoded({extended:true}));
//set the view ehgine to use ejs
app.set('view engine', 'ejs');
//views directory location
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use('/investments', investments);




app.listen(3000, ()=> {
    console.log("server running on port 3000");
})