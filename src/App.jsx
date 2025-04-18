import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addNewTodo, fetchTodos } from "./store/todoSlice";

import TodoList from "./components/TodoList";
import InpField from "./components/InpField";

function App() {
  const [text, setText] = useState("");
  const { status, error } = useSelector((state) => state.someTodos);
  const dsptch = useDispatch();

  const addTask = () => {
    if (text.trim().length) {
      dsptch(addNewTodo(text)); // объект с ключем inpText, со знач. text из useState
      setText("");
    }
  };

  useEffect(() => {
    dsptch(fetchTodos());
  }, [dsptch]);
  return (
    <div className="App">
      <InpField title={text} handleInput={setText} handleSubmit={addTask} />

      {status === "loading" && <h2>Loading...</h2>}

      {error && <h2>An error occerd: {error} </h2>}
      <TodoList />
    </div>
  );
}

export default App;
