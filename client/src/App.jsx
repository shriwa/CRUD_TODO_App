import { useState } from "react";
import Navbar from "./Components/Navbar";
import Todo from "./Components/Todo";
import TaskList from "./Components/TaskList";

function App() {
  return (
    <div>
      <Navbar />
      <Todo />
      <TaskList />
    </div>
  );
}

export default App;
