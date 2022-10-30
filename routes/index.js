const express=require("express");
const router=express.Router();

router.use("/eth",require("./eth.routes"));
router.get("/health",(req,res)=>{
    return res.json(200,{
        message:"GREEN 🟩"
    });
})

module.exports=router;

