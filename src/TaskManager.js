import React, { useState } from "react";
import { exportToExcel, importFromExcel } from "./excelService";

function TaskManager() {

const [tasks, setTasks] = useState([]);
const [task, setTask] = useState("");

const addTask = () => {

if(task==="") return;

const newTask = {
Task: task,
Status: "Pending"
};

setTasks([...tasks, newTask]);

setTask("");
};

const deleteTask = (index) => {

const updated = tasks.filter((_,i)=> i!==index);

setTasks(updated);
};

return (

<div style={{width:"500px",margin:"auto"}}>

<h2>Task Manager</h2>

<input
value={task}
onChange={(e)=>setTask(e.target.value)}
placeholder="Enter Task"
/>

<button onClick={addTask}>Add</button>

<br/><br/>

<input
type="file"
accept=".xlsx,.xls"
onChange={(e)=>importFromExcel(e.target.files[0],setTasks)}
/>

<button onClick={()=>exportToExcel(tasks)}>
Download Excel
</button>

<table border="1" width="100%">

<thead>
<tr>
<th>Task</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{tasks.map((t,index)=>(
<tr key={index}>
<td>{t.Task}</td>
<td>{t.Status}</td>
<td>
<button onClick={()=>deleteTask(index)}>
Delete
</button>
</td>
</tr>
))}

</tbody>

</table>

</div>
);
}

export default TaskManager;