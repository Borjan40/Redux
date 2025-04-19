import React from 'react';
import { useSelector } from 'react-redux';
import TodoItem from './TodoItem';
import { selectAllTodos } from '../store/todoSlice';
// Импортируем селектор для получения ID задач

const TodoList = () => {
  const allTodos = useSelector(selectAllTodos);
// console.log(allTodos); // Проверяем, что ID задач получены корректно
  return (
    <ul>
      {allTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          price={todo.price} // Если нужно отображать цену
        />
      ))}
    </ul>
  );
};

export default TodoList;