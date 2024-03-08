import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => { //xử lý bất đồng bộ: use async/await
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error)
        }

    });
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true
                })
                if (user) {
                    //compare password //doc: https://www.npmjs.com/package/bcryptjs >> Usage - Sync
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password; //remove password in result
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found!";
                }

            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist. Plz try other email! `
            }

            resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (emailUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: emailUser }
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

// let getUsers = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let users = 'abc';
//             if (userId === 'ALL') {
//                 users = await db.User.findAll({
//                     attributes: {
//                         exclude: ['password']
//                     }
//                 });
//             }
//             else if (userId) {
//                 users = await db.User.findOne({
//                     where: { id: userId },
//                     attributes: {
//                         exclude: ['password']
//                     }
//                 });
//             }

//             resolve(users);
//             console.log(users);

//         } catch (e) {
//             reject(e);
//         }
//     })
// }

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                }
            });

            resolve(users);
            //console.log(users);

        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already used, plz try another mail'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                //modelName: 'User' in models/user.js
                await db.User.create({ // insert into users table in DB
                    email: data.email,
                    password: hashPasswordFromBcrypt, // lưu hash pass vào DB
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar,
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let editSummaryUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: `Missing required parameters!`
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                resolve({
                    errCode: 0,//update
                    message: `The user is updated.`
                });
            } else {
                resolve({
                    errCode: 1,
                    message: `User's not found!`
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: `Missing required parameters!`
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phoneNumber = data.phoneNumber;
                user.address = data.address;
                user.gender = data.gender;
                user.roleId = data.role;
                user.positionId = data.position;
                if (data.avatar) {
                    user.image = data.avatar;
                }


                await user.save();

                resolve({
                    errCode: 0,//update
                    message: `The user is updated.`
                });
            } else {
                resolve({
                    errCode: 1,
                    message: `User's not found!`
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let errCode = 0;
            let message = 'The user is deleted.';
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await db.User.destroy({
                    where: { id: userId }
                })
            }
            else {
                errCode = 2;
                message = `The user isn't exist.`;
            }
            resolve({
                errCode,
                message
            });


        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }



        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers,
    //getUsers,
    createNewUser,
    editSummaryUser,
    editUser,
    deleteUser,
    getAllCodeService
}