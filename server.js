const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

require("dotenv").config();

//set up express
const app=express();
app.use(express.json());
app.use(cors());

const PORT=process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server started on port: ${PORT}`));

//setup mongoose
const uri=process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true}
    ,(err)=>{
        if(err) throw err;
        console.log("Mongodb connection established successfully")
       }
    )