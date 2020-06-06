const forgotPassword=async(email)=>{
    const res= await axios({
        method:"POST",
        url:"/forgotPassword",
        data:{
            email
        }
    })
    console.log(res);
}
document.querySelector(".btn").addEventListener("click",e=>{
    e.preventDefault();
    const email= document.querySelector("#email").value;
    forgotPassword(email);

})