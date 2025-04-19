// TodoItem.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTodoTitle,
  selectTodoById,
  toggleStatus,
  deleteTodo,
} from "../store/todoSlice";

const TodoItem = ({ id }) => {
  const dispatch = useDispatch();
  const todo = useSelector((state) => selectTodoById(state, id));
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo?.title || "");

  // Стили для завершенных задач
  const completedStyle = {
    textDecoration: todo?.completed ? "line-through" : "none",
    opacity: todo?.completed ? 0.5 : 1,
  };

  // Обработчик изменения заголовка
  const handleTitleUpdate = async () => {
    if (newTitle.trim() && newTitle !== todo.title) {
      try {
        await dispatch(updateTodoTitle({ id, newTitle })).unwrap();
      } catch (error) {
        console.error("Failed to update title:", error);
      }
    }
    setIsEditing(false);
  };

  if (!todo) return null;

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch(toggleStatus(todo.id))}
      />

      {/* Иконка редактирования */}
      <span
        className="edit-icon"
        onClick={() => setIsEditing(true)}
        role="button"
        tabIndex={0}
      >
        ✏️
      </span>

      {/* Поле редактирования */}
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleTitleUpdate}
          onKeyPress={(e) => e.key === "Enter" && handleTitleUpdate()}
          autoFocus
        />
      ) : (
        <span style={completedStyle}>{todo.title}</span>
      )}

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
