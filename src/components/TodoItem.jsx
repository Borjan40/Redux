import { useDispatch } from "react-redux";
import { deleteTodo, toggleStatus } from "../store/todoSlice";

const TodoItem = ({ id, title, completed }) => {
  const dsptch = useDispatch();

  return (
    <li>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dsptch(toggleStatus(id))}
      />
      <span>{title}</span>
      <span className="delete" onClick={() => dsptch(deleteTodo(id))}>
        &times;
      </span>
    </li>
  );
};

export default TodoItem;
