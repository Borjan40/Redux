import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

// 1. Используем EntityAdapter для нормализации данных
const todosAdapter = createEntityAdapter({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => a.id - b.id,
});

// 2. Конфигурация API
const API_BASE = "https://api.escuelajs.co/api/v1/products";

// 3. Общий обработчик ошибок
const handleRejected = (state, action) => {
  state.status = "failed";
  state.error = action.payload || action.error.message;
};

// 4. Асинхронные операции
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      // Получаем общее количество товаров
      const countResponse = await fetch(API_BASE);
      if (!countResponse.ok) throw new Error("Server Error");
      const allProducts = await countResponse.json();
      const totalCount = allProducts.length;

      // Рассчитываем offset для последних 10 элементов
      const offset = Math.max(totalCount - 10, 0);
      
      // Получаем последние 10 товаров
      const response = await fetch(`${API_BASE}?offset=${offset}&limit=10`);
      if (!response.ok) throw new Error("Server Error");
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      return id; // Возвращаем ID для автоматического удаления
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "todos/toggleStatus",
  async (id, { getState, rejectWithValue }) => {
    const todo = todosAdapter
      .getSelectors()
      .selectById(getState().someTodos, id);
    if (!todo) return rejectWithValue("Todo not found");
    const newPrice = todo.price < 50 ? 55 : 2;

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, price: newPrice }),
      });
      if (!response.ok) throw new Error("Update failed");
      const data = await response.json();
      // console.log("in thunk toggleStatus data --->",data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async (text, { rejectWithValue }) => {
    try {
      const newTodo = {
        title: text,
        price: Math.floor(Math.random() * 100),
        description: "Privet iz Pitera",
        categoryId: 2,
        images: ["https://placeimg.com/640/480"],
      };

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) throw new Error("Add failed");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Создание слайса с оптимизированными редьюсерами
const todoSlice = createSlice({
  name: "todos",
  initialState: todosAdapter.getInitialState({
    status: "idle",
    error: null,
    lastFetch: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload);
        state.status = "succeeded";
        state.lastFetch = Date.now();
      })
      .addCase(fetchTodos.rejected, handleRejected)

      // Add Todo
      .addCase(addNewTodo.pending, (state) => {
        state.status = "adding";
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        todosAdapter.addOne(state, action.payload);
        state.status = "succeeded";
      })
      .addCase(addNewTodo.rejected, handleRejected)

      // Toggle Status
      .addCase(toggleStatus.pending, (state) => {
        state.status = "updating";
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        const { id, price, updatedAt } = action.payload;
        
        todosAdapter.updateOne(state, {
          id: id,
          changes: {
            price: price,          // Обновляем только цену
            updatedAt: updatedAt,  // И время обновления
            completed: !state.entities[id].completed // Инвертируем локальный статус
          }
        });
        state.status = "succeeded";
      })
      .addCase(toggleStatus.rejected, handleRejected)

      // Delete Todo
      .addCase(deleteTodo.pending, (state) => {
        state.status = "deleting";
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        todosAdapter.removeOne(state, action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteTodo.rejected, handleRejected);
  },
});

// 6. Экспорт селекторов
export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds,
} = todosAdapter.getSelectors((state) => state.someTodos);

export const selectTodosStatus = (state) => state.someTodos.status;
export const selectTodosError = (state) => state.someTodos.error;

export default todoSlice.reducer;
