import { z } from "zod";

export const todoInput = z.string({
  required_error: "Please describe your todo",
}).min(1).max(50, "Todo can't be bigger than 50 characters");

export const todoId = z.string()

export const todoToggle = z.object({
  id: todoId,
  done: z.boolean()
})
