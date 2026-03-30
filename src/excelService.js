import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (tasks) => {
    // Convert tasks to Excel format
    const excelData = tasks.map(task => ({
        Title: task.title,
        Description: task.description || "",
        Status: task.status,
        Priority: task.priority,
        DueDate: task.dueDate || "",
        CreatedAt: task.createdAt,
        UpdatedAt: task.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(data, "tasks.xlsx");
};

export const importFromExcel = (file, setTasks) => {
    const reader = new FileReader();

    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Convert Excel format to app format
        const tasks = json.map(row => ({
            id: Date.now() + Math.random(), // Generate unique ID
            title: row.Title || row.Task || "",
            description: row.Description || "",
            status: row.Status || "To Do",
            priority: row.Priority || "Medium",
            dueDate: row.DueDate || "",
            createdAt: row.CreatedAt || new Date().toISOString(),
            updatedAt: row.UpdatedAt || new Date().toISOString(),
        }));

        setTasks(tasks);
    };

    reader.readAsArrayBuffer(file);
};