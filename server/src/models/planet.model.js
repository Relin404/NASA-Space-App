const chalk = require("chalk");
const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const { Planet } = require("./planet.mongo");

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

const getAllPlanets = async () => {
  const planets = await Planet.find({}, { _id: 0, __v: 0 });
  return planets;
};

const savePlanet = async (planet) => {
  try {
    await Planet.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
};

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(
          chalk.blueBright.italic(
            `${countPlanetsFound} habitable planets found!`
          )
        );
        resolve();
      });
  });
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
