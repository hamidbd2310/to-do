const UsersModel=require('../model/UsersModel')
const OTPModel=require('../model/OTPModel')
const jwt=require('jsonwebtoken')
const SendEmailUtility=require('../utility/EmailSend')


exports.registration=async(req,res)=>{
try{
    let reqBody=req.body;

    await UsersModel.create(reqBody)
    res.json({stats:"Success",message:"Registration Successfully"})


}catch(err){
    res.json({stats:"Fail",message:err})
}
}

exports.Login = async (req, res) => {
    try {
        let reqBody = req.body;
        let user = await UsersModel.findOne({ email: reqBody.email });
        
        if (user) {
            if (user.password === reqBody.password) {
                let Payload = { exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), data: reqBody.email };
                let token = jwt.sign(Payload, process.env.JWT_SECRET_KEY);
                res.json({ status: "success", message: "Login Successfully", token: token });
            } else {
                res.json({ status: "failed", message: "Incorrect password" });
            }
        } else {
            res.json({ status: "failed", message: "User Not Found" });
        }
    } catch (err) {
        res.json({ status: "failed", message: err });
    }
}

    exports.profileRead=async(req,res)=>{
        try{
            let email=req.headers["email"];
    
            let result = await UsersModel.find({email:email})
    
            res.json({stats:"Success",data:result})
        
        
        }catch(err){
            res.json({stats:"Fail",message:err})
        }
    }


exports.profileUpdate=async(req,res)=>{

    try{
        let email=req.headers["email"];
        let reqBody=req.body;
        await UsersModel.updateOne({email:email},reqBody)
        res.json({stats:"Success",message:"Update Successfully"})
    
    
    }catch(err){
        res.json({stats:"Fail",message:err})
    }

   
    
    
}



exports.verifyEmail=async(req,res)=>{
    try {
        const { email } = req.params;
        let user = await UsersModel.find({ email: email });
        
        if (user.length > 0) {
            let otp = Math.floor(100000 + Math.random() * 900000);
            
            await SendEmailUtility(email, `Your OTP is ${otp}`, 'OTP Verification');
            
            await OTPModel.create({ email: email, otp: otp, status: "Active" });
            
            return res.json({ status: "success", message: "OTP Sent Successfully" });
        } else {
            return res.json({ status: "failed", message: "User Not Found" });
        }
    } catch (err) {
        console.error("Error in verifyEmail:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
    
}

exports.verifyOTP=async(req,res)=>{
    try {
        const { email, otp} = req.params;
        let user = await OTPModel.find({ email:email, otp:otp, status: "Active" });
        
        if (user.length > 0) {
           
            
            await OTPModel.updateOne({ email: email, otp: otp }, { status: "Verified" });
            
            return res.json({ status: "success", message: "OTP Verified Successfully" });
        } else {
            return res.json({ status: "failed", message: "Invalid OTP" });
        }
    } catch (err) {
        console.error("Error in verifyEmail:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
}

exports.passwordReset=async(req,res)=>{
    try {
        const { email, otp, password} = req.params;
        let user = await OTPModel.find({ email:email, otp:otp, status: "Verified" });
        
        if (user.length > 0) {
            await OTPModel.updateOne({ email: email, otp: otp }, { status: "Used" });
            await UsersModel.updateOne({ email: email }, { password: password });
            
            return res.json({ status: "success", message: "Password Reset Successfully" });
        } else {
            return res.json({ status: "failed", message: "Invalid Request" });
        }
    } catch (err) {
        console.error("Error in verifyEmail:", err);
        return res.status(500).json({ status: "error", message: "An error occurred" });
    }
}

