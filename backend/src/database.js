import { TodoSchema } from "./todo-schema.js";
import { DataSource } from "typeorm";

export const db = new DataSource({
  type: "sqlite",
  database: `todos.sqlite`,
  synchronize: true,
  entities: [TodoSchema],
  logging: true,
});
