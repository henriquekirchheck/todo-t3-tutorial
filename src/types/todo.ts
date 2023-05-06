import { type inferRouterOutputs } from '@trpc/server'
import { z } from "zod";
import { type AppRouter } from '~/server/api/root'

type TodoRouterOutputs = inferRouterOutputs<AppRouter>["todo"]
export type AllTodos = TodoRouterOutputs["all"]

export const todoInput = z
  .string({
    required_error: "Please describe your todo",
  })
  .min(1, "Todo must contain more than 1 character")
  .max(50, "Todo can't be bigger than 50 characters");

export const todoId = z.string()

export const todoToggle = z.object({
  id: z.string(),
  done: z.boolean(),
});
