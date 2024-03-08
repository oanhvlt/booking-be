//file chạy server
import express from 'express';
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
require('dotenv').config(); //khai báo thư viện dotenv
//import db from "./models/index";

let app = express();

//strict - origin - when - cross - origin
// Add headers before the routes are defined 
app.use(function (req, res, next) { //this is midleware

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//config app before use route

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

//limit: '50mb': allow upload large file/image
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//khai báo view 
viewEngine(app);
//khai báo route 
initWebRoutes(app);

//connect DB before listen
connectDB();
//db.connectDB;

//GET PORT đã khai bao tại file .env
let port = process.env.PORT || 6969; //If PORT === undefined => port = 6969

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: ", port);
})
