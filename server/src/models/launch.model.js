const axios = require("axios");
const chalk = require("chalk");

const { Launch } = require("./launch.mongo");
const { Planet } = require("./planet.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/";

let defaultFlightNumber = 100;

const saveLaunch = async (launch) => {
  try {
    await Launch.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Failed to save launch ${err}`);
    throw new Error(`Failed to save launch`);
  }
};

const findLaunch = async (filter) => {
  const launch = await Launch.findOne(filter);

  return launch;
};

const existsLaunchWithId = async (launchId) => {
  const launchExists = await findLaunch({
    flightNumber: launchId,
  });

  return launchExists;
};

const populateLaunches = async () => {
  console.log(chalk.blueBright.italic(`Downloading launches data...`));

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log(`Problem downloading launch data`);
    throw new Error(`Launch data downloaded failed`);
  }

  const LaunchDocs = response.data.docs;
  for (const launchDoc of LaunchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    /**
     * Mapping:
     *
     * flightNumber => flight_number
     *
     * mission => name
     *
     * rocket => rocket.name
     *
     * launchDate => date_local
     *
     * target => not applicable; new feature
     *
     * customer => payload.customers for each payload (populate!)
     *
     * upcoming => upcoming
     *
     * success => success
     */
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
};

const loadLaunchesData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log(chalk.blueBright.italic(`Launches data already loaded`));
    return;
  } else {
    await populateLaunches();
  }
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await Launch.findOne().sort({ flightNumber: -1 });

  if (!latestLaunch) return defaultFlightNumber;

  return latestLaunch.flightNumber;
};

const getAllLaunches = async (skip, limit) => {
  const launches = await Launch.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
  return launches;
};

const scheduleNewLaunch = async (launch) => {
  const planet = await Planet.findOne({
    keplerName: launch.target,
  });

  if (!planet) throw new Error(`No matching planet found!`);

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["MashMash", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
};

const abortLaunchById = async (launchId) => {
  const abortedLaunch = await Launch.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return abortedLaunch.modifiedCount === 1;
};

module.exports = {
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
