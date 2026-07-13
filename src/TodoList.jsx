import { useState, useEffect } from "react";

export default function TodoFunction() {
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todoArr")) || [],
  );
  const activeTodos = todos.filter((todo) => todo.completed === false);
  const completedTodos = todos.filter((todo) => todo.completed === true);
  const [filterType, setFilterType] = useState("all");
  const [input, setInput] = useState("");
  const [editText, setEditText] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todoArr", JSON.stringify(todos));
    } else {
      localStorage.setItem("todoArr", JSON.stringify([]));
    }
  }, [todos]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  function todoInsertHandler() {
    if (input === "" || input.trim() === "") {
      return;
    }
    setTodos([
      ...todos,
      {
        id: Date.now(),
        task: input,
        completed: false,
        isEditing: false,
      },
    ]);
    setToast("Task added to To-Do List Successfully!");
    setInput("");
  }

  function todoFilterUpdate(filterTypeText) {
    setFilterType(filterTypeText);
  }

  function completionStatusChange(todoId) {
    const newTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      } else {
        return todo;
      }
    });

    setTodos(newTodos);
  }

  function todoUpdateHandler(todoId) {
    const newTodos = todos.map((todo) => {
      if (todo.id === todoId && !todo.completed) {
        if (!todo.isEditing) {
          setEditText(todo.task);
        }
        return {
          ...todo,
          isEditing: !todo.isEditing,
        };
      } else {
        return todo;
      }
    });

    setTodos(newTodos);
  }

  function updateTask(taskId) {
    const newTodos = todos.map((todo) => {
      if (todo.id === taskId) {
        return {
          ...todo,
          task: editText,
          isEditing: false,
        };
      } else {
        return todo;
      }
    });

    setToast("Task updated Successfully!");
    setTodos(newTodos);
  }

  function closeUpdate(taskId) {
    const newTodos = todos.map((todo) => {
      if (todo.id === taskId) {
        return {
          ...todo,
          task: todo.task,
          isEditing: false,
        };
      } else {
        return todo;
      }
    });

    setTodos(newTodos);
  }

  function todoDeleteHandler(todoId) {
    setTodos(todos.filter((todo) => todo.id !== todoId));
    setToast("Task deleted Successfully!");
  }

  let filteredTodoList = todos;

  if (filterType === "active") {
    filteredTodoList = activeTodos;
  } else if (filterType === "completed") {
    filteredTodoList = completedTodos;
  }

  return (
    <>
      {toast && <p id="toast-notification">{toast}</p>}
      <div id="todo-container">
        <h1>To-Do List App</h1>
        <hr />
        <div className="actionable-top-btns">
          <button
            className={`filter ${filterType === "all" ? "active" : ""}`}
            onClick={() => todoFilterUpdate("all")}
          >
            All ({todos.length})
          </button>
          <button
            className={`filter ${filterType === "active" ? "active" : ""}`}
            onClick={() => todoFilterUpdate("active")}
          >
            Active ({activeTodos.length})
          </button>
          <button
            className={`filter ${filterType === "completed" ? "active" : ""}`}
            onClick={() => todoFilterUpdate("completed")}
          >
            Completed ({completedTodos.length})
          </button>
          <input
            type="text"
            placeholder="Enter task ..."
            id="add-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyUp={(e) => {
              e.key === "Enter" && todoInsertHandler();
            }}
          />
          <button id="add-todo-btn" onClick={todoInsertHandler}>
            🞣 Add Todo
          </button>
        </div>
        <hr />

        <ul className="list-container">
          {filteredTodoList.map((todo) =>
            todo.isEditing ? (
              <>
                <li key={todo.id}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyUp={(e) => {
                      e.key === "Enter" && updateTask(todo.id);
                    }}
                    className="editInput"
                  ></input>
                  <button
                    className="edit-btn"
                    onClick={() => updateTask(todo.id)}
                  >
                    Save
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => closeUpdate(todo.id)}
                  >
                    Close
                  </button>
                </li>
              </>
            ) : (
              <li key={todo.id} className={todo.completed ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => completionStatusChange(todo.id)}
                />{" "}
                <span className="task-name">{todo.task}</span>{" "}
                <button
                  className="edit-btn"
                  onClick={() => todoUpdateHandler(todo.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => todoDeleteHandler(todo.id)}
                >
                  Delete
                </button>
              </li>
            ),
          )}
        </ul>
      </div>
    </>
  );
}
