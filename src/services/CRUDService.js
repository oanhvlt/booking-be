import db from "../models/index";
import bcrypt from 'bcryptjs';

//service: nhận data từ controller và thao tác ở database >> trả result về controller

//thuat toan hash pass trong bcrypt
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

//config timezone: in file config/config.json
let createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            //modelName: 'User' in models/user.js
            await db.User.create({ // ~ insert into users table in DB
                email: data.email,
                password: hashPasswordFromBcrypt, // lưu hash pass vào DB
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender === '1' ? true : false,
                address: data.address,
                phoneNumber: data.phoneNumber,
                roleId: data.roleId
            })
            resolve('Create a new user succeed!');
        } catch (error) {
            reject(error)
        }
    })
}


let getAllUser = () => {
    return new Promise(async (resolve, reject) => {//hàm Promise xử lý bất đồng bộ => đồng bộ
        try {
            let users = await db.User.findAll({   //doc guide: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
                //raw: true,
            });
            //console.log(users)
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: userId
                },
                //raw: true
            })
            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            //console.log('update info', user)
            if (user) {

                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                //let allUsers = await db.User.findAll();
                //resolve(allUsers); //~ return allUsers
                resolve();
            } else {
                resolve();
            }
        } catch (error) {
            //console.log(error);
            reject(error);

        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                user.destroy();
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUserData,
    deleteUserById
}