const logout= async function(){
    try {
        await axios({
            method:"get",
            url:"/api/v1/user/logout"
        })
        window.location.href = '/';
    } catch (err) {
       alert("error while logging out please try again")
    }
}
document.querySelector(".logout").addEventListener("click",e=>{
e.preventDefault();
logout();
})