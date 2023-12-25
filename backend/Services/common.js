import passport from "passport";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();


let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'jitenmohantyaz@gmail.com', // gmail
    pass: process.env.MAIL_PASSWORD, // pass
  },
})

export const isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

export const sendMail = async function({to, subject, text, html}){
  let info = await transporter.sendMail({
    from: '"E-commerce" <jitenmohantyaz@gmail.com>', // sender address
    to,
    subject,
    text,
    html
  });
return info ;  
}


