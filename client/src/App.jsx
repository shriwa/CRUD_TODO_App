import { useState } from "react";
import Navbar from "./Components/Navbar";
import Todo from "./Components/Todo";
import TaskList from "./Components/TaskList";
import Home from "./Pages/Home";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
