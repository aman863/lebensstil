const express= require("express");
const bodyParser= require("body-parser");
const path= require("path");
const cookieParser=require("cookie-parser");
const AppError= require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const userRouter= require("./routes/userRouter");
const viewRouter= require("./routes/viewsRouter");
const app= express();
app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

app.use(express.json());
app.use(cookieParser());
app.use((req,res,next)=>{
    console.log(req.cookies);
    next();
})
app.use((req,res,next)=>{
    console.log("Aman");
    next();
})
console.log(process.env.NODE_ENV);
app.use("/",viewRouter);
app.use("/api/v1/user",userRouter);

app.all("*", (req,res,next)=>{
    next(new AppError(`cant find${req.originalUrl} on this server`,404));
})
app.use(globalErrorHandler);
module.exports= app;

