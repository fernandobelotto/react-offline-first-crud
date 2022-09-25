import express from "express";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./services.js";

const router = express.Router();

router.route("/")
    .get(listTodos)
    .post(createTodo);

router.route("/:id")
    .put(updateTodo)
    .delete(deleteTodo);
    
export { router };
