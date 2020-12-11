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


const uri=process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true}
    ,(err)=>{
        if(err) throw err;
        console.log("Mongodb connection established successfully")
       }
    )


const petsRouter = require('./routes/pets');
const blogPostsRouter = require('./routes/blogposts');
const apiRouter = require('./routes/api');

app.use('/api', apiRouter);
app.use('/pets', petsRouter);
app.use('/blogposts', blogPostsRouter);

 //set up routes   
 app.use("/users",require("./routes/userRouter"));