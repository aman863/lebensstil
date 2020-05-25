const express= require("express");
const router= express.Router();
const viewControllers= require("./../controllers/viewControllers");
const authControllers= require("./../controllers/authControllers");

router.use((req,res,next)=>{
    console.log("hello");
    next();
})

router.route("/").get(viewControllers.getHomePage);
router.route("/signUp.html").get(viewControllers.getSignUpPage);
router.route("/login.html").get(viewControllers.getLoginPage);
router.route("/me").get(authControllers.protect,viewControllers.getDashboard);
// router.route("/logout").get(authControllers.protect,authControllers.logout);

module.exports= router;