const dotenv= require("dotenv");
dotenv.config({path:"./config.env"});
const app= require("./app");
const mongoose= require("mongoose");
process.on("uncaughtException",err=>{
    console.log("uncaught exception. Shutting down...");
    console.log(err.name,err.message);
    process.exit(1);
})

const DB= process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD);
console.log(DB);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
    
    
}).then(()=> console.log("Database connected succesfully"));
const port= process.env.PORT || 3000;
app.listen(port,function(){
    console.log("server is up and running");
});


process.on("unhandledRejection",err=>{
    console.log("unhandled rejection : shutting down...");
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    })
});