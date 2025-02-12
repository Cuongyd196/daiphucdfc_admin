const express = require("express");
const testRouter = require("./api/test/test.router");

const router = express.Router();

router.use("/test", testRouter);

module.exports = router;
