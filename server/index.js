const express =require("express");
const cors =require("cors");
const mongoose  = require("mongoose");
const userRoute = require("./Routes/userRoute");



const app =express();
app.use(cors());
app.use(express.json());

app.use("/api/users",userRoute);


const PORT = process.env.PORT||5000;
require("dotenv").config();

app.listen(PORT ,(req,res)=>{
    console.log(`Server is running at port :${PORT }`);
})
const URI = process.env.ATLAS_URI;
mongoose.connect(URI)
        .then(()=>console.log(`Database connect at port::${PORT}`))
        .catch((err)=> console.log("Error in connecting database",err.message));
