import db from "../models/index";
require('dotenv').config(); //to use process.env


let saveClinic = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name || !inputData.address || !inputData.imageBase64
                || !inputData.contentMarkdown || !inputData.contentHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {

                await db.Clinic.create({
                    name: inputData.name,
                    address: inputData.address,
                    image: inputData.imageBase64,
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                })

                resolve({
                    errCode: 0,
                    errMessage: "Save info succeed!"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

getAllClinics
let getAllClinics = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })

            }
            if (!data) data = {};
            resolve({
                errCode: 0,
                errMessage: "OK",
                data
            });

        } catch (e) {
            reject(e);
        }
    })
}


//getClinicById
let getClinicDetailsById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {

                let data = await db.Clinic.findOne({
                    where: { id:id },
                    attributes: ["name", "address", "contentHTML", "contentMarkdown"],
                    raw: true
                });

                if (data) {
                    let doctorClinic = await db.Doctor_Info.findAll({
                        where: { clinicId: id },
                        attributes: ['doctorId', 'provinceId'],
                        raw: true
                    })

                    data.doctorClinic = doctorClinic;
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data
                });

            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    saveClinic,
    getAllClinics,
    getClinicDetailsById
}