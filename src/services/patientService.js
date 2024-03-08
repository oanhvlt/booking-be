import db from "../models/index";
require('dotenv').config(); //to use process.env
import { sendSimpleEmail } from './emailService';
//generate token //doc: https://www.npmjs.com/package/uuid
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
}

let bookAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email || !inputData.fullName || !inputData.address || !inputData.selectedGender
                || !inputData.doctorId || !inputData.date || !inputData.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {
                let token = uuidv4();
                await sendSimpleEmail({
                    receiveEmail: inputData.email,
                    patientName: inputData.fullName,
                    time: inputData.timeString,
                    doctorName: inputData.doctorName,
                    language: inputData.language,
                    directLink: buildUrlEmail(inputData.doctorId, token),

                });

                //upsert patient
                //doc: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
                let user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
                        roleId: 'R3',
                        firstName: inputData.fullName,
                        phoneNumber: inputData.phoneNumber,
                        address: inputData.address,
                        gender: inputData.selectedGender,
                    },
                    raw: true
                });
                //console.log('check user found: ', user[0])
                //create a booking record
                if (user) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            date: inputData.date,
                        },
                        //data from BookingModal.js
                        defaults: {
                            statusId: 'S1',
                            patientId: user[0].id,
                            doctorId: inputData.doctorId,
                            date: inputData.date, //birthday from FE: 
                            timeType: inputData.timeType,
                            token: token
                        },

                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save booking succeed!",
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let verifyBookAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.token || !inputData.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                        token: inputData.token,
                        statusId: 'S1'
                    }//,raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Save appointment succeed!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist!",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    bookAppointment,
    verifyBookAppointment
}