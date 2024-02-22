import { DataSource } from "typeorm";

export const initializeDatasource = async () => {
  const dataSource = new DataSource({
    type: "sqlite",
    database: "../database.sql",
    synchronize: true,
    logging: true,
    entities: ["./entity/*"],
  });

  await dataSource.initialize();

  return dataSource;
};
