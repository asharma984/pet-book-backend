const router= require("express").Router();
const bcrypt=require("bcryptjs");
const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const auth=require("../middleware/auth");


//register route
router.post("/register", async(req,res)=>{
    
try{
    let {email,password,passwordCheck,userName,userType}=req.body;

//validation
if(!email || !password || !passwordCheck || !userType)
  return res.status(400).json({msg:"All fields are required"});

if(password.length<5)
  return res.status(400).json({msg:"Password should be greater than or equal to 5 characters"});

if(passwordCheck!==password)
  return res.status(400).json({msg:"Please enter the same password twice"});

if(!userName)
  userName=email;

const existingUser= await User.findOne({email:email});
if(existingUser)
   return res.status(400).json({msg:"Account with this email already exists"});


const salt=await bcrypt.genSalt();
const passwordHash=await bcrypt.hash(password,salt);

const newUser=new User({
    email,
    password:passwordHash,
    userName,
    type:userType
});

const savedUser=await newUser.save();
res.send(savedUser);
}
catch(err)
{
    res.status(500).json({error:err.message});
}

});

//login route

router.post("/login",async(req,res)=>{
try{
const {email,password}=req.body;
//validate 
if(!email || !password)
  return res.status(400).json({msg:"Enter all fields"});


const user=await User.findOne({email:email});
if(!user)
return res.status(400).json({msg:"This email does not exist"});


const isMatch=await bcrypt.compare(password,user.password);
if(!isMatch)
return res.status(500).json({msg:"Invalid credentials"});

const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
res.json({
    token,
    user: {
        id:user._id,
        displayName:user.displayName,
        id:user._id,
        type:user.type,
        email:user.email
    }
})

}
catch(err)
{
   return res.status(500).json({error:err.message});
}
})

//delete route
router.delete("/delete", async(req,res)=>{
    try{
 const deletedUser= await User.findByIdAndDelete(req.body.source.id);
 res.json(deletedUser);
    }
    catch(err)
{
   return res.status(500).json({error:err.message});
}
});

router.post("/tokenIsValid",async(req,res)=>{
  try{
    const token=req.header("x-auth-token");
    if(!token) return res.json(false);

    const verified=jwt.verify(token,process.env.JWT_SECRET);
    if(!verified) return res.json(false);

    const user=await User.findById(verified.id);
    if(!user) return res.json(false);

    return res.json(true);
  }
  catch(err)
{
   return res.status(500).json({error:err.message});
}
});

router.get("/",auth,async(req,res)=>{
   const user=User.findById(req.user);
   res.json({
     user:{
     displayName:user.displayName,
     id:user._id,
     type:user.type,
         email:user.email
     }
   });
});

//update password
router.put("/update", async(req,res)=>{
    
  try{
      let {id,password,passwordCheck}=req.body;
  
  //validation
  if(!password || !passwordCheck)
    return res.status(400).json({msg:"All fields are required"});
  
  if(password.length<5)
    return res.status(400).json({msg:"Password should be greater than or equal to 5 characters"});
  
  if(passwordCheck!==password)
    return res.status(400).json({msg:"Please enter the same password twice"});
  
  
  
  const existingUser= await User.findById(id);
  const salt=await bcrypt.genSalt();
  const passwordHash=await bcrypt.hash(password,salt);
  
  const newUser=new User({
      email:existingUser.email,
      password:passwordHash,
      userName:existingUser.userName,
      type:existingUser.type,
      pets:existingUser.pets,
    followedPets:existingUser.followedPets
  });

  
  
  const savedUser=await userModel.update({_id: id}, {$set: newUser});
  res.send(savedUser);
  }
  catch(err)
  {
      res.status(500).json({error:err.message});
  }
  
  });

  //add a new pet to the followed list
  router.post("/:id/followedPets",async(req,res)=>{
    try{
    const user=await User.findOne({_id:req.params.id});
    if(!user)
    return res.status(400).json({msg:"The user does not exist"});
  
    const id=req.params.id;
    User.findOneAndUpdate(
      { _id: id }, 
      { $addToSet: { followedPets: req.body  } })
      .then(result=>res.send(result.followedPets));
 
    }
    catch(err)
    {
       return res.status(500).json({error:err.message});
    }
    })
  
    //get list of followed pets for an user
    router.get("/:id/followedPets",async(req,res)=>{
      try{
      const user=await User.findOne({_id:req.params.id});
      if(!user)
      return res.status(400).json({msg:"The user does not exist"});
      
      res.send({
        followedPets:user.followedPets 
      })
      
      }
      catch(err)
      {
         return res.status(500).json({error:err.message});
      }
      })
  
    //delete a pet for a user from the follower list
      router.delete("/:id/followedPets/:pid",async(req,res)=>{
        try{
        const user=await User.findOne({_id:req.params.id});
        if(!user)
        return res.status(400).json({msg:"The user does not exist"});
        
        User.findByIdAndUpdate(
          req.params.id, { $pull: { "followedPets": { animalId: req.params.pid } } }, { safe: true, upsert: true },
          function(err, user) {
              if (err) { return handleError(res, err); }
              return res.status(200).json(user.followedPets);
          });
    
        
        }
        catch(err)
        {
           return res.status(500).json({error:err.message});
        }
        })


module.exports=router;