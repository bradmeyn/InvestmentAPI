
//file is used to fill database with the investments
const mongoose = require('mongoose');
const investments = require('./investments');

const Investment = require('../models/investment');

//connect mongoose to mongodb server
mongoose.connect('mongodb://localhost:27017/investmentAPI', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//confirm database connection
const db = mongoose.connection;
db.on('error',console.error.bind('connection erdb.ror:'));
db.once('open', () => {
    console.log("database connected");
});

//delete existing database data and refill with generic options
const fillDB = async () => {
   await Investment.deleteMany({});
    investments.forEach((etf) => {
        const investment = new Investment({
            name: etf.name,
            code: etf.code,
            cost: etf.cost
        });
       investment.save();
    });
}
    

fillDB();