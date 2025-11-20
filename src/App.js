import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    if (editId) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, text: input } : t))
      );
      setEditId(null);
    } else {
      setTodos((prev) => [
        ...prev,
        { id: Date.now().toString(), text: input, done: false },
      ]);
    }
    setInput("");
  };

  const toggleDone = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteDone = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const deleteAll = () => {
    setTodos([]);
  };

  const filteredTodos =
    filter === "done"
      ? todos.filter((t) => t.done)
      : filter === "todo"
      ? todos.filter((t) => !t.done)
      : todos;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updated = Array.from(todos);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setTodos(updated);
  };

  return (
    <div className="app">
      <h1 className="title">Add Your Plans</h1>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="✍️ Add a new task..."
          className="input"
        />
        <button onClick={addTodo} className="btn add">
          {editId ? "Update" : "Add Task"}
        </button>
      </div>

      <div className="filter-buttons">
        {["all", "done", "todo"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`btn filter ${filter === type ? "active" : ""}`}
          >
            {type}
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="todo-list"
            >
              {filteredTodos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`todo-item ${
                        snapshot.isDragging ? "dragging" : ""
                      }`}
                    >
                      <span className="handle" title="Drag to reorder">
                        ☰
                      </span>

                      <span
                        className={`todo-text ${todo.done ? "done" : ""}`}
                      >
                        {todo.text}
                      </span>

                      <div className="actions">
                        <input
                          type="checkbox"
                          checked={todo.done}
                          onChange={() => toggleDone(todo.id)}
                        />
                        <span
                          className="icon edit"
                          title="Edit task"
                          onClick={() => {
                            setInput(todo.text);
                            setEditId(todo.id);
                          }}
                        >
                          ✏️
                        </span>
                        <span
                          className="icon delete"
                          title="Delete task"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          🗑️
                        </span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="footer-buttons">
        <button onClick={deleteDone} className="btn danger">
          Delete Done Tasks
        </button>
        <button onClick={deleteAll} className="btn danger">
          Delete All
        </button>
      </div>
    </div>
  );
}
