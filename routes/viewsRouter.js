const express= require("express");
const router= express.Router();
const viewControllers= require("./../controllers/viewControllers");
const authControllers= require("./../controllers/authControllers");
const paymentControllers= require("./../controllers/paymentControllers");
const userControllers= require("./../controllers/userController");

router.use((req,res,next)=>{
    console.log("hello");
    next();
})

router.route("/").get(viewControllers.getHomePage);
router.route("/signup").get(viewControllers.getSignUpPage);
router.route("/login").get(viewControllers.getLoginPage);
router.route("/me").get(authControllers.protect,authControllers.checkVerification, viewControllers.getDashboard);
router.route("/mailVerification/:token").get(authControllers.mailVerification,paymentControllers.createOrder, viewControllers.getCheckoutPage);
// router.route("/logout").get(authControllers.protect,authControllers.logout);
router.route("/text").get(viewControllers.getVerificationPage);
router.route("/resendVerificationEmail").get(authControllers.resendVerificationEmail);
router.route("/forgotPassword").get(viewControllers.getForgotPasswordPage);
router.route("/forgotPassword").post(authControllers.forgetPassword);
router.route("/resetPassword/:token").get(viewControllers.getResetPasswordPage);
router.route("/resetPassword/:token").patch(authControllers.resetPassword);
router.route("/payment").get(paymentControllers.createOrder, viewControllers.getCheckoutPage);
router.route("/razorpayUpdate").post(authControllers.protect,userControllers.razorpayUpdate);
router.route("/verifyPayment").post(paymentControllers.verifyPayment);

module.exports= router;