import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";

const port = process.env.PORT || 3000; //set Port Environment listen 3000

import indexRouter from "./src/routes/index";

import dbConfig from "./src/config/database.config"; // add database config

// api route
import apiRouter from "./src/routes/api/api"; // api
import usersApiRouter from "./src/routes/api/users"; // users
import accountsApiRouter from "./src/routes/api/accounts"; // accounts

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); // json parser
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Connecting database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

mongoose.set("useCreateIndex", true);

// route
app.use("/", indexRouter);

//api route
app.use("/api", apiRouter);
app.use("/api/users", usersApiRouter);
app.use("/api/accounts", accountsApiRouter);

// catch 404
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status(404);
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => console.log(`app listening on ${port}`));
