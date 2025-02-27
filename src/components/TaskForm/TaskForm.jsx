import { useState } from "react";
import "./TaskForm.css";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() && deadline) {
      addTask({ title, priority, deadline });
      setTitle("");
      setPriority("Low");
      setDeadline("");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        placeholder="Название задачи"
        required
        className="task-input"
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        value={priority}
        className="task-select"
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Низкий</option>
        <option value="Medium">Средний</option>
        <option value="High">Высокий</option>
      </select>
      <input
        type="datetime-local"
        required
        value={deadline}
        className="task-date-input"
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit" className="task-button">
        Добавить задачу
      </button>
    </form>
  );
}
