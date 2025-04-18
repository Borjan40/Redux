import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      if (!response.ok) {
        throw new Error("Server Error");
      }
      const data = await response.json();
      console.log("fetchTodos-->", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async function (id, { rejectWithValue, dispatch, getState }) {
    try {
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Cant delete task. Server error");
      }

      dispatch(removeTodo({ inpId: id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "todos/toggleStatus",
  async function (toggledId, { rejectWithValue, dispatch, getState }) {
    // const todoFromState = getState().someTodos.rootTodos.find(
    //   (todo) => todo.id === toggledId
    // );
    // console.log("state price-->", todoFromState.price);
    // let priceisUp = todoFromState.price - todoFromState.price + 55;
    // let priceisDown = todoFromState.price - todoFromState.price + 2;
    // let toggledPrice = todoFromState.price < 50 ? priceisUp : priceisDown;

    try {
      // Сначала получаем свежие данные с сервера
      const freshDataResponse = await fetch(
        `https://api.escuelajs.co/api/v1/products/${toggledId}`
      );
      const freshData = await freshDataResponse.json();
      // Обновляем цену
      const toggledPrice = freshData.price < 50 ? 55 : 2;

      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products/${toggledId}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            ...freshData,
            title: freshData.title,
            price: toggledPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Cant toggle status. Server error");
      }

      const data = await response.json();
      // dispatch(toggleTodoComplete({ inpId: toggledId }));
      dispatch(toggleTodoComplete(data));
      console.log("toggled price-->", data.price);
      console.log("togglestatus-->", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async function (text, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      if (!response.ok) {
        throw new Error("Server Error response");
      }

      const data = await response.json();
      console.log("запрос данных внутри addNewTodo -->", data);
      let lastElem = data.unshift();

      const todo = {
        title: text,
        price: lastElem,
        description: "Privet iz Pitera",
        categoryId: 2,
        images: ["https://placeimg.com/6test0/"],
      };

      const addresp = await fetch("https://api.escuelajs.co/api/v1/products", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (!addresp.ok) {
        throw new Error("Server Error addresp");
      }
      const dataAddresp = await addresp.json();
      console.log("POST responce data.title -->", dataAddresp.title);

      dispatch(addTodo(dataAddresp));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const setError = (state, action) => {
  state.status = "rejected";
  state.error = action.payload;
};

const todoSlice = createSlice({
  name: "ToDos",
  initialState: {
    rootTodos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.rootTodos.push({
        id: action.payload.id,
        title: action.payload.title,
        completed: false,
        price: action.payload.price,
      });
    },
    removeTodo(state, action) {
      state.rootTodos = state.rootTodos.filter(
        (todo) => todo.id !== action.payload.inpId
      );
    },
    toggleTodoComplete(state, action) {
      const toggledtodo = state.rootTodos.find(
        (todo) => todo.id === action.payload.id
      );
      toggledtodo.price = action.payload.price;
      toggledtodo.completed = !toggledtodo.completed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "resolved";
        const newArr = action.payload.map(function (item) {
          let premiumProduct = false;
          Number(item.price) > 50 && (premiumProduct = !premiumProduct);
          return { ...item, completed: premiumProduct };
        });
        state.rootTodos = newArr;
      })
      .addCase(fetchTodos.rejected, setError)
      .addCase(deleteTodo.rejected, setError)
      .addCase(toggleStatus.pending, (state, action) => {
        state.status = "loading";
        console.log("extraReducers toggleStatus.pending action-->", action);
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        state.status = "resolved";

        // console.log(
        //   "before extraReducers toggleStatus.fulfilled state.rootTodos-->",
        //   state.rootTodos[0]
        // );
        // state.rootTodos[0].description = "store description";
        // console.log(
        //   "after extraReducers toggleStatus.fulfilled state.rootTodos-->",
        //   state.rootTodos[0].description
        // );
        // console.log(
        //   "extraReducers toggleStatus.fulfilled action.payload-->",
        //   action.payload
        // );
      })
      .addCase(toggleStatus.rejected, setError);
  },
});

export const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions; // через десптруктуриз. достаем экшены
export default todoSlice.reducer; // достаем редьюсер
