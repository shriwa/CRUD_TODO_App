import React from "react";
import Navbar from "../Components/Navbar";
import Todo from "../Components/Todo";
import TaskList from "../Components/TaskList";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-auto">
      <Navbar />
      <Todo />
      <TaskList />
    </div>
  );
};

export default Home;
