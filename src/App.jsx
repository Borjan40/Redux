import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos, addNewTodo } from "./store/todoSlice";
import { selectTodosStatus, selectTodosError } from "./store/todoSlice";
import TodoList from "./components/TodoList";
import InpField from "./components/InpField";

function App() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  // Новые селекторы
  const status = useSelector(selectTodosStatus);
  const error = useSelector(selectTodosError);
  const addTask = () => {
    if (text.trim().length) {
      dispatch(addNewTodo(text));
      setText("");
    }
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="App">
      <InpField title={text} handleInput={setText} handleSubmit={addTask} />
      {status === "loading" && <h2>Loading...</h2>}
      {status === "adding" && <h2>Adding todo...</h2>}
      {error && <h2>Error: {error}</h2>}
      <TodoList />
    </div>
  );
}

export default App;
