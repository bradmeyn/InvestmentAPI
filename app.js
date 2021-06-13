const express = require('express');
const methodOverride = require('method-override');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const numeral = require('numeral');
const Investment = require('./models/investment');


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

//serve add new investment page
app.get('/investments/add', (req, res) =>{
    res.render('investments/add')
});

//post route for new investment
app.post('/investments', async (req, res)=> {

    const investment = {...req.body.investment};
    investment.cost = parseFloat(investment.cost)/100;
    console.log(investment);
    const newInvestment = new Investment(investment);
    
    await newInvestment.save();
    // const investment = new Investment(req)

    console.log(`${investment.name} created`);
    res.redirect(`/investments/${investment.code}`)

})

//display single investment
app.get('/investments/:code', async (req, res) => {
    const {code} = req.params;
        const investment = await Investment.findOne({code: code});
        
        res.render('investments/show', {investment});
    });

//delete single investment
app.delete('/investments/:code', (req, res)=>{
    Investment.findOneAndDelete({code: req.params.code},()=>{
        console.log(`${req.params.code} deleted`);
    });
    res.redirect('/investments')
});


//show update page
app.get('/investments/:code/update', async (req, res) =>{
    const {code} = req.params;
    const investment = await Investment.findOne({code: code});
    
    res.render(`investments/update`, {investment,numeral});
});

//put address for update form submission
app.put('/investments/:code',async (req, res)=>{
    const {code} = req.params;
    const investment = {...req.body.investment};
    investment.cost = parseFloat(investment.cost)/100;
    await Investment.findOneAndUpdate({code: code}, {...investment});
    console.log(`${investment.name} updated`);
    

    res.redirect('/investments')
});


app.listen(3000, ()=> {
    console.log("server running on port 3000");
})