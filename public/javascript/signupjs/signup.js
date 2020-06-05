

const signup=async(name,email,password,passwordConfirm)=>{
  try{
    console.log(name,email);
  const res= await axios({
    method:"post",
    url:"http://localhost:3000/api/v1/user/signUp",
    data:{
      name,
      email,
      password,
      passwordConfirm
    }
  });
  window.location.href = "http://localhost:3000/me";
  console.log(res);
}
catch(err){
  console.log(err.response.data);

  alert(err.response.data.error.message.split(":")[2]);
}

}


document.querySelector(".signup-form").addEventListener("submit", e=>{
  e.preventDefault();
  const name= document.querySelector("#name").value;
  const email= document.querySelector("#email").value;
  const password= document.querySelector("#password").value;
  const passwordConfirm= document.querySelector("#re_password").value;
  
  signup(name,email,password,passwordConfirm);

})