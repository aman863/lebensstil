const billingUpdate=async(name,email,address,contact,country,state,zip)=>{
    try {
        const res= await axios({
            method:"patch",
            url:"/api/v1/user/billingUpdate",
            data:{
                name,
                email,
                address,
                country,
                contact,
                state,
                zip
            }
        })
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}

document.querySelector(".btn").addEventListener("submit", function(e){
    e.preventDefault();
    const name = document.querySelector("#firstName").value;
    const email = document.querySelector("#email").value;
    const address = document.querySelector("#address").value;
    const contact = document.querySelector("#contact").value;
    const country = document.querySelector("#country").value;
    const state = document.querySelector("#state").value;
    const zip = document.querySelector("#zip").value;
    billingUpdate(name,email,address,contact,country,state,zip);

})