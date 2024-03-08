import db from "../models/index";
import CRUDService from '../services/CRUDService';


let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll(); //User: khai báo trong models

        return res.render('homepage.ejs', {
            data: JSON.stringify(data),
            msg: 'get successfull users'
        });
    } catch (e) {
        console.log(e);
    }
}
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let data = req.body;
    let message = await CRUDService.createNewUser(data);
    console.log('message: ', message);
    return res.send('post crud from service');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    // console.log('----------');
    // console.log(data);
    // console.log('----------');

    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        //check user data not found

        //
        return res.render('editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send("Users not found!");
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    //let allUsers = await CRUDService.updateUserData(data);
    // return res.render('displayCRUD.ejs', {
    //     dataTable: allUsers
    // });
    return res.redirect("/get-crud");
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        await CRUDService.deleteUserById(userId);
        return res.redirect("/get-crud");
        //return res.send("User deleted!");
    } else {
        return res.send("User not found!");
    }

}

module.exports = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD
}