const express = require("express");
const router = express.Router();

const {simulateBall}=require("../logic/outcomeEngine");

router.post("/",(req,res)=>{
    const {state,choice}=req.body;

    const updatedState=simulateBall(state,choice);

    res.json(updatedState);
});

module.exports=router;