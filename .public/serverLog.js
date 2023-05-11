const express = require("express");
const fs = require('fs/promises');
const moment = require('moment');

const serverLog = async (req, res, next) => {
    const { method, url } = req;
    const date = moment().format("DD-MM-YYYY_hh:mm:ss");
    await fs.appendFile(".public/server.log", `\n${method} ${url} ${date}`);
    next();
};

module.exports = serverLog ;