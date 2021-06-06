const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create investment schema
const InvestmentSchema = new Schema({
    name: String,
    code: String,
    cost: Number
});

//export the investment model 
module.exports = mongoose.model('Investment', InvestmentSchema);