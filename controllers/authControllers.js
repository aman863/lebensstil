const User= require("./../models/userModel");
const jwt= require("jsonwebtoken");
const AppError= require("./../utils/appError");
const{promisify}= require("util");
const Email= require("./../utils/email");
const crypto= require("crypto");


exports.signUp=async(req,res,next)=>{
    try {
       console.log("signup");
        // const user= await User.findOne({refer:req.body.referalCode});
        // if(!user){
        //     return next(new AppError("Invalid referal code",400));
        // }
        const mailVerification=await crypto.randomBytes(32).toString("hex");
        console.log(mailVerification);
        const newUser= await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            referalCode:req.body.referalCode,
            mailVerification:mailVerification
        });
        console.log("done");
        const url=`${req.protocol}://${req.get("host")}/mailVerification/${mailVerification}`;
        console.log(url);
        // await new Email(newUser,url).sendWelcome();
        console.log(newUser._id);
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
            expiresIn:"30d"
        });
        console.log(token);
       
        const cookieOptions={
            expires: new Date(Date.now()+ 30*24*60*60*1000),
        }
        // we want secure option only in prodcution not in production
        // if(process.env.NODE_ENV==="production") cookieOptions.secure=true; 
        res.cookie("jwt",token,cookieOptions);
          res.status(200).json({
              status:"success",
              token,
              newUser
          });
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status:"fail",
            error
        });
        
    }
}
exports.login= async(req,res,next)=>{
    try {
        console.log("login");
        const{email,password}= req.body;
        if(!email || !password)
        return next(new AppError("Please provide email and password",400));

        const user = await User.findOne({email:email}).select("+password");

        if(!user || !(await user.correctPassword(password,user.password)))
        return next(new AppError("Invalid Email or Password"));

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"30d"
        });
        const cookieOptions={
            httpOnly:true,
            expires:new Date(Date.now()+30*24*60*60*1000)
        }
        // if(process.env.NODE_ENV==="production") cookieOptions.secure= true;

        res.cookie("jwt",token,cookieOptions);

      res.status(200).json({
          status:"success",
         token
      })
     
    } 
    catch (error) {
        console.log(error);
        res.status(400).json({
            status:"fail",
            error
        });
    }
}
exports.protect=async(req,res,next)=>{
    try{
    console.log("token");
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("bearer")){
        token= req.headers.authorization.split(" ")[1];

    }
    else if(req.cookies.jwt){
        token= req.cookies.jwt;
    }

    console.log(token);
    if(!token){
    return next(new AppError("you are not logged in",401));
    }
    console.log("here");
    const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
   console.log(decoded);
    const currentUser= await User.findById(decoded.id);
   console.log(currentUser);
    if((currentUser.changedPasswordAt/1000)> decoded.iat){
      return next(new AppError("user recently changed password please log in again",400));
    }
    console.log("here 1");

    if(!currentUser){
        return next(new AppError("The user belonging to this email id no longer exist"));
    }
    console.log("here 2");
    req.user= currentUser;
    console.log("authenticated");
    next();
    }
 catch(err){
     console.log(error);
     res.status(401).json({
         status:"fail",
         err
     });

}
}
exports.forgetPassword= async(req,res,next)=>{
    try {
       const  email= req.body.email;
        const currentUser= await User.findOne({email: email});
        if(!currentUser) return next(new AppError("no user with that email",400));
        const token = currentUser.createResetPasswordToken();
        currentUser.save({validateBeforeSave: false});
        console.log(currentUser);
        const resetUrl = `${req.protocol}://${req.get("host")}/resetPassword/${token}`;
        // const message= `forgot password? submit a patch request to ${resetUrl} with password and passwordConfirm`;
        // await sendMail({
        //     email:email,
        //     subject:"Reset password",
        //     text: message
        // });
        new Email(currentUser,resetUrl).sendResetPassword();
        res.status(200).json({
            status:"success",
            message:"token sent to mail"
        })
    } catch (err) {
        currentUser.resetPasswordTokenExpiresAt=undefined;
        currentUser.resetPasswordToken=undefined;
        console.log(err);
        res.status(401).json({
            status:"fail",
            err
        })
    }
}

exports.resetPassword= async(req,res,next)=>{
    try{
    
    const hashedToken= crypto.createHash("sha256").update(req.params.token).digest("hex");
   
    const user= await User.findOne({
        resetPasswordToken:hashedToken,
        resetTokenExpiresAt:{
            $gt: Date.now()
        }
    });
    if(!user){
        return next(new AppError("invalid or expired token",401));
    }
    user.password= req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.resetTokenExpiresAt=undefined;
    user.resetPasswordToken=undefined;
    user.save();

    const token = await jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
    const cookieOptions={
        httpOnly:true,
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000)
    }
    if(process.env.NODE_ENV==="production") cookieOptions.secure= true;

    res.cookie("jwt",token,cookieOptions);

      console.log("done");
      res.status(200).json({
          status:"success",
          message:"password reset successful"
      })
    
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            status:"fail",
            err
        });
    }
}

exports.updateMyPassword= async(req,res,next)=>{
    console.log("pass");
    const {currentPassword, newPassword, newPasswordConfirm}= req.body;
    const user= req.user;
    if(!currentPassword || !(user.correctPassword(currentPassword,user.password))){
        return next(new AppError("please Enter a correct current Password",401));
    }
    console.log("pass1");
    if(!(newPassword===newPasswordConfirm)){
        return next(new AppError("passwords dont match",401));
    }
    console.log("pass2");
    user.password= newPassword;
    user.passwordConfirm= newPasswordConfirm;
    user.save()
    console.log("pass3");
   res.status(200).json({
       status:"success",
       message:"password updated"
   });


}

exports.logout=async(req,res)=>{
    res.cookie("jwt","logged out",{
        expires: new Date(Date.now()+ 10*1000),
        httpOnly:true
    });
    res.redirect("/login");
}
exports.mailVerification= async(req,res)=>{
    try{
  const user= await User.findOne({mailVerification:req.params.token}); 
  if(!user){
      return next(new AppError("verification token is not valid",400));
  }
  console.log(user);
   user.verified=true;
   console.log("user");
   await user.save({validateBeforeSave:false});
   res.redirect("/me");
}
catch(err){
    console.log(err);
}

}
exports.checkVerification=(req,res,next)=>{
    try{
   const user= req.user;
   if(user.verified){
       next();
   }
   res.render("text",{
       heading:"You are not verified.Check your mail and verify your account",
       title:"Not verified"
   });
    }
    catch(err){
        console.log(err);
    }
}


exports.resendVerificationEmail=async(req,res)=>{
    try{ 
      const token= req.cookies.jwt;
      const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
      const user= await User.findById({_id:decoded.id});
      const mailVerification= user.mailVerification;
    const url=`${req.protocol}://${req.get("host")}/mailVerification/${mailVerification}`;
    await new Email(user,url).sendWelcome();
    res.render("text",{
        title:"mail sent",
        heading:"mail sent !"
    });

    }
    catch(err){
        console.log(err);
    }
}


