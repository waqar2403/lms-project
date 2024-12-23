import nodemailer, {Transporter} from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
require('dotenv').config();

interface Emailoptions {
    email: string;
    subject: string;
    template: string;
    data: {[key:string]:any,ActivationCode:any};
}
const sendMail = async (options: Emailoptions):Promise <void> => {
 const transporter:Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '567'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
 });
    const {email,subject,template,data} = options;

    //get path to template
    const templatePath = path.join(__dirname,`../mail`,template);
    const html = await ejs.renderFile(templatePath,data);
    const mailoptions = {
        from: process.env.SMTP_EMAIL,
        to: email, 
        subject,
        html
    }
    await transporter.sendMail(mailoptions);
}

export default sendMail;