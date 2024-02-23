import { DataSource } from "typeorm";
import "reflect-metadata";
import { ScrapRequest } from "./entity/scrapRequest.entity";
import path from "path";

export const initializeDatasource = async () => {
  const dataSource = new DataSource({
    type: "sqlite",
    database: `${path.resolve(__dirname, "..")}/db.sqlite`,
    synchronize: true,
    logging: false,
    entities: [ScrapRequest],
  });

  await dataSource.initialize();

  return dataSource;
};
