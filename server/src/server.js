const chalk = require("chalk");
const http = require("http");

require("dotenv").config();

const app = require("./app");

const { connectDB } = require("./utils/db");
const { loadPlanetsData } = require("./models/planet.model");
const { loadLaunchesData } = require("./models/launch.model");

const port = process.env.PORT || 8000;

const server = http.createServer(app);

/**
 * Strict order of async operations:
 *
 * 1- Connect database; allowing for subsequent loading
 *
 * 2- Load planets data; allowing launches to reference it
 *
 * 3- Load launches data; can reference planets successfully
 */
const startServer = async () => {
  try {
    await connectDB();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(port, () => {
      console.log(chalk.magenta.bold(`Server running on port ${port}...`));
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
