const express = require('express');
const cors=require('cors');

const app=express();

app.use(express.json());
app.use(cors());

const teamSelectRoute = require("./routes/teamSelect");
const simulateRoute=require("./routes/simulate");
const playingXIRoute = require("./routes/playingXI");
const startMatchRoute=require("./routes/startMatch")
const matchSetupRoute = require("./routes/matchSetup");
const opponentXIRoute = require("./routes/opponentXI");


app.use("/startMatch",startMatchRoute);
app.use("/teams", teamSelectRoute);
app.use('/simulate',simulateRoute);
app.use("/playingXI", playingXIRoute);
app.use("/opponentXI", opponentXIRoute);
app.use("/match", matchSetupRoute);

app.listen(5000,()=>{
    console.log("Server running on port 5000");
})

