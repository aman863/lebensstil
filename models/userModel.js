const mongoose= require("mongoose");
const validator= require("validator");
const bcrypt= require("bcrypt");
const crypto= require("crypto");
var uniqueValidator = require('mongoose-unique-validator');
const userSchema= new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Please provide your name"]
    },
    email:{
        type: String,
        validate:{
            validator: validator.isEmail,
            message:"Please provide a valid email address",
            lowercase: true
        },
        required:[true,"Email id is required"],
        unique:[true,"Email id already registered"]

    },
    password:{
        type:String,
        minlength:[8,"Password must be more that 8 characters long"],
        required:true,
        select:false
    },
    passwordConfirm:{
        type: String,
        required:true,
        validate:{
            validator: function(el){
                return el===this.password
            },
            message:"Passwords don't match"
        }
    },
    changedPasswordAt: {
        type: Date
    },
    resetPasswordToken: String,
    resetTokenExpiresAt: Date,
    photo: String,
    referalCode: String,
    refer:String,
    mailVerification:String,
    verified:{
        type:Boolean,
        default:false
    },
    address:{
        type:String
    },
    contact:{
        type:Number
    },
    country:{
        type:String
    },
    state:{
        type:String
    },
    zip:{
        type:String
    },
    razorpayOrderId:String,
    razorpayPaymentId:String,
    razorpaySignature:String,
    payment:{
        type:Boolean,
        default:false
    }
    
})
userSchema.plugin(uniqueValidator);
userSchema.pre("save",async function(next){
    if(! this.isModified("password")){
        return next();
    }
    this.password= await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")|| this.isNew){
        return next();
    }
    this.changedPasswordAt= Date.now()-1000;
    
    next();
})
userSchema.pre("save",function(next){
    if(this.isNew){
        this.refer= crypto.randomBytes(7).toString("hex");
        console.log(this.refer);
        return next();
    }

    
   
    next();
})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.createResetPasswordToken= function(){
    const resetToken=  crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken= crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetTokenExpiresAt= new Date(Date.now()+ 10*60*1000);
    console.log({resetToken},this.resetPasswordToken);
    return resetToken;
}



const User= mongoose.model("User",userSchema);
module.exports=User;
