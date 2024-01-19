import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { InsertManyResult, MongoClient } from "mongodb";

import { mongoEnvVars, metOfficeEnvVars } from "./env-variables";
import { Site, SiteListResponse } from "../../model/Weather";
import { Controller } from "./controllers/Controller";

const app = express();

// CORS - handled by webpack proxying on the frontend
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Index.ts
 *
 * This is the main endpoint server of the application
 * Rendering will be performed by the frontend (mainly)
 *
 * TODO:
 * - environment variables (.env)
 * - create controllers for different endpoints
 * - search endpoint
 * - configure /sites to work with 3 hourly forecasts and mountain forecasts.
 * ^ These bring up different locations
 * - refresh facility (as per frontend version in SearchStore)
 *
 */

const controller = new Controller();

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

// See webpack config - port proxying circumvents cors on the frontend, but not on the backend

// NOTE: may not be much value in returning a list of sites to the frontend
// - user will want to search a specific location
// - more about searching the db for a location
// - this could be used in an info page though, for example

// 1. type in location
// 2. search sites on backend
// 3. auto suggest in UI
// 4. allow auto complete in UI (tab for example)
// 5. pick a site (by id)
// 6. call weather API
// 7. call directions API
app.get("/sites", async (req, res) => {
  const sites = await controller.sites.getWeatherSites();
  res.json({ sites });
});

app.post("/search", (req, res) => {
  console.log("TODO: searching...");
  res.send("SEARCH");
});
