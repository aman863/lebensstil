
(function($) {

    $(".toggle-password").click(function() {

        $(this).toggleClass("zmdi-eye zmdi-eye-off");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
          input.attr("type", "text");
        } else {
          input.attr("type", "password");
        }
      });

})(jQuery);
const signup=async(name,email,password,passwordConfirm,code)=>{
  try{
    console.log(name,email);
  const res= await axios({
    method:"post",
    url:"http://localhost:3000/api/v1/user/signUp",
    data:{
      name,
      email,
      password,
      passwordConfirm,
      code
    }
  });
  console.log(res);
}
catch(err){
  console.log(err.response.data);
}
}


document.querySelector(".signup-form").addEventListener("submit", e=>{
  e.preventDefault();
  const name= document.querySelector("#name").value;
  const email= document.querySelector("#email").value;
  const password= document.querySelector("#password").value;
  const passwordConfirm= document.querySelector("#re_password").value;
  const code= document.querySelector("#code").value;
  signup(name,email,password,passwordConfirm,code);

})