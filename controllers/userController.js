const User= require("./../models/userModel");
const AppError= require("./../utils/appError");
const multer= require("multer");
const sharp= require("sharp");
const filterObj=(obj,...allowedFields)=>{
    
    const objArray= Object.keys(obj);
    const newObj ={};
    objArray.forEach(field =>{
        if(allowedFields.includes(field)) newObj[field]= obj[field];
    }); 
    return newObj;
}

// const multerStorage= multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,"public/img/users");
//     },
//     filename: (req,file,cb)=>{
//         const ext= file.mimetype.split("/")[1];
//         console.log(req.body);
//         cb(null,`${req.body.email.split("@")[0]}-${file.originalname}-${Date.now()}.${ext}`);
//     }
// });
const multerStorage= multer.memoryStorage();
const multerFilter= (req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true);
    }
    else{
        cb(new AppError("only upload an image",400),false);
    }
}
const upload= multer({
    storage:multerStorage,
    fileFilter: multerFilter
});

exports.uploadPhoto= upload.single("photo");
exports.resizeUploadedPhoto= (req,res,next)=>{
    if(!req.file) return next();
    req.file.filename= `${req.user.email.split("@")[0]}-${req.file.originalname}-${Date.now()}.jpeg`;
    sharp(req.file.buffer).resize(500,500).toFormat("jpeg").jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`);
   next();
  }

exports.updateMe= async(req,res,next)=>{
    try
{   
    
    const user= req.user;
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("this route is not for password update."))
    }
    if(req.file){
        req.body.photo= req.file.filename;
    }
    
    const filteredObject = filterObj(req.body,"name","email","photo");

    console.log("update");
    const updatedUser= await User.findByIdAndUpdate({_id:user.id},filteredObject,{new:true, runValidators:true});
    res.status(200).json({
        status:"success",
        user: updatedUser
    });}
    catch(err)
{
    console.log(err);
    res.status(400).json({
        status:"fail",
        err
    })
}}
exports.getReferedUsers= async(req,res,next)=>{
   try {
       const user= req.user;
       const referedUsers= await User.find({referalCode: user.refer});
       if(!referedUsers){
           res.status(404).json({
               message:"you did not refer anyone. Refer now and earn"
           })
       }
       res.status(200).json({
           status:"success",
           referedUsers
       });
   } catch (err) {
       console.log(err);
       res.status(404).json({
           status:"fail",
           err
       });
   }
}

exports.getReferedByUser= async(req,res,next)=>{
    try {
        const user= req.user;
        if(!user.referalCode){
            res.status(404).json({
                message:"you were not refered by someone"
            });
        }
        const referedByUser= await User.findOne({refer: user.referalCode});
        
            res.status(200).json({
                referedBy: referedByUser
            });
        
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status:"fail",
            err
        });
    }
}

exports.billingUpdate=async(req,res)=>{
    try{
    

    const updateOptions={
        address:req.body.address,
        contact:req.body.contact,
        country:req.body.country,
        zip:req.body.zip
    }
    const updatedUser= await User.findOneAndUpdate({email:req.body.email},updateOptions,{new:true});

    res.status(200).json({
        status:"success",
        updatedUser
    });
}
catch(err){
    console.log(err);
    res.status(400).json({
        status:"fail",
        err
    })
}

}
exports.razorpayUpdate=async(req,res)=>{
    try {
        const user= req.user;
        const updateOptions={
            razorpayPaymentId:req.body.razorpay_payment_id,
            razorpayOrderId:req.body.razorpay_order_id,
            razorpaySignature:req.body.razorpay_signature,
            payment:true

        }
        const updatedUser= await User.findOneAndUpdate({email:user.email},updateOptions,{new:true});
        const generated_signature = hmac_sha256(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id, "trzSHuA3lj6eudlbKt0FFbfm");

        if (generated_signature == req.body.razorpay_signature) {
            
            res.redirect("/me");
          }
          res.status(400).json({
           status:"fail",
           message:"unsuccessful payment"
          });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            status:"error",
            err
        })
    }
}