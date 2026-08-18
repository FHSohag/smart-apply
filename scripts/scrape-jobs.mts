import { ApifyClient } from "apify-client";
import fs from "fs";

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

const input = {
  keywords: "",
  country: "bd",
  maxItems: 1000,
  jobType: "",
  postedWithin: "",
  jobLevel: "",
  gender: "",
  descriptionFormat: "markdown",
  isRemote: false,
  fetchExtraJobInfo: true,
  enforceAnnualSalary: false,
};

console.log("Starting Apify scraper...");

const run = await client
  .actor("vero-api/bdjobs-jobs-scraper")
  .call(input);

const { items } = await client
  .dataset(run.defaultDatasetId)
  .listItems();

console.log(`Collected ${items.length} jobs`);

fs.writeFileSync(
  "bdjobs-1000.json",
  JSON.stringify(items, null, 2)
);

console.log("Saved bdjobs-1000.json");