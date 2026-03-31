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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  AppBar,
  Toolbar,
  InputAdornment,
  Paper,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudDownload as DownloadIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as TodoIcon,
  PlayArrow as InProgressIcon,
} from "@mui/icons-material";
import { format, isAfter, isToday, parseISO } from "date-fns";
import { exportToExcel, importFromExcel } from "./excelService";

const priorityColors = {
  Low: "success",
  Medium: "warning",
  High: "error",
};

const statusIcons = {
  "To Do": <TodoIcon />,
  "In Progress": <InProgressIcon />,
  "Done": <CheckCircleIcon />,
};

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [open, setOpen] = useState(false);
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
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Direct filtering (best approach)
  const filteredTasks = tasks.filter((task) => {
    return (
      (searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || task.status === statusFilter) &&
      (priorityFilter === "All" || task.priority === priorityFilter)
    );
  });

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        dueDate: "",
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = () => {
    if (!formData.title.trim()) return;

    const taskData = {
      id: editingTask ? editingTask.id : Date.now(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
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

    handleCloseDialog();
  };

  // ✅ Delete confirmation added
  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return isAfter(new Date(), parseISO(dueDate)) && !isToday(parseISO(dueDate));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "default";
      case "In Progress":
        return "primary";
      case "Done":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Modern Task Manager
          </Typography>

          <Button color="inherit" startIcon={<UploadIcon />} component="label">
            Import Excel
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
            Export Excel
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Search & Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tasks..."
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
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
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
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                {filteredTasks.length} of {tasks.length} tasks
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Task Cards */}
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Chip label={task.priority} color={priorityColors[task.priority]} />

                  {task.description && <Typography>{task.description}</Typography>}
                </CardContent>

                <CardActions>
                  <IconButton onClick={() => handleOpenDialog(task)}>
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

        {/* FAB */}
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
}

export default TaskManager;