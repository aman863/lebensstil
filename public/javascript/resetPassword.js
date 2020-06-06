const resetPassword= async(password,passwordConfirm)=>{
    try{
        const token= window.location.href.split("/")[4];
    const res= await axios({
        method:"patch",
        url:`/api/v1/user/resetPassword/${token}`,
        data:{
            password,
            passwordConfirm
        }

        

    })
    
    console.log(res);
}
catch(err){
    console.log(err);
}
}

document.querySelector(".btn").addEventListener("click",e=>{
    e.preventDefault();
    const password= document.querySelector("#new_password").value;
    const passwordConfirm= document.querySelector("#new_password_confirm").value;
    resetPassword(password,passwordConfirm);
})