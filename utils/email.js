const nodeMailer= require("nodemailer");

module.exports= async(options)=>{
    const transporter= nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })
    const mailOptions={
        from:"Aman Jain <aman29j2001@gmail.com>",
        to: options.email,
        subject:options.subject,
        text:options.text
    }

    await transporter.sendMail(mailOptions);
}