import db from "../models/index";
require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    //console.log('dataSend:', dataSend);
    //doc: https://nodemailer.com/smtp/testing/ >> Examples
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,// 465 if  secure: true,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"EDT" <${process.env.EMAIL_APP}>`, // sender address
        to: dataSend.receiveEmail, // list of receivers
        subject: dataSend.language === 'vi' ? "Test Xác nhận đặt lịch khám bệnh" : "Exam booking confirmation", // Subject line
        html: getBodyHTMLEmail(dataSend)
    });

}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
            <h3> Chào ${dataSend.patientName}</h3>
            <p>Bạn nhận được email này vì .....</p>
            <p>Thông tin đặt lịch như sau:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName} </b></div>
            <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link
            bên dưới để xác nhận.</p>
            <div><a href=${dataSend.directLink} target='_blank'>Click here</a></div>
            <p>Xin chân thành cảm ơn.</p>
        `
    }
    else if (dataSend.language === 'en') {
        result = `
            <h3> Dear ${dataSend.patientName}</h3>
            <p>You receive this email .....</p>
            <p>Appointment Schedule:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName} </b></div>
            <p>Please click link below to confirm.</p>
            <div><a href=${dataSend.directLink} target='_blank'>Click here</a></div>
            <p>Thank you.</p>
        `
    }
    return result;
}

//doc: https://nodemailer.com/message/attachments/

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,// 465 if  secure: true,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"EDT" <${process.env.EMAIL_APP}>`, // sender address
        to: dataSend.email, // list of receivers
        subject: dataSend.language === 'vi' ? `Kết quả khám bệnh ${dataSend.patientName}` : `Exam Feedback ${dataSend.patientName}`, // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [{   // encoded string as an attachment
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`, //file name must to '.png'
            content: dataSend.imgBase64.split('base64,')[1],
            encoding: 'base64'
            // filename: 'text1.txt',
            // content: 'hello world!'
        }],
    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
            <h3> Chào ${dataSend.patientName}</h3>
            <p>Bạn nhận được email này vì .....</p>
            <p>Thông tin hoá đơn được gởi trong file đính kèm</p>
            <p>Xin chân thành cảm ơn.</p>
        `
    }
    else if (dataSend.language === 'en') {
        result = `
            <h3> Dear ${dataSend.patientName}</h3>
            <p>You receive this email .....</p>
            <p>Invoice information is sent in the attached file</p>
            <p>Thank you.</p>
        `
    }
    return result;
}

module.exports = {
    sendSimpleEmail,
    sendAttachment
}