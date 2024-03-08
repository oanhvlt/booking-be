// const express = require('express');
import express from 'express';

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");//ejs: thư viện đã được install
    app.set("views", "./src/views"); //khai báo chính xác thư mục chứa file ejs
}

module.exports = configViewEngine;