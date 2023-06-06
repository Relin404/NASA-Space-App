const express = require("express");

const launchesRouter = require("./launches");
const planetsRouter = require("./planets");

const api = express.Router();

api.use("/launches", launchesRouter);
api.use("/planets", planetsRouter);

module.exports = api;
