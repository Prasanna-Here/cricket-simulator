const express = require('express');
const cors=require('cors');

const app=express();

app.use(express.json());
app.use(cors());

const simulateRoute=require("./routes/simulate");
const startMatchRoute=require("./routes/startMatch")

app.use("/startMatch",startMatchRoute);
app.use('/simulate',simulateRoute);

app.listen(5000,()=>{
    console.log("Server running on port 5000");
})

