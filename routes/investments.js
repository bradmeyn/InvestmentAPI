
const express = require('express');
const router = express.Router();

const numeral = require('numeral');
const Investment = require('../models/investment');


// router.get('/', (req, res) => {
//     res.send("hey")
// });


//display all investments
router.get('/', async (req, res) => {
    //search investment db for all investments
    const investments = await Investment.find();
    //render index ejs file and pass investments array through
    res.render("investments/index", {investments, numeral})
});

//serve add new investment page
router.get('/add', (req, res) =>{
    res.render('investments/add')
});

//post route for new investment
router.post('/', async (req, res)=> {

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
router.get('/:code', async (req, res) => {
    const {code} = req.params;
        const investment = await Investment.findOne({code: code});
        
        res.render('investments/show', {investment});
    });

//delete single investment
router.delete('/:code', (req, res)=>{
    Investment.findOneAndDelete({code: req.params.code},()=>{
        console.log(`${req.params.code} deleted`);
    });
    res.redirect('/investments')
});


//show update page
router.get('/:code/update', async (req, res) =>{
    const {code} = req.params;
    const investment = await Investment.findOne({code: code});
    
    res.render(`investments/update`, {investment,numeral});
});

//put address for update form submission
router.put('/:code',async (req, res)=>{
    const {code} = req.params;
    const investment = {...req.body.investment};
    investment.cost = parseFloat(investment.cost)/100;
    await Investment.findOneAndUpdate({code: code}, {...investment});
    console.log(`${investment.name} updated`);
    

    res.redirect('/investments')
});


module.exports = router;