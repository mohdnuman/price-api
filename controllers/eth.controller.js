const {getPrice}=require("../lib/eth.lib.js");

module.exports.getPrice=async function (req,res){
    let {tokenAddress}=req.params;
    let price=await getPrice(tokenAddress);
    if(price!=null){
        return res.json(200,{
            message:"success!",
            price:price
        });
    }else{
        return res.json(404,{
            message:"No price available for the given token Address!"
        });
    }
}