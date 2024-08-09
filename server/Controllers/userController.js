const userModel =require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const createToken =(_id)=>{

    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id} ,jwtKey ,{expiresIn:"3d"});

}

const registerUser = async(req,res)=>{
    try{
    let{name,email,password} =req.body
    let user = await userModel.findOne({email});
    if(user)
        return res.status(400).json("User with the given email already exists");

    if(!name || !email || !password)
        return res.status(400).json("All fields are required");
    if(!validator.isEmail(email))
        return res.status(400).json("Email must be a valid email");
    if(!validator.isStrongPassword(password))
        return res.status(400).json("Password must be strong");

    const salt =await bcrypt.genSalt(10);
    password=await bcrypt.hash(password,salt);

    user =new userModel({name,email,password});
    await user.save();

    const token =createToken(user._id);

    res.status(200).json({
        _id:user._id,
        name,
        email,
        token
    })
}
catch(error){
    console.log("Error while registering user",error);
    res.status(500).json("Internal server Error");
}

}


const loginUser =async(req,res)=>{
    const {email,password} =req.body;
    try{
        let user =await userModel.findOne({email});
        if(!user)
            return res.status(400).json("invalid email or password");

        const isValidPassword =await bcrypt.compare(password,user.password)
        if(!isValidPassword)
            return res.status(400).json("invalid email or password");

        const token =createToken(user._id);
        return res.status(200).json({
            _id:user._id,
            name:user.name,
            email,
            token
        })
    }
    catch(error)
    {
        console.log("error while logging the user",error.message);
        return res.status(500).json(
            "internal server error"
        )
    }
}

const findUser =async(req,res)=>{
   const userId =req.params.userId;
   try{
     const user =await userModel.findById(userId);
     if(!user)
        {
            return res.status(400).json("invalid userId");
        }
        return res.status(200).json(user)
   }
   catch(error)
   {
    console.log("error while finding the user",error.message);
    return res.status(500).json(error.message);
   }
}


const getAllUsers =async(req,res)=>{
    try{
      const user =await userModel.find();
      if(!user)
         {
             return res.status(400).json("No user is present");
         }
         return res.status(200).json(user)
    }
    catch(error)
    {
     console.log("error while finding the user",error.message);
     return res.status(500).json(error.message);
    }
 }

module.exports ={registerUser, loginUser ,findUser ,getAllUsers}