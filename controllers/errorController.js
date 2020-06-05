const sendErrorDev= (err,res)=>{
    console.log("hello from the errordev")
    res.status(err.statusCode).json({
             
         status: err.status,
         message: err.message,
         stack:err.stack,
         error:err
    });
}
const handleCastErrorDb= (err,res)=>{
    return new AppError("invalid "+err.path+" : "+err.value,404);
}
const sendErrorProd= (err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
              
            status: err.status,
            message: err.message,
           
       });
    }
    else{
        //1) log error
        console.error("ERROR",err);

        //2) send generic message
        res.status(500).json({
             status:"error",
             message:"something went very wrong"
        })
   }

}
const handleDuplicateKeysDb= err=>{
    return new AppError("duplicate key value:"+ err.keyValue.name+" . please try another value",400);
}
const handleJwtError= err=>{
 return new AppError("invalid token!please try again",401);
}
const handleJwtExpirationError= err=>{
    return new AppError("you are logged out.please log in again",401);
}


const handleValidationError=(err)=>{
   const errors= Object.values(err.errors).map(el=>{
        el.message
    });
  return new AppError(`invalid input: ${errors.join(",")}`,400);

}
module.exports= (err,req,res,next)=>{
    
    err.statusCode= err.statusCode || 500;
    err.status= err.status || "fail";
   if(process.env.NODE_ENV==="development")
        sendErrorDev(err,res);
  else if(process.env.NODE_ENV==="production"){
  let error={...err};
  {
    if(error.name==="CastError"){
        error = handleCastErrorDb(error);
   }
   if(error.code===11000){
        error= handleDuplicateKeysDb(error);
   }

   if(error.name==="ValidationError"){
        error= handleValidationErrorDb(error);
   }
   if(error.name==="JsonWebTokenError"){
        error= handleJwtError(error);
   }
   if(error.name==="TokenExpiredError"){
        error= handleJwtExpirationError(error);
   }
   sendErrorProd(error,res);
  }
  
}

}