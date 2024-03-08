import db from "../models/index";
require('dotenv').config(); //to use process.env


let saveSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name || !inputData.imageBase64 || !inputData.contentMarkdown || !inputData.contentHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {

                //upsert to specialty table
                // let specialty = await db.Specialty.findOne({
                //     where: { id: '1' }
                // })
                // if (specialty) {
                //     // //update
                //     // specialty.name = inputData.name;
                //     // await specialty.save();
                // } else {
                //     //create
                //     await db.Specialty.create({
                //         name: inputData.name,
                //         image: inputData.image,
                //         contentHTML: inputData.contentHTML,
                //         contentMarkdown: inputData.contentMarkdown,
                //     })
                // }
                await db.Specialty.create({
                    name: inputData.name,
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

//getAllSpecialties
let getAllSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            //decode image (chuyển blob to string)
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


//getSpecialtyById
let getSpecialtyDoctorById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {

                let data = await db.Specialty.findOne({
                    where: { id },
                    attributes: ["contentHTML", "contentMarkdown"],
                    raw: true
                });

                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: id },
                            attributes: ['doctorId', 'provinceId'],
                            raw: true
                        })

                    } else {
                        //find doctor by location
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                            raw: true
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;
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
    saveSpecialty,
    getAllSpecialties,
    getSpecialtyDoctorById
}