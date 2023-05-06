import type { FC } from "react";
import toast from "react-hot-toast";
import { type AllTodos } from "~/types/todo";
import { api } from "~/utils/api";

export const Todo: FC<{ todo: AllTodos[number] }> = ({
  todo: { id, done, text },
}) => {
  const trpc = api.useContext();
  const { mutate: doneMutation } = api.todo.toggle.useMutation({
    onMutate: async ({ id, done }) => {
      // Cancel any outgoing refetches
      await trpc.todo.all.cancel();

      // Snapshot the previous values
      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) =>
        !prev
          ? previousTodos
          : prev.map((t) => (t.id === id ? { ...t, done } : t))
      );

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      toast.error(
        `An unexpected error occored when toggling Todo to ${
          done ? "done" : "incomplete"
        }`,
        { position: "bottom-right" }
      );
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });
  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onMutate: async (todoId) => {
      // Cancel any outgoing refetches
      await trpc.todo.all.cancel();

      // Snapshot the previous values
      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) =>
        !prev ? previousTodos : prev.filter((t) => t.id !== todoId)
      );

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      toast.error("An unexpected error occored when deleting Todo", {
        position: "bottom-right",
      });
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="done"
          id={id}
          checked={done}
          className="focus:ring-3 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          onChange={(e) => {
            doneMutation({ id, done: e.target.checked });
          }}
        />
        <label
          htmlFor={id}
          className={`cursor-pointer ${done ? "line-through" : ""}`}
        >
          {text}
        </label>
      </div>
      <button
        className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        onClick={() => {
          deleteMutation(id);
        }}
      >
        Delete
      </button>
    </div>
  );
};
