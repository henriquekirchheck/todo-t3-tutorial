import type { FC } from "react";
import { api } from "~/utils/api";
import { Todo } from './Todo'

export const Todos: FC = () => {
  const { data: todos, isLoading, isError } = api.todo.all.useQuery();
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching Todos</p>
  return <div className='flex flex-col gap-3'>
    {todos.length ? todos.map(todo => {
      return <Todo key={todo.id} todo={todo}/>
    }) : "Create your first todo!"}
  </div>;
};
