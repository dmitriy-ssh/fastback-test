import { DataSource } from "typeorm";
import "./env";
import { initializeDatasource } from "datasource";
import { Parser } from "parser";
import { RequestHandler } from "requestHandler";
import { setupController } from "expressApp";

const DEFAULT_PORT = 3000;

async function main() {
  let datasource: DataSource;

  try {
    datasource = await initializeDatasource();
  } catch {
    console.log("Datasource initialization failed");
    process.exit(-1);
  }

  console.log("Datasource initializated");

  const parser = new Parser();
  const requestHandler = new RequestHandler(datasource, parser);
  const expressApp = setupController(requestHandler);

  expressApp.listen(process.env.PORT ?? DEFAULT_PORT);
}

main();
