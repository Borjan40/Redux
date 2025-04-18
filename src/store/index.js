import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice"; //  мы не достаем алиас todoReducer из "./todoSlice", его экспортир. по дефолту
export default configureStore({
  reducer: {
    someTodos: todoReducer,
  },
});


