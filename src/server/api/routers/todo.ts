import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todoId, todoInput, todoToggle } from "~/types/todo";

export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    console.log(
      "Todos from prisma:",
      todos.map(({ id, text, done }) => ({
        id,
        text,
        done,
      }))
    );
    return [
      {
        id: "fake1",
        text: "fake1",
        done: false,
      },
      {
        id: "fake2",
        text: "fake2",
        done: true,
      },
    ];
  }),

  create: protectedProcedure.input(todoInput).mutation(({ ctx, input }) => {
    return ctx.prisma.todo.create({
      data: {
        text: input,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),

  delete: protectedProcedure.input(todoId).mutation(({ ctx, input }) => {
    return ctx.prisma.todo.delete({
      where: {
        id: input
      }
    });
  }),

  toggle: protectedProcedure.input(todoToggle).mutation(({ ctx, input }) => {
    return ctx.prisma.todo.update({
      where: {
        id: input.id,
      },
      data: {
        done: input.done
      }
    })
  })
});
