const nodeMailer= require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const pug= require("pug");
const htmlToText= require("html-to-text");

module.exports= class Email{
    constructor(user,url){
        this.to= user.email;
        this.firstName= user.name.split(" ")[0];
        this.url= url;
        this.from=`Aman jain <${process.env.EMAIL_FROM}>`;
    }
    newTransport(){
        if(process.env.NODE_ENV==="production"){
            //sendGrid
            return nodeMailer.createTransport(
                nodemailerSendgrid({
                    apiKey: process.env.SENDGRID_API_KEY
                })
            );
        }

        return nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user: process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });
       
        }
         //send the actual email
         async send(template,subject){
             //render the html file
             const html= pug.renderFile(`${__dirname}/../views/${template}.pug`,{
                 firstName:this.firstName,
                 url:this.url,
                 subject
             });

             //define mailoptions
               
            const mailOptions={
        from:this.from,
        to: this.to,
        subject:subject,
        text:htmlToText.fromString(html),
        html:html
    }
          // create a transport and send mail
         const transporter=this.newTransport();
          await transporter.sendMail(mailOptions);
         }

         async sendWelcome(){
             console.log("welcome")
             await this.send("welcomeEmail","welcome to Lebensstil");
         }
         async sendResetPassword(){
             await this.send("resetPasswordEmail","Reset Password");
         }

    }


