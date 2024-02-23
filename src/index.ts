import { DataSource } from "typeorm";
import "./env";
import { initializeDatasource } from "./datasource";
import { Parser, ParserFactory } from "./parser";
import { RequestHandler } from "./requestHandler";
import { setupController } from "./expressApp";

const DEFAULT_PORT = 3000;

async function main() {
  let datasource: DataSource;

  try {
    datasource = await initializeDatasource();
  } catch (e) {
    console.log("Datasource initialization failed", e);
    process.exit(-1);
  }

  console.log("Datasource initializated");

  const parserFactory = new ParserFactory();
  const requestHandler = new RequestHandler(datasource, parserFactory);
  const expressApp = setupController(requestHandler);

  const port = process.env.PORT ?? DEFAULT_PORT;
  expressApp.listen(port);
  console.log(`Application is up and running on port ${port}`);
}

main();
