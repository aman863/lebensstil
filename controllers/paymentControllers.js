const Razorpay=require("razorpay");
exports.createOrder= async(req,res,next)=>{
  var instance = new Razorpay({
    key_id: 'rzp_test_Jd0KF8nDw8pMC4',
    key_secret: 'trzSHuA3lj6eudlbKt0FFbfm'
  })
    var options = {
        amount: 200000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: '1'
      };
      const order = await instance.orders.create(options);
      console.log(order.id);
      req.order_id=order.id;
      req.key='rzp_test_Jd0KF8nDw8pMC4';
      
      next();
}

exports.verifyPayment=async(req,res)=>{
  console.log("hello from verification");
  console.log(req.body.razorpay_order_id,req.body.razorpay_payment_id,req.body.razorpay_signature);
}