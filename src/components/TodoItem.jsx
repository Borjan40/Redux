import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, toggleStatus, selectTodoById } from "../store/todoSlice";

const TodoItem = ({ id }) => {
  const dispatch = useDispatch();
  // Получаем конкретный todo по ID
  const todo = useSelector((state) => selectTodoById(state, id));
  // Если todo не найден (например, был удален)
  if (!todo) return null;
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch(toggleStatus(todo.id))}
      />
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          opacity: todo.completed ? 0.5 : 1,
        }}
      >
        {todo.title}
      </span>
      <span className="price-tag">${todo.price}</span>
      <span
        className="delete"
        onClick={() => dispatch(deleteTodo(todo.id))}
        title="Delete task"
      >
        &times;
      </span>
    </li>
  );
};

export default TodoItem;
