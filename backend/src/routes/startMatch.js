const express=require('express');
const router=express.Router();

const {initializeMatchState}=require("../logic/matchInit");

router.post("/",(req,res)=>{
    const initialState=initializeMatchState(req.body);
    res.json(initialState);
})

module.exports = router;