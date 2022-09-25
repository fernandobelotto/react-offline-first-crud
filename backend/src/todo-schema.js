import { EntitySchema } from "typeorm";
class TodoModel {
  constructor(id, content) {
    this.id = id;
    this.content = content;
  }
}

export const TodoSchema = new EntitySchema({
  name: "TodoModel",
  target: TodoModel,
  columns: {
    id: {
      primary: true,
      type: "uuid",
    },
    content: {
      type: "text",
    },
  },
});
