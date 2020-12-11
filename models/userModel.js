const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:5},
    type:{type:String,required:true},
    userName:{type:String},
    pets:{type:Array,default:[]},
    followedPets:{type:Array,default:[]}
});

module.exports= User= mongoose.model("user",userSchema);