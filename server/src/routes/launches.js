const express = require("express");

const router = express.Router();

const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("../controllers/launches");

router.post("/", httpAddNewLaunch);

router.get("/", httpGetAllLaunches);

router.delete("/:id", httpAbortLaunch);

module.exports = router;
