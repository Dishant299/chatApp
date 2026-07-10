import { generateToken } from "../lib/utlis.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";


//signup 
export const signup = async(req,res) => {
    try{
        const {fullName,email,password,bio} = req.body;

        if(!fullName || !email || !password || !bio){
            return res.json({
                success:false,
                message:"Missing details"
            })
        }
        
        const user = await User.findOne({email});
        if(user){
           return res.json({
                success:false,
                message:"account already exist"
            }) 
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword,
            bio 
        });

        const token = generateToken(newUser._id);

        res.status(200).json({
            success:true,
            message:"Account  created successfully",
            data:newUser,
            token
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

//login
export const login = async(req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            res.json({
                success:false,
                message:"user not registered"
            })
        }

        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password,userData.password);

        if(!isPasswordCorrect){
            res.json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        const token = generateToken(userData._id);

        res.status(200).json({
            success:true,
            message:"Login successfully",
            data:userData,
            token
        })

    }catch(error){ 
        console.log(error);
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

//auth
export const checkAuth = async(req,res) => {
        res.json({
            success:true,
            user:req.user,
        })
}

//update profile
export const updateProfile = async(req,res) => {
    try{
        const {profilePic,bio,fullName} = req.body;

        // if(!profilePic || !bio || !fullName){
        //     res.json({
        //         success:false,
        //         message:"Data not found"
        //     })
        // }

        const userId = req.user._id;

        let updatedUser;

        if(!profilePic){
           updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
        }

        res.status(200).json({
            success:true,
            message:"Updated profile successfully",
            user:updatedUser
        })
    }catch(error){ 
        console.log(error);
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}