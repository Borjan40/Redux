import { useSelector } from "react-redux";
import Todoitem from "./TodoItem";

const TodoList = () => {
  const todos = useSelector((state) => {
    // console.log("state-->", state);
    return state.someTodos.rootTodos;
  });

  return (
    <ul>
      {todos.map((todo) => (
        <Todoitem
          key={todo.id}
          // onRemove={onRemoveTodo}
          // onToggle={onToggleTodoCompl}
          {...todo}
        />
      ))}
    </ul>
  );
};

export default TodoList;
