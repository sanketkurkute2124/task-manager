// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   CardActions,
//   Chip,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Box,
//   Grid,
//   IconButton,
//   Fab,
//   AppBar,
//   Toolbar,
//   InputAdornment,
//   Paper,
// } from "@mui/material";

// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   CloudDownload as DownloadIcon,
//   CloudUpload as UploadIcon,
// } from "@mui/icons-material";

// import { isAfter, isToday, parseISO } from "date-fns";
// import { exportToExcel, importFromExcel } from "./excelService";

// const priorityColors = {
//   Low: "success",
//   Medium: "warning",
//   High: "error",
// };

// function TaskManager() {
//   const [tasks, setTasks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [priorityFilter, setPriorityFilter] = useState("All");
//   const [editingTask, setEditingTask] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     status: "To Do",
//     priority: "Medium",
//     dueDate: "",
//   });

//   // Load tasks
//   useEffect(() => {
//     const savedTasks = localStorage.getItem("tasks");
//     if (savedTasks) setTasks(JSON.parse(savedTasks));
//   }, []);

//   // Save tasks
//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//   }, [tasks]);

//   // Filter tasks
//   const filteredTasks = tasks.filter((task) => {
//     return (
//       (searchTerm === "" ||
//         task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         task.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (statusFilter === "All" || task.status === statusFilter) &&
//       (priorityFilter === "All" || task.priority === priorityFilter)
//     );
//   });

//   const handleSaveTask = () => {
//     if (!formData.title.trim()) return;

//     const taskData = {
//       id: editingTask ? editingTask.id : Date.now(),
//       ...formData,
//       createdAt: editingTask
//         ? editingTask.createdAt
//         : new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     if (editingTask) {
//       setTasks(tasks.map((t) => (t.id === editingTask.id ? taskData : t)));
//     } else {
//       setTasks([...tasks, taskData]);
//     }

//     setEditingTask(null);
//     setFormData({
//       title: "",
//       description: "",
//       status: "To Do",
//       priority: "Medium",
//       dueDate: "",
//     });
//   };

//   const handleDeleteTask = (taskId) => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       setTasks(tasks.filter((task) => task.id !== taskId));
//     }
//   };

//   const isOverdue = (dueDate) => {
//     if (!dueDate) return false;
//     return isAfter(new Date(), parseISO(dueDate)) && !isToday(parseISO(dueDate));
//   };

//   return (
//     <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
//       {/* Header */}
//       <AppBar position="static" sx={{ mb: 3 }}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Task Manager
//           </Typography>

//           <Button color="inherit" startIcon={<UploadIcon />} component="label">
//             Import
//             <input
//               type="file"
//               hidden
//               onChange={(e) => importFromExcel(e.target.files[0], setTasks)}
//             />
//           </Button>

//           <Button
//             color="inherit"
//             startIcon={<DownloadIcon />}
//             onClick={() => exportToExcel(tasks)}
//           >
//             Export
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="lg">
//         {/* Filters */}
//         <Paper sx={{ p: 2, mb: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 placeholder="Search tasks..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>

//             <Grid item xs={6} md={2}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={statusFilter}
//                   label="Status"
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <MenuItem value="All">All</MenuItem>
//                   <MenuItem value="To Do">To Do</MenuItem>
//                   <MenuItem value="In Progress">In Progress</MenuItem>
//                   <MenuItem value="Done">Done</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={6} md={2}>
//               <FormControl fullWidth>
//                 <InputLabel>Priority</InputLabel>
//                 <Select
//                   value={priorityFilter}
//                   label="Priority"
//                   onChange={(e) => setPriorityFilter(e.target.value)}
//                 >
//                   <MenuItem value="All">All</MenuItem>
//                   <MenuItem value="Low">Low</MenuItem>
//                   <MenuItem value="Medium">Medium</MenuItem>
//                   <MenuItem value="High">High</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Typography variant="body2">
//                 {filteredTasks.length} of {tasks.length} tasks
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Task List */}
//         <Grid container spacing={2}>
//           {filteredTasks.map((task) => (
//             <Grid item xs={12} sm={6} md={4} key={task.id}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">{task.title}</Typography>

//                   <Chip
//                     label={task.priority}
//                     color={priorityColors[task.priority]}
//                     sx={{ mb: 1 }}
//                   />

//                   {task.description && (
//                     <Typography variant="body2">
//                       {task.description}
//                     </Typography>
//                   )}

//                   {isOverdue(task.dueDate) && (
//                     <Typography color="error" variant="caption">
//                       Overdue
//                     </Typography>
//                   )}
//                 </CardContent>

//                 <CardActions>
//                   <IconButton>
//                     <EditIcon />
//                   </IconButton>

//                   <IconButton onClick={() => handleDeleteTask(task.id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Add Button */}
//         <Fab
//           color="primary"
//           sx={{ position: "fixed", bottom: 20, right: 20 }}
//           onClick={handleSaveTask}
//         >
//           <AddIcon />
//         </Fab>
//       </Container>
//     </Box>
//   );
// }

// export default TaskManager;

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
  InputAdornment,
  Paper,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudDownload as DownloadIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";

import { isAfter, isToday, parseISO } from "date-fns";
import { exportToExcel, importFromExcel } from "./excelService";

const priorityColors = {
  Low: "success",
  Medium: "warning",
  High: "error",
};

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
  });

  // Load tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    return (
      (searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || task.status === statusFilter) &&
      (priorityFilter === "All" || task.priority === priorityFilter)
    );
  });

  // Save / Update Task
  const handleSaveTask = () => {
    if (!formData.title.trim()) return;

    const taskData = {
      id: editingTask ? editingTask.id : Date.now(),
      ...formData,
      createdAt: editingTask
        ? editingTask.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? taskData : t)));
    } else {
      setTasks([...tasks, taskData]);
    }

    // Reset form
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
    });
  };

  // Edit Task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData(task);
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return isAfter(new Date(), parseISO(dueDate)) && !isToday(parseISO(dueDate));
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>

          <Button color="inherit" startIcon={<UploadIcon />} component="label">
            Import
            <input
              type="file"
              hidden
              onChange={(e) => importFromExcel(e.target.files[0], setTasks)}
            />
          </Button>

          <Button
            color="inherit"
            startIcon={<DownloadIcon />}
            onClick={() => exportToExcel(tasks)}
          >
            Export
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Add / Edit Form */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                sx={{ height: "56px" }}
                onClick={handleSaveTask}
              >
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <Select
                fullWidth
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6} md={2}>
              <Select
                fullWidth
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Paper>

        {/* Task List */}
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>

                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority]}
                    sx={{ mb: 1 }}
                  />

                  {task.description && (
                    <Typography variant="body2">
                      {task.description}
                    </Typography>
                  )}

                  {isOverdue(task.dueDate) && (
                    <Typography color="error" variant="caption">
                      Overdue
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <IconButton onClick={() => handleEditTask(task)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default TaskManager;