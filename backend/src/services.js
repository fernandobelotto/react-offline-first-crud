import { TodoSchema } from "./todo-schema.js";
import { db } from './database.js'

export async function listTodos(_req, res,) {
  res.json(await db.getRepository(TodoSchema).find())
}

export async function createTodo(req, res) {
  const result = await db.getRepository(TodoSchema).save(req.body)
  res.status(201).json(result);
}

export async function updateTodo(req, res) {
  try {
    const findResult = await db.getRepository(TodoSchema).findOneBy({ id: req.params.id })
    findResult.content = req.body.content
    const updateResult = await db.getRepository(TodoSchema).save(findResult)
    res.json(updateResult)
  } catch (e) {
    res.status(404).json({ error: 'item not found' })
  }
}

export async function deleteTodo(req, res) {
  res.json(await db.getRepository(TodoSchema).delete(req.params.id));
}
