import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { Controller } from "./controllers/Controller";

const app = express();

// CORS - handled by webpack proxying on the frontend
// See webpack config - port proxying circumvents cors on the frontend, but not on the backend
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Index.ts
 *
 * This is the main endpoint server of the application
 * Rendering will be performed by the frontend (mainly)
 *
 */

const controller = new Controller();

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

/*
TODO:
- auto suggest / auto complete in the UI
- make search more efficient
- call directions API as part of this
- allow for saving of results (new POST endpoint)
- standardise response format (from controllers)
*/
app.post("/search", async (req, res) => {
  const searchResponse = await controller.search.getSiteInformation(req.body);
  // console.log("searchResponse ", searchResponse);
  res.json({ searchResponse });
});
