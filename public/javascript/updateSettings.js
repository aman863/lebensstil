
const updateData= async(name,email)=>{
    try{
        console.log("hello");
    const res=await axios({
        method:"PATCH",
        url:"http://localhost:3000/api/v1/user/updateMe",
        data:{
            name
        }
    });
    window.location.href = "http://localhost:3000/me";
    console.log(res);

}
catch(err){
    console.log(err.response);
   alert(err.response.data.message);
}
}

const updatePassword=async(currentPassword,newPassword,newPasswordConfirm)=>{
    try {
       const res= await axios({
            method:"PATCH",
            url:"http://localhost:3000/api/v1/user/updateMypassword",
            data:{
                currentPassword,
                newPassword,
                newPasswordConfirm
            }
        })
        // window.location.href = "http://localhost:3000/me";
        console.log(res);
    } catch (err) {
        console.log(err.response);
        alert(err.response.data.message);
    }
}


document.querySelector(".saveSet").addEventListener("click",function(e){
    e.preventDefault();
    //  const email=document.querySelector("#email").value;
     const name=document.querySelector("#name").value;
     updateData(name);
    })

    document.querySelector(".savePass").addEventListener("click",function(e){
        e.preventDefault();
        const currentPassword=document.querySelector("#password-current").value;
        const newPassword=document.querySelector("#password").value;
        const newPasswordConfirm=document.querySelector("#password-confirm").value;
        updatePassword(currentPassword,newPassword,newPasswordConfirm);
    })
