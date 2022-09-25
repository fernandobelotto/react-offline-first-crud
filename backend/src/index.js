import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router } from "./routes.js";
import { db } from "./database.js";

const app = express();

app.use(cors());

app.use(morgan("tiny"));

app.use(express.json());

app.use("/", router);

app.listen(3000, () => {
  db.initialize()
    .then((res) => console.log("db working"))
    .catch((error) => console.log("error running db"));
  console.log("listening on http://locahost:3000");
});
