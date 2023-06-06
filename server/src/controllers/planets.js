const { getAllPlanets } = require("../models/planet.model");

const httpGetAllPlanets = async (req, res, next) => {
  const planets = await getAllPlanets();
  res.status(200).json(planets);
};

module.exports = { httpGetAllPlanets };
