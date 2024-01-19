# Weather Warrior

## Problem Statement

As a weekend warrior, I want to be able to find the best place to climb with minimal effort.

I want to be able to check the weather and conditions are various places I like to climb.

I want to be given a list of crags, ranked by the likely conditions at each.

I want to be able to specify a maximum drive time and a maxiumu walk in time.

## Solution

**V1 / beta version**
_This will rely upon information contributed by the user, for publicly available APIs for the sort of information required do not exist._

- Search location, get weather, get drive time (API calls - MetOffice DataPoint, Google Directions API)
- add notes to location (crags, walk in times, aspect, seepage, climbing type)
- save location(s) + user data
- ^ associate locations to climbing type + seasons
- Once saved, can select climbing type + drive time to search
- This will rank results using user input data

## Stack

- React
- Express
- Mongo

## Setup

1. Ensure you are running node version v18.2.0 or later. If using nvm, run `nvm use v18.2.0` or `nvm alias default v18.2.0`. Some useful nvm (node version manager) commands can be found [here](https://gist.github.com/chranderson/b0a02781c232f170db634b40c97ff455).
2. Clone this repo
3. In `backend/src`, create a file entitled `env-variables.ts` with the following:

```javascript
export const mongoEnvVars = {
  username: "",
  password: "",
  url: "",
  dbName: "",
};

export const metOfficeEnvVars = {
  apiKey: "",
  url: "http://datapoint.metoffice.gov.uk/public/data/",
  dataType: "json/",
  siteList: "sitelist?",
  threeHourly: "val/wxfcs/all/",
  hourly: "val/wxobs/all/",
};
```

3. Create a mongodb account, setup a cluster and a database. Click to connection via node.js, and paste your connection details into your `env-variables.ts` file.
4. Create a Met Office DataPoint account, and paste your api key into your `env-variables.ts` file.
5. `cd` into `/frontend`, run `npm install`
6. `cd` into `/backend`, run `npm install`
7. `cd ..` to go into root directory, then `npm run dev`, then go to [localhost:3000](http://localhost:3000/) in your browser
