exports.getHomePage = (req, res) => {
  console.log("home");
  res.status(200).render("home");
};
exports.getLoginPage = (req, res) => {

  res.status(200).render("login");
};
exports.getDashboard = (req, res) => {
  const user= req.user;
  res.status(200).render("dashboard",{
    user
  
  });
};
exports.getSignUpPage = (req, res) => {
    console.log("sign");
  res.status(200).render("signup");
};

exports.getVerificationPage= (req,res)=>{
  res.status(200).render("text",{heading:"we have sent an verification link to your email.Please verify",
  title:"Verify",
  link:"Resend Mail"

  });
}

exports.getForgotPasswordPage= (req,res)=>{
  res.render("forgotPassword");
}
exports.getResetPasswordPage=(req,res)=>{
  
  res.render("resetPassword");
}

exports.token=(req,res,next)=>{
  console.log(req.params.token);
  next();
}
exports.getCheckoutPage=(req,res)=>{
  const order_id= req.order_id;
  const key= req.key;
  

res.render("checkout",{
  order_id,
  key
});
}

exports.getSchedulePage=(req,res)=>{
  res.render("schedule");
}
exports.getConfirmationPage=(req,res)=>{
  res.status(200).render("text",{heading:"Congratulations ! You are now part of Lebenstill family. Our team will contact you soon",
  title:"Confirmed",
  link:"Home"

  });
}