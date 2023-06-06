const express = require("express");

const router = express.Router();

const { httpGetAllPlanets } = require("../controllers/planets");

router.get("/", httpGetAllPlanets);

module.exports = router;
