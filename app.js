const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
let numeral = require('numeral');
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

//add ability to parse body
app.use(express.urlencoded({extended:true}));
//set the view ehgine to use ejs
app.set('view engine', 'ejs');
//views directory location
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);


app.get('/', (req, res) => {
    res.send("hey")
});


//display all investments
app.get('/investments', async (req, res) => {
    //search investment db for all investments
    const investments = await Investment.find();
    //render index ejs file and pass investments array through
    res.render("investments/index", {investments, numeral})
});

app.get('/investments/add', (req, res) =>{

    res.render('investments/add')
});


app.post('/investments', async (req, res)=> {
    const investment = new Investment(req.body.investment)

    await investment.save();
    // const investment = new Investment(req)
    res.redirect(`/investments/${investment.code}`)
})

//display single investment
app.get('/investments/:code', async (req, res) => {
    const {code} = req.params;
        const investment = await Investment.findOne({code: code});
        
        res.render('investments/show', {investment});
    });




app.listen(3000, ()=> {
    console.log("server running on port 3000");
})