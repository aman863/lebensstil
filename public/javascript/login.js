
const login= async(email,password)=>{
    try{
        console.log(email,password);
    const res= await axios({
        method:"post",
        url:"http://localhost:3000/api/v1/user/login",
        data:{
            email,
            password
        }
    });
    window.location.href = "http://localhost:3000/me";
    console.log(res);
}
    catch(err){
        alert(err.response.data.message);
    }
}

document.querySelector(".btn").addEventListener("click", e=>{
    e.preventDefault();
    const email= document.querySelector("#email").value;
    const password= document.querySelector("#password").value;
    login(email,password);
})