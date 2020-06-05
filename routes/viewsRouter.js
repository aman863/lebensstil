const express= require("express");
const router= express.Router();
const viewControllers= require("./../controllers/viewControllers");
const authControllers= require("./../controllers/authControllers");
const paymentControllers= require("./../controllers/paymentControllers");

router.use((req,res,next)=>{
    console.log("hello");
    next();
})

router.route("/").get(viewControllers.getHomePage);
router.route("/signup").get(viewControllers.getSignUpPage);
router.route("/login").get(viewControllers.getLoginPage);
router.route("/me").get(authControllers.protect, viewControllers.getDashboard);
router.route("/mailVerification/:token").get(authControllers.mailVerification,authControllers.protect,viewControllers.getDashboard);
// router.route("/logout").get(authControllers.protect,authControllers.logout);
router.route("/text").get(viewControllers.getVerificationPage);
router.route("/resendVerificationEmail").get(authControllers.resendVerificationEmail);
router.route("/forgotPassword").get(viewControllers.getForgotPasswordPage);
router.route("/forgotPassword").post(authControllers.forgetPassword);
router.route("/resetPassword/:token").get(viewControllers.getResetPasswordPage);
router.route("/resetPassword/:token").patch(authControllers.resetPassword);
router.route("/payment").get(paymentControllers.payment);

module.exports= router;