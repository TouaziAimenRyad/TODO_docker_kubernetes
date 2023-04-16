import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
const MainComponent = () => {
  
  return (
    <div className="container">
      <InputTodo />
      <ListTodos />
    </div>
  );
};

export default MainComponent;
