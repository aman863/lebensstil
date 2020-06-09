const express=require("express");

const authControllers= require("./../controllers/authControllers");
const userControllers= require("./../controllers/userController");
const Router= express.Router();
Router.use((req,res,next)=>{
    console.log("users");
    next();
})


Router.route("/signUp").post(authControllers.signUp);
Router.route("/login").post(authControllers.login);
Router.route("/logout").get(authControllers.logout);
Router.route("/forgetPassword").post(authControllers.forgetPassword);
Router.route("/resetPassword/:token").patch(authControllers.resetPassword);
Router.route("/updateMe").patch(authControllers.protect,userControllers.uploadPhoto,userControllers.resizeUploadedPhoto,userControllers.updateMe);
Router.route("/updateMyPassword").patch(authControllers.protect,authControllers.updateMyPassword);
Router.route("/referedUsers").get(authControllers.protect,userControllers.getReferedUsers);
Router.route("/referedByUser").get(authControllers.protect,userControllers.getReferedByUser);
Router.route("/billingUpdate").patch( userControllers.billingUpdate);
Router.route("/razorpayUpdate").patch()

module.exports= Router;