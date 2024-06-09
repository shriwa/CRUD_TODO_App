import React from "react";
import Navbar from "../Components/Navbar";
import Todo from "../Components/Todo";
import TaskList from "../Components/TaskList";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Todo />
      <TaskList />
    </div>
  );
};

export default Home;
