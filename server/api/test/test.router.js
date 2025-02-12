const express = require("express");
const testController = require("./test.controller");

const testRouter = express.Router();
testRouter.get("/", testController.test);


module.exports = testRouter;
