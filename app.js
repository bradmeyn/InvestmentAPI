const express = require('express');
const app = express();



app.get('/', (req, res) => {
    res.send("hey")
});


//display all investments
app.get('/investments', async (req, res) => {
    res.send("all investments")
});




app.listen(3000, ()=> {
    console.log("server running on port 3000");
})