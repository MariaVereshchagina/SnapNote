import "./CompletedTaskList.css";
import TaskItem from "../TaskItem/TaskItem";

export default function CompletedTaskList({ completedTasks, deleteTask }) {
  return (
    <ul className="completed-task-list">
      {completedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          completeTask={() => {}}
        />
      ))}
    </ul>
  );
}
