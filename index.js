const express=require("express");
const config=require("./config.json");
const app=express();

app.use("/",require("./routes/index.js"));

app.listen(config.port,()=>{
    console.log("App listening on port:",config.port);
})