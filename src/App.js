import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";

import TodoBoard from "./components/TodoBoard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import api from "./utils/api";

function App() {

  const [todoList,setTodoList] = useState([]);
  const [todoValue,setTodoValue] = useState("");

  const getTasks = async() =>{
    const response = await api.get("/tasks");
    console.log("rrrrr",response);
    setTodoList(response.data.data);
  };

  const addTask = async () =>{
    try{
      const response = await api.post("/tasks",{
        task : todoValue,
        isComplete: false,
      });
      if(response.status === 200){
        console.log ("성공");
        setTodoValue("")   //값을 초기화 (값을 넣고 검색에서 추가하면 값을 추가한뒤 사라짐)
        getTasks ();       // 추가한 값이 안보이기때문에(리프레쉬하면보임) 다시불러오게함
      }else{
        throw new Error("task can not be added");
      }

    }catch(err){}
  };

 // =========유저는 끝남, 안끝남 버튼을 누르면서 메모의 상태를 바꿀 수 있다. 끝난 메모는 회색으로 처리된다
  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  //==========삭제기능

  const deleteItem = async (id) => {
    try {
      console.log(id);
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  useEffect (()=>{
    getTasks();
  },[]);

  return (
    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요" 
            className="input-box"
            value={todoValue}
            onChange={(e)=> setTodoValue(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button className="button-add" onClick={addTask}>추가</button>
        </Col>
      </Row>

      <TodoBoard todoList = {todoList}
      deleteItem={deleteItem}
      toggleComplete={toggleComplete}/>
    </Container>
  );
}

export default App;
