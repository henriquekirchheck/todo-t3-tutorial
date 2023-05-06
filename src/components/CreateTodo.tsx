import { useSession } from "next-auth/react";
import { useRef, type FC } from "react";
import { toast } from "react-hot-toast";
import { todoInput, type AllTodos } from "~/types/todo";
import { api } from "~/utils/api";

export const CreateTodo: FC = () => {
  const session = useSession();
  const todoRef = useRef<HTMLInputElement>(null);
  const trpc = api.useContext();
  const { mutate } = api.todo.create.useMutation({
    onMutate: async (todo) => {
      // Cancel any outgoing refetches
      await trpc.todo.all.cancel();

      // Snapshot the previous values
      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => {
        const optimisticTodo = {
          id: "optimistic-todo-placeholder-id",
          done: false,
          text: todo,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: session.data?.user.id ?? "Optimistic ID",
        } satisfies AllTodos[number];
        return !prev ? [optimisticTodo] : [...prev, optimisticTodo];
      });

      if (todoRef.current) todoRef.current.value = "";

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      toast.error("An unexpected error occored when creating Todo", {
        position: "bottom-right",
      });
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (todoRef.current === null) return;
          const parsedInput = todoInput.safeParse(todoRef.current.value);

          if (!parsedInput.success)
            return void toast.error(
              parsedInput.error.format()._errors.join("\n"),
              { position: "bottom-right" }
            );

          mutate(parsedInput.data);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          name="new-todo"
          id="new-todo"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          ref={todoRef}
        />
        <button
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  );
};
