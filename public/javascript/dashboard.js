const logout= async function(){
    try {
        await axios({
            method:"get",
            url:"http://localhost:3000/api/v1/user/logout"
        })
        window.location.href = 'http://localhost:3000';
    } catch (err) {
       alert("error while logging out please try again")
    }
}
document.querySelector(".logout").addEventListener("click",e=>{
e.preventDefault();
logout();
})