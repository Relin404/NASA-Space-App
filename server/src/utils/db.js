const mongoose = require("mongoose");
const chalk = require("chalk");

require("dotenv").config();

// Now following event emitter pattern

mongoose.connection.once("open", () => {
  console.log(chalk.greenBright.bold(`MongoDB connection ready!`));
});

mongoose.connection.on("error", (err) => {
  console.error(chalk.hex("##FF0000")`${err}`);
});

const connectDB = async () => {
  const db = process.env.MONGO_URL;

  await mongoose.connect(db);

  console.log(chalk.green.italic(`Connected to cloud database!`));
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectDB,
  disconnectDB,
};

// const connectDBForMongoose5 = async () => {
//   try {
//     const db = process.env.MONGO_URL;

//     await mongoose.connect(db);
//     console.log(chalk.green(`Connected to ${db}`));
//   } catch (err) {
//     console.log(chalk.hex("#FF0000")`${err}`);
//   }
// };
