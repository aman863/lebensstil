exports.getHomePage = (req, res) => {
  console.log("home");
  res.status(200).render("home");
};
exports.getLoginPage = (req, res) => {

  res.status(200).render("login");
};
exports.getDashboard = (req, res) => {
  res.status(200).render("dashboard");
};
exports.getSignUpPage = (req, res) => {
    console.log("sign");
  res.status(200).render("signup");
};
