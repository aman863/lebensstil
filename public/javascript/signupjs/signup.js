

const signup=async(name,email,contact,address)=>{
  try{
    
  const res= await axios({
    method:"post",
    url:"/api/v1/user/signUp",
    data:{
      name,
      email,
      contact,
      address
    }
  });
  window.location.href = "/text";

}
catch(err){
  

  alert(err.response.data.error.message.split(":")[2]);
}

}


document.querySelector(".signup-form").addEventListener("submit", e=>{
  e.preventDefault();
  const name= document.querySelector("#name").value;
  const email= document.querySelector("#email").value;
  const contact= document.querySelector("#contact").value;
  const address= document.querySelector("#address").value;
  
  signup(name,email,contact,address);

})